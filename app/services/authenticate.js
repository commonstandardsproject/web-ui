import Ember from 'ember';
import rpc from "../lib/rpc";
import _ from "npm:lodash";
import Fetcher from "../lib/fetcher";

export default Ember.Service.extend({
  profile:         {},
  currentToken:    null,
  authenticatedAt: null,

  clientId: "w35Aiy4apjMKVh13hbW0fFL6McHYPZ9D",
  domain:   "commoncurriculum.auth0.com",

  session: Ember.inject.service(),

  init: function() {
    var cid    = this.get('clientId');
    var domain = this.get('domain');

    this.set('lock', function() {
      return new Auth0Lock(cid, domain);
    });
  },

  // user: Ember.computed('session.profile.email', function(){
  //   return Fetcher.find('user', this.get('session.profile.email'))
  // }),

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
  showSignin: function(cb) {
    var instance = this;
    this.lock().showSignin(this.get('options'), function(err, profile, token){
      instance._afterSignIn({err: err, profile: profile, token: token});
      if (cb) cb();
    });
  },
  showSignup: function() {
    var instance = this;
    this.lock().showSignup(this.get('options'), function(err, profile, token){
      instance._afterSignIn({err: err, profile: profile, token: token});
    });
  },
  showReset: function() {
    var instance = this;
    this.lock().showReset(this.get('options'), function(err, profile, token){
      instance._afterReset(err);
    });
  },
  logout: function() {
    this._afterLogout()
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
    console.log("AFTER SIGN IN ", data)
    if(data.err === null) {
      this.get('session').setProperties({
        profile:         data.profile,
        currentToken:    data.token,
        authenticatedAt: Date.now(),
        Authorization:   data.token
      })
      rpc["user:afterSignIn"](data.profile, function(data){
        this.get('session').setProperties({
          apiKey:         data.data.apiKey,
          algoliaApiKey:  data.data.algoliaApiKey,
          allowedOrigins: data.data.allowedOrigins,
          id:             data.data.id,
          isCommitter:    data.data.isCommitter
        })
      }.bind(this))
    }
  },
  _afterReset: function(err){ },
  _afterLogout(){
    this.get('session').setProperties({
      authenticatedAt: null,
      Authorization:   null,
      profile:         null,
    })
  }

});
