import Ember from 'ember';
import _     from 'npm:lodash';
import Fetcher from "../lib/fetcher";

export default Ember.Controller.extend({

  queryParams: ['query', 'ids'],
  ids: ["blank"],


  jurisdictions: Ember.computed(function(){
    return Fetcher.find('jurisdiction', 'index')
  }),


  actions: {
    addPane(){
      this.get('ids').pushObject('blank' + Ember.generateGuid())
    },
    selectSet(id, oldId){
      var idx = this.get('ids').indexOf(oldId)
      this.get('ids').replace(idx, 1, id)
    },
    removeSet(id){
      this.get('ids').removeObject(id)
    }
  }


})
