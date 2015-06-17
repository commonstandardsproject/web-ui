import Ember from 'ember';
import _     from 'npm:lodash';

export default Ember.Controller.extend({

  queryParams: ['query', 'standardSetIds'],
  standardSetIds: ["blank"],

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
