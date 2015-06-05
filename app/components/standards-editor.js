import Ember from 'ember';
import _ from "npm:lodash";
import Immutable from "npm:immutable";

export default Ember.Component.extend({

  standardSets: Ember.computed('jurisdiction', function(){
    // debugger;
    if (!this.get('jurisdiction')) return;
    var sets = this.attrs.jurisdiction.value.get('standardSets') || Immutable.List()
    return sets.sortBy(s => s.get('subject'))
  })


})
