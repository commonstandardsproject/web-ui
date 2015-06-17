import Ember from 'ember';

export default Ember.Component.extend({


  actions: {
    addPane(){
      this.sendAction('addPane')
    },
    selectSet(id, oldId){
      this.sendAction('selectSet', id, oldId)
    },
    removeSet(id){
      this.sendAction('removeSet', id)
    }
  }


})
