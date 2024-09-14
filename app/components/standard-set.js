import Ember from "ember"
import Fetcher from "../lib/fetcher"
import rpc from "../lib/rpc"
import _ from "npm:lodash"
import Standards from "../models/standards"
import hbs from "htmlbars-inline-precompile"
import { storageFor } from "ember-local-storage"
import Papa from "npm:papaparse"

const saveFile = async (blob, suggestedName) => {
  // Feature detection. The API needs to be supported
  // and the app not run in an iframe.
  const supportsFileSystemAccess =
    'showSaveFilePicker' in window &&
    (() => {
      try {
        return window.self === window.top;
      } catch (err) {
        return false;
      }
    })();
  // If the File System Access API is supported…
  if (supportsFileSystemAccess) {
    try {
      // Show the file save dialog.
      const handle = await showSaveFilePicker({
        suggestedName,
      });
      // Write the blob to the file.
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return;
    } catch (err) {
      // Fail silently if the user has simply canceled the dialog.
      if (err.name !== 'AbortError') {
        console.error(err.name, err.message);
        return;
      }
    }
  }
  // Fallback if the File System Access API is not supported…
  // Create the blob URL.
  const blobURL = URL.createObjectURL(blob);
  // Create the `<a download>` element and append it invisibly.
  const a = document.createElement('a');
  a.href = blobURL;
  a.download = suggestedName;
  a.style.display = 'none';
  document.body.append(a);
  // Programmatically click the element.
  a.click();
  // Revoke the blob URL and remove the element.
  setTimeout(() => {
    URL.revokeObjectURL(blobURL);
    a.remove();
  }, 1000);
};

export default Ember.Component.extend({
  pane: "standards",

  authenticate: Ember.inject.service(),
  session: storageFor("persistedSession"),

  isAuthenticated: Ember.computed("session.authenticatedAt", function() {
    return Date.now() - this.get("session.authenticatedAt") < 3100000
  }),

  classNameBindings: ["wasInserted"],

  addInsertedClass: Ember.on("didInsertElement", function() {
    Ember.run.later(
      this,
      () => {
        this.set("wasInserted", true)
      },
      10
    )
  }),

  linkToSet: Ember.computed("standardSetId", function() {
    return 'http://commonstandardsproject.com/search?ids=%5B"' + this.get("id") + '"%5D'
  }),

  showRemoveButton: Ember.computed("index", function() {
    return this.get("index") !== 0
  }),

  setPane: Ember.on("init", function() {
    if (this.get("id").match(/blank/) !== null) this.set("pane", "jurisdictions")
  }),

  standardSet: Ember.computed("id", function() {
    if (this.get("id").match(/blank/) !== null) return
    var ObjectPromiseProxy = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin)
    return ObjectPromiseProxy.create({
      promise: Fetcher.find("standardSet", this.get("id")).then(datum => {
        window.document.title = `${datum.jurisdiction?.title} : ${datum.subject} : ${
          datum.title
        } - Common Standards Project`
        return datum
      }),
    })
  }),

  jurisdiction: Ember.computed("standardSet.jurisdiction.id", "jurisdictionId", function() {
    var id = this.get("jurisdictionId") || this.get("standardSet.jurisdiction.id")
    var ObjectPromiseProxy = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin)
    return ObjectPromiseProxy.create({
      promise: Fetcher.find("jurisdiction", id),
    })
  }),

  subjects: Ember.computed("jurisdiction.standardSets", function() {
    var sets = this.get("jurisdiction.standardSets") || {}
    console.log(
      "subject",
      this.get("jurisdiction"),
      _.chain(sets)
        .map("subject")
        .uniq()
        .value()
        .sort()
    )
    return _.chain(sets)
      .map("subject")
      .uniq()
      .value()
      .sort()
  }),

  gradeLevels: Ember.computed("subject", "standardSet.subject", "jurisdiction.standardSets", function() {
    var sets = this.get("jurisdiction.standardSets") || {}
    var subject = this.get("subject") || this.get("standardSet.subject")
    return _.chain(sets)
      .filter({ subject: subject })
      .sortBy("title")
      .value()
  }),

  currentJurisdiction: Ember.computed("standardSet.jurisdiction", "jurisdiction.title", function() {
    return this.get("jurisdiction.title") || this.get("standardSet.jurisdiction.title")
  }),

  currentSubject: Ember.computed("standardSet.subject", "subject", function() {
    return this.get("subject") || this.get("standardSet.subject")
  }),

  standards: Ember.computed("standardSet.standards", "results", function() {
    var standards = Standards.hashToArray(this.get("standardSet.standards"))
    var results = this.get("results")
    if (results !== null && results !== undefined) {
      standards = _.filter(standards, s => _.includes(results, s.id))
    }
    return standards
  }),

  editSet() {
    Ember.set(this, "standardSet.isFetching", true)
    rpc["pullRequest:create"](
      { standardSetId: Ember.get(this, "id") },
      function(data) {
        Ember.getOwner(this)
          .lookup("router:main")
          .transitionTo("edit.pull-requests", data.data.id)
      }.bind(this),
      function(error) {
        console.error(error)
      }
    )
  },

  actions: {
    selectJurisdiction(jurisdiction) {
      analytics.track("Search - Select Jurisdiction")
      this.set("jurisdictionId", jurisdiction.id)
      this.set("pane", "subjects")
      $(window).scrollTop(0)
    },

    selectSubject(subject) {
      analytics.track("Search - Select Subject")
      this.set("subject", subject)
      this.set("pane", "grade-levels")
      $(window).scrollTop(0)
    },

    selectSet(set) {
      analytics.track("Search - Select Set")
      this.sendAction("selectSet", set.id, this.get("id"))
      this.set("pane", "standards")
      $(window).scrollTop(0)
    },

    backToPane(pane) {
      analytics.track("Search - Back to Pane")
      this.set("pane", pane)
    },

    editSet() {
      if (Ember.get(this, "isAuthenticated") === false) {
        this.get("authenticate").show()
        this.get("authenticate.lock").on("authenticate", () => {
          this.editSet()
        })
      } else {
        this.editSet()
      }
    },

    downloadSet() {
      let standards = _.map(this.get("standards"), standard => {
        return {
          depth: standard.depth,
          outline: standard.listId,
          text: standard.description,
          code: standard.statementNotation
        }
      })
      let csv = Papa.unparse(standards)
      const blob = new Blob([csv], { type: 'text/csv' });
      saveFile(blob, this.get("currentJurisdiction") + " - " + this.get("currentSubject") + " - " + this.get("standardSet.title"))
    },

    removeSet() {
      analytics.track("Search - Remove Set")
      this.attrs.removeSet(this.get("id"))
    },

    toggleLinkToSet() {
      analytics.track("Search - Show Link")
      this.toggleProperty("showLinkToSet")
    },

    didCopy() {
      analytics.track("Search - Copied standard")
      this.set("showCopyMessage", true)
      Ember.run.later(
        this,
        function() {
          this.set("showCopyMessage", false)
        },
        1000
      )
    },
  },

  layout: hbs`
  {{#if showCopyMessage}}
    <div class="alert alert-success alert-floating {{if showCopyMessage 'show'}}">Copied to your clipboard!</div>
  {{/if}}

  <div class="standard-set__inner standard-set__inner--four-panes standard-set__inner--show-{{pane}} standard-set__inner--drop-transition">

    <div class="standard-set-pane">
      <div class="standard-set-pane-header">
        <div class="standard-set-pane__remove" {{action 'removeSet'}}>{{partial "icons/ios7-close-outline"}}</div>
        <div class="standard-set-pane-header__choose-jurisdiction">First, select a state or organization</div>
        <div class="clearfix"></div>
      </div>
    </div>

    <div class="standard-set-pane">
      <div class="standard-set-pane-header">
        <div class="standard-set-pane__remove" {{action 'removeSet'}}>{{partial "icons/ios7-close-outline"}}</div>
        <div class="standard-set-pane__back" {{action 'backToPane' 'grade-levels'}}>&larr;</div>
        <div class="standard-set-header__jurisdiction" {{action 'backToPane' 'jurisdictions'}}>{{currentJurisdiction}} {{partial "icons/chevron-right"}}</div>
        <div class="standard-set-header__subject standard-set-header__select">Select a Subject</div>
        <div class="clearfix"></div>
      </div>
    </div>

    <div class="standard-set-pane">
      <div class="standard-set-pane-header">
        <div class="standard-set-pane__remove" {{action 'removeSet'}}>{{partial "icons/ios7-close-outline"}}</div>
        <div class="standard-set-pane__back" {{action 'backToPane' 'grade-levels'}}>&larr;</div>
        <div class="standard-set-header__jurisdiction" {{action 'backToPane' 'jurisdictions'}}>{{currentJurisdiction}} {{partial "icons/chevron-right"}}</div>
        <div class="standard-set-header__subject" {{action 'backToPane' 'subjects'}}>{{currentSubject}} {{partial "icons/chevron-right"}}</div>
        <div class="standard-set-header__title standard-set-header__select">Select a grade level</div>
        <div class="clearfix"></div>
      </div>
    </div>

    <div class="standard-set-pane">
      {{#unless standardSet.isPending}}
        <div class="standard-set-pane-header">
          {{#if showRemoveButton}}
            <div class="standard-set-pane__remove hint--left" data-hint="Close this search pane"{{action 'removeSet'}}>{{partial "icons/ios7-close-outline"}}</div>
          {{/if}}
          <div class="standard-set-pane__link hint--left" data-hint="Link to these standards" {{action 'toggleLinkToSet'}}>{{partial "icons/ios7-link"}}</div>
          <div class="standard-set-pane__edit hint--left" {{action "editSet"}} data-hint="Fix a typo in these standards">
            {{partial "icons/ios7-compose"}}
          </div>
          <div class="standard-set-pane__download hint--left" {{action "downloadSet"}} data-hint="Download a CSV">
            {{partial "icons/arrow-down"}}
          </div>
          <div class="standard-set-pane__back" {{action 'backToPane' 'grade-levels'}}>&larr;</div>
          <h1 class="standard-set-header__jurisdiction" {{action 'backToPane' 'jurisdictions'}}>{{currentJurisdiction}} {{partial "icons/chevron-right"}}</h1>
          <h2 class="standard-set-header__subject" {{action 'backToPane' 'subjects'}}>{{currentSubject}} {{partial "icons/chevron-right"}}</h2>
          <h3 class="standard-set-header__title" {{action 'backToPane' 'grade-levels'}}>{{standardSet.title}}</h3>
          <a class="standard-set-header__document-title" href={{standardSet.document.sourceURL}} target="_blank">
            {{standardSet.document.title}}
          </a>
          {{#if showLinkToSet}}
            <div class="standard-set-header__link-to-set">
              <a href="{{linkToSet}}" target="_blank">{{linkToSet}}</a>
            </div>
          {{/if}}
        </div>
      {{/unless}}
    </div>
  </div>





  <div class="standard-set__inner standard-set__inner--four-panes standard-set__inner--show-{{pane}}">

    <div class="standard-set-pane">
      <div class="standard-set-pane__selectable-list">
      {{#each jurisdictions as |jur|}}
        <div class="standard-set-pane__selectable-list__item" {{action 'selectJurisdiction' jur}}>{{jur.title}}</div>
      {{/each}}
      </div>
    </div>

    <div class="standard-set-pane">
      <div class="standard-set-pane__selectable-list">
      {{#each subjects as |subject|}}
        <div class="standard-set-pane__selectable-list__item" {{action 'selectSubject' subject}}>{{subject}}</div>
      {{/each}}
      </div>
    </div>

    <div class="standard-set-pane">
      <div class="standard-set-pane__selectable-list">
      {{#each gradeLevels as |set|}}
        <div class="standard-set-pane__selectable-list__item" {{action 'selectSet' set}}>{{set.title}}</div>
      {{/each}}
      </div>
    </div>

    <div class="standard-set-pane">
      {{#if standardSet.isPending}}
        {{partial "icons/loading-balls"}}
      {{else}}
        {{#if standardSet.isFetching}}
          {{partial "icons/loading-balls"}}
        {{else}}
          <ul class="searchable-standard-list">
            {{#each standards as |standard|}}
              {{searchable-standard standard=standard didCopy=(action 'didCopy') tagName="li"}}
            {{/each}}
          </ul>
        {{/if}}
      {{/if}}
    </div>
  </div>
  `,
})
