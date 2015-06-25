import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import _ from "npm:lodash-fp";

export default Ember.Component.extend({

  showForm: false,

  groupedSets: Ember.computed('standardsSets', function(){
    var sets = this.get('standardsSets')
    return _.flow(
      _.sortBy('subject'),
      _.groupBy('subject'),
      _.pairs,
      _.map(v => {
        return {
          title: v[0],
          sets: _.sortBy(s => {
            let one = _.first(s.educationLevels) || ""
            one = one.replace("Pre-K", "-1").replace("K", 0)
            return Math.floor(one)
          }, v[1])
        }
      })
    )(sets)
  }),

  actions: {
    createNewSet(){

    },
    toggleForm(){
      this.toggleProperty('showForm')
    }
  },

  tagName: "div",
  classNames: ['standards-sets-list'],
  layout: hbs`
    {{#each groupedSets as |group|}}
      <div class="standards-sets-list__subject-group">
        <div class="standards-sets-list__subject-title">{{group.title}}</div>
        <div class="standards-sets-list__set-list">
          {{#each group.sets as |set|}}
            <div class="standards-sets-list__set-list__item" {{action this.attrs.selectStandardsSet set.id}}>{{set.title}}</div>
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
  `
});
