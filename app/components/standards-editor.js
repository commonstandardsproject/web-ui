import Ember from 'ember';
import _ from "npm:lodash";
import Immutable from "npm:immutable";

  export default Ember.Component.extend({

  showJurisdictions: false,

  showPane: Ember.computed('jurisdiction', 'showJurisdictions', function(){
    if (Ember.isNone(this.get('jurisdiction')) || this.get('showJurisdictions')) {
      return "show-jurisdictions";
    } else {
      return "show-standard-sets"
    }
  }),

  standardSets: Ember.computed('jurisdiction', function(){
    // debugger;
    if (!this.get('jurisdiction')) return;
    var sets = this.attrs.jurisdiction.value.get('standardSets') || Immutable.List()
    return sets.sortBy(s => s.get('subject'))
  }),

  actions: {
    showJurisdictions: function(){
      this.set('showJurisdictions', true)
    },

    hideJurisdictions: function(){
      this.set('showJurisdictions', false)
    },

    clickJurisdiction: function(){
      this.set('showJurisdictions', false)
    }
  }


})
