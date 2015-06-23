import Ember from 'ember';

export default Ember.Component.extend({

  authenticate: Ember.inject.service(),
  session: Ember.inject.service(),

  isAuthenticated: Ember.computed.alias('session.isAuthenticated'),

  addHighlighting: Ember.on('didInsertElement', function(){
    $('pre').each(function(i, block) {
      hljs.highlightBlock(block);
    });
  }),

  actions: {
    signIn(){
      this.get('authenticate').showSignin()
    },
    showReset(){
      this.get('authenticate').logout()
    }
  }

})
