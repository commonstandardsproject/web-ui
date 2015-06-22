import Ember from 'ember';
import _     from 'npm:lodash';
import Fetcher from "../lib/fetcher2";

export default Ember.Controller.extend({

  queryParams: ['query', 'standardSetIds'],
  standardSetIds: ["blank"],


  jurisdictions: Ember.computed(function(){
    return Fetcher.find('jurisdiction', 'index')
  }),


  actions: {
    addPane(){
      this.get('standardSetIds').pushObject('blank' + Ember.generateGuid())
    },
    selectSet(id, oldId){
      var idx = this.get('standardSetIds').indexOf(oldId)
      this.get('standardSetIds').replace(idx, 1, id)
    },
    removeSet(id){
      this.get('standardSetIds').removeObject(id)
    }
  }


})
