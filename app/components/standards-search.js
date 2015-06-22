import Ember from 'ember';
import _ from "npm:lodash";

export default Ember.Component.extend({


  isSearchVisible: Ember.computed('standardSetIds', function(){
    return _.chain(this.get('standardSetIds'))
            .filter(s => !_.contains(s, 'blank'))
            .value().length > 0
  }),


  actions: {
    addPane(){
      this.sendAction('addPane')
    },
    selectSet(id, oldId){
      this.sendAction('selectSet', id, oldId)
    },
    removeSet(id){
      if (this.get('standardSetIds').length == 1) return;
      this.sendAction('removeSet', id)
    }
  }


})
