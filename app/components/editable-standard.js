import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    update(value, object, field, e){
      this.sendAction('update', value, object, field)
    }
  }
})
