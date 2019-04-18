import Ember from "ember"
import hbs from "htmlbars-inline-precompile"
import _ from "npm:lodash"
import rpc from "../lib/rpc"

export default Ember.Component.extend({
  showForm: false,

  groupedSets: Ember.computed("standardSets", function() {
    var sortFn = function(set) {
      return _.chain(set.educationLevels)
        .first()
        .thru(v => v || "")
        .replace("Pre-K", "-1")
        .replace("K", 0)
        .thru(v => Math.floor(v))
        .value()
    }

    return _.chain(this.get("standardSets"))
      .sortBy("subject")
      .groupBy("subject")
      .pairs()
      .map(v => {
        return {
          title: _.first(v),
          sets: _.sortBy(_.last(v), sortFn),
        }
      })
      .value()
  }),

  actions: {
    createNewSet() {
      rpc["standardSet:create"](
        {
          jurisdiction_id: this.get("jurisdictionId"),
          title: this.get("title"),
          subject: this.get("subject"),
          committerName: this.session.get("profile.name"),
          committerEmail: this.session.get("profile.email"),
        },
        function(data) {
          this.sendAction("selectStandardSet", data.data.id)
        }.bind(this),
        function(error) {
          console.log("Standard Set Create Error", error)
          window.alert("There was an error creating the standard set.")
        }
      )
    },
    toggleForm() {
      this.toggleProperty("showForm")
    },
  },

  tagName: "div",
  classNames: ["standard-sets-list"],
  layout: hbs`
    {{#each groupedSets as |group|}}
      <div class="standard-sets-list__subject-group">
        <div class="standard-sets-list__subject-title">{{group.title}}</div>
        <div class="standard-sets-list__set-list">
          {{#each group.sets as |set|}}
            <div class="standard-sets-list__set-list__item" {{action this.attrs.selectStandardSet set.id}}>{{set.title}}</div>
          {{/each}}
        </div>
      </div>
    {{/each}}
    {{#if showForm}}
      <form>
        {{input value=subject class="form-control" placeholder="Subject (e.g. Math or Reading)"}}
        {{input value=title class="form-control" placeholder="Title (e.g. High School Algebra)"}}
        {{input value=session.profile.name class="form-control"}}
        {{input value=session.profile.email class="form-control"}}
        <input type="submit" value="Create" {{action "createNewSet"}} class="btn btn-primary">
        <div class="btn btn-link" {{action "toggleForm"}}>Cancel</div>
      </form>
    {{else}}
      <div class="btn btn-primary" {{action "toggleForm"}}>Create a set of standards</div>
    {{/if}}
  `,
})
