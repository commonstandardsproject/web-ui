import Ember from 'ember';
import User from "../models/user";

export default Ember.Mixin.create({

  clientId: "w35Aiy4apjMKVh13hbW0fFL6McHYPZ9D",
  domain: "commoncurriculum.auth0.com",

  init: function() {
    var cid    = this.get('clientId');
    var domain = this.get('domain');

    this.set('lock', function() {
      return new Auth0Lock(cid, domain);
    });
  },

  currentUser: null,

  options: {
    focusInput: true,
    popup: true
  },

  // Handle appear
  show: function() {
    var instance = this;
    this.lock().show(this.get('options'), function(err, profile, token){
      instance._afterSignIn({err: err, profile: profile, token: token});
    });
  },
  showSignin: function() {
    var instance = this;
    this.lock().showSignin(this.get('options'), function(err, profile, token){
      instance._afterSignIn({err: err, profile: profile, token: token});
    });
  },
  showSignup: function() {
    var instance = this;
    this.lock().showSignup(this.get('options'), function(err, profile, token){
      instance._afterSignIn({err: err, profile: profile, token: token});
    });
  },
  showReset: function() {
    this.lock().showReset(this.get('options'), function(err, profile, token){
      instance._afterReset(err);
    });
  },

  // Some helpers
  userLoggedIn: function() {
    var user = this.get('currentUser');
    var logged_in = false
    if (user != null){
      logged_in = true;
    }
    return logged_in ;
  }.property('currentUser'),

  // Handle events
  _afterSignIn: function(data){
    console.log('data', data)
    if(data.err == null) {
      this.set("currentUser", data.profile);
      this.set("currentToken", data.token);
      $.ajaxSetup({
        headers: {
          "authorization": data.token
        }
      })
      User.afterSignIn(data.profile)


    }
  },
  _afterReset: function(err){
  }

});
