import Ember from 'ember';

export default Ember.Component.extend({

  authenticate: Ember.inject.service(),
  session: Ember.inject.service(),

  isAuthenticated: Ember.computed.alias('session.isAuthenticated'),

  actions: {
    signIn(){
      this.get('authenticate').showSignin()
    }
  }

})
