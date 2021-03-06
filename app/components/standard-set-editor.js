import Ember from "ember"
import hbs from "htmlbars-inline-precompile"
import store from "../lib/store"
import differ from "../lib/differ"
import rpc from "../lib/rpc"
import Standards from "../models/standards"
import MultiselectCheckboxesComponent from "ember-multiselect-checkboxes/components/multiselect-checkboxes"
import _ from "npm:lodash"

var get = Ember.get

export default Ember.Component.extend({
  standards: Ember.computed("standardSet.standards", function() {
    return Standards.hashToArray(this.get("standardSet.standards"))
  }),

  actions: {
    onFormSubmit(attrs) {
      var diff = differ(
        store.server.find("standardSet", this.get("standardSet.id")),
        store.local.find("standardSet", this.get("standardSet.id"))
      )
      if (diff.length === 0) {
        this.set("diffError", "You haven't changed anything yet!")
        return
      } else {
        this.set("diffError", "")
      }
      attrs.ops = diff
      attrs.jurisdictionTitle = get(this, "jurisdiction.title")
      attrs.jurisdictionId = get(this, "jurisdiction.id")
      attrs.standardSetId = get(this, "standardSet.id")
      attrs.standardSetSubject = get(this, "standardSet.subject")
      attrs.standardSetTitle = get(this, "standardSet.title")
      rpc["commit:make"](
        attrs,
        function(data) {
          this.set("formSubmittedSuccessfully", true)
          $(window).scrollTop(0)
          this.set(
            "commitSuccess",
            "Your change was successful! We'll review it in the next day (or two if we're really busy) and let you know if anything doesn't look right."
          )
        }.bind(this),
        function(jqXhr, textStatus, errorThrown) {
          this.set("commitError", errorThrown)
        }.bind(this)
      )
    },
  },

  diffError: "",

  layout: hbs`


    {{#if standardSet.submissions}}
      <h2 class="standard-set-editor__subhead">Changes waiting to be approved</h2>
      <ul>
      {{#each standardSet.submissions as |submission|}}
        <li>{{submission.title}}</li>
      {{/each}}
      </ul>
    {{/if}}


    {{#if commitSuccess}}
      <div class="alert alert-success">{{commitSuccess}}</div>
    {{/if}}

    {{#unless formSubmittedSuccessfully}}

      <h2 class="standard-set-editor__subhead">Directions</h2>
      <p>
        First, thanks for helping improve the standards. We (and all the teachers that use these standards) appreciate it. Second, to edit a standard, it's really easy -- just click into the text and make your change. When you're done, scroll down to bottom and click "Submit Change".
      </p>


      <h2 class="standard-set-editor__subhead">Description</h2>
      <div class="form-horizontal">
        <div class="form-group">
          <label class="control-label col-sm-2">Title</label>
          <div class="col-sm-10">
            {{input value=standardSet.title type="text" class="form-control" placeholder="E.g. First Grade or HS-Algebra"}}
          </div>
        </div>
        <div class="form-group">
          <label class="control-label col-sm-2">Subject</label>
          <div class="col-sm-10">
            {{input class="form-control" value=standardSet.subject type="text"}}
          </div>
        </div>
        <div class="form-group">
          <label class="control-label col-sm-2">Source URL</label>
          <div class="col-sm-10">
            {{input value=standardSet.sourceUrl type="url" class="form-control" placeholder="e.g. The website where you're copying & pasting the standards from"}}
          </div>
        </div>
        <div class="form-group">
          <label class="control-label col-sm-2">Education Levels</label>
          <div class="col-sm-10">
            {{#if standardSet.educationLevels}}
              {{education-level-checkboxes value=standardSet.educationLevels}}
            {{/if}}
          </div>
        </div>
      </div>


      <h2 class="standard-set-editor__subhead">Standards</h2>
      {{standards-sorter-editor standardsHash=standardSet.standards}}


      {{!-- <h2 class="standard-set-editor__subhead">Change the standards</h2> --}}
      {{standard-set-commit-maker
        standardSet=standardSet
        onFormSubmit=(action 'onFormSubmit')
        diffError=diffError
        commitSuccess=commitSuccess
        commitError=commitError
      }}
    {{/unless}}



  `,
})
