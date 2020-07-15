import Ember from "ember"
import _ from "npm:lodash"
import rpc from "../lib/rpc"
import idGen from "../lib/id-gen"
import hbs from "htmlbars-inline-precompile"
import Fetcher from "../lib/fetcher"
import { storageFor } from "ember-local-storage"

export default Ember.Component.extend({
  authenticate: Ember.inject.service(),
  session: storageFor("persistedSession"),

  isAuthenticated: Ember.computed("session.authenticatedAt", function () {
    return Date.now() - this.get("session.authenticatedAt") < 3100000
  }),

  pullRequests: Ember.computed("session.id", function () {
    var ObjectPromiseProxy = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin)
    return ObjectPromiseProxy.create({
      promise: Fetcher.find("userPullRequests", this.get("session.id")),
    })
  }),

  isAuthenticatedWatcher: Ember.observer("isAuthenticated", function () {
    if (this.get("isAuthenticated") === true) $(window).scrollTop(0)
  }),

  jurisdictions: Ember.computed(function () {
    var ObjectPromiseProxy = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin)
    return ObjectPromiseProxy.create({
      promise: Fetcher.find("jurisdiction", "index", true),
    })
  }),

  jurisdiction: Ember.computed("jurisdictionId", function () {
    var ObjectPromiseProxy = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin)
    return ObjectPromiseProxy.create({
      promise: Fetcher.find("jurisdiction", this.get("jurisdictionId")),
    })
  }),

  standardSet: Ember.computed("standardSetId", function () {
    var ObjectPromiseProxy = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin)
    return ObjectPromiseProxy.create({
      promise: Fetcher.find("standardSet", this.get("standardSetId")),
    })
  }),

  paneObserver: Ember.observer("pane", function () {
    $(window).scrollTop(0)
  }),

  scrollOnStart: Ember.on("didInsertElement", function () {
    $(window).scrollTop(0)
  }),

  actions: {
    signIn() {
      this.get("authenticate").show()
    },
    showReset() {
      this.get("authenticate").logout()
    },
    selectJurisdiction(id) {
      this.set("jurisdictionId", id)
      this.set("pane", "jurisdiction")
    },
    selectStandardSet(id) {
      this.set("standardSetId", id)
      this.set("pane", "standard-set")
    },
    goToPane(pane) {
      this.set("pane", pane)
    },
    createPullRequest() {
      if (this.get("isCreatingPullRequest") === true) return
      Ember.set(this, "isCreatingPullRequest", true)
      window.addEventListener(
        "message",
        function (e) {
          if (e && e.data && e.data.type && e.data.type === "nextStepClicked" && e.data.nextStepId === 59139) {
            if (this.get("isCreatingPullRequestAfterStonly") === true) return
            this.set("isCreatingPullRequestAfterStonly", true)
            window.StonlyWidget.close()
            window.StonlyWidget.closeFullscreen()
            rpc["pullRequest:create"](
              {},
              function (data) {
                Ember.getOwner(this).lookup("router:main").transitionTo("edit.pull-requests", data.data.id)
                Ember.set(this, "isCreatingPullRequest", false)
              }.bind(this),
              function (error) {
                Ember.set(this, "isCreatingPullRequest", false)
                console.error(error)
              }
            )
          }
        }.bind(this)
      )
      window.StonlyWidget.changeActiveExplanation(1302)
      window.StonlyWidget.open()
      window.StonlyWidget.openFullscreen()
    },
  },

  layout: hbs`
  {{partial "navbar"}}

  <div class="standards-edit-page">
    <div class="standards-edit-page__header">
      <h1 class="standards-edit-h1">
        Standards Creator & Editor
      </h1>
      <h2 class="standards-edit-h2">
        Are we missing standards you rely on? Found a typo? Has your school, district or charter network created their own custom standards? Add them to the database and make them searchable!
      </h2>
    </div>
    <div class="row">
      <div class="standards-edit-description col-sm-8">
        <p>
          Welcome to the Common Standards Project editing interface. Here, you can add or edit any standard in the database or add your own. Once your standards are in the database, you can share them so your colleagues can easily search them.
        </p>
        <h3>How does this work?</h3>
        <p>
          First, log in or sign up below. Then, add or edit standards using the easy interface. Each time someone submits a change to  the standards, we review it and then save a version. This way, if someone makes a mistake (or edits with the standards you spent hours adding), we can rollback the change. Educators rely on standards to be accurate, so we take the integrity of standards very seriously.
        </p>
        <h3>Who can use the standards?</h3>
        <p>
          Anyone. For free! All standards that published to Common Standards Project are licensed under a <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">Creative Commons Attribution license</a>. This means anyone who uses standards on Common Standards Project can use them and do whatever they like with them for free! For more details, click the link.
        </p>
      </div>
      <div class="standards-edit-page__pull-request-pane col-sm-4">
        {{#if isAuthenticated}}
          <h3 class="standards-edit-h1">My Changes/Additions</h3>
          {{#if pullRequests.isPending}}
            <div class="loading-ripple loading-ripple-md">{{partial "icons/ripple"}}</div>
          {{/if}}
          <ul>
          {{#each pullRequests.list as |pullRequest|}}
            <li>{{#link-to 'edit.pull-requests' pullRequest.id}}{{pullRequest.title}}{{/link-to}}</li>
          {{/each}}
          </ul>
          {{#if isCreatingPullRequest}}
            <div class="loading-ripple loading-ripple-md">{{partial "icons/ripple"}}</div>
          {{else}}
            <div class="btn btn-default btn-primary btn-block btn-lg" {{action "createPullRequest"}}>Create Standards</div>
          {{/if}}
        {{else}}
          <div class="btn btn-primary btn-block btn-lg" {{action "signIn"}}>Get Started!</div>
        {{/if}}
      </div>
    </div>
  </div>
  `,
})
