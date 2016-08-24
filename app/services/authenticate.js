import Ember from 'ember';
import rpc from "../lib/rpc";
import _ from "npm:lodash";
import Fetcher from "../lib/fetcher";
import { storageFor } from 'ember-local-storage';

export default Ember.Service.extend({
  profile:         {},
  currentToken:    null,
  authenticatedAt: null,

  clientId: "w35Aiy4apjMKVh13hbW0fFL6McHYPZ9D",
  domain:   "commoncurriculum.auth0.com",

  session: storageFor('persistedSession'),

  init: function() {
    var cid    = this.get('clientId');
    var domain = this.get('domain');

    let lock = new Auth0Lock(cid, domain, {
      auth: {redirect: false}
    })
    this.set('lock', lock);
    lock.on('authenticated', (authResult) => {
      lock.getProfile(authResult.idToken, (error, profile)  => {
        if(error === null) {
          this.get('session').setProperties({
            profile:         profile,
            currentToken:    authResult.idToken,
            authenticatedAt: Date.now(),
            Authorization:   authResult.idToekn
          })
          rpc["user:afterSignIn"](profile, function(data){
            this.get('session').setProperties({
              apiKey:         data.data.apiKey,
              algoliaApiKey:  data.data.algoliaApiKey,
              allowedOrigins: data.data.allowedOrigins,
              id:             data.data.id,
              isCommitter:    data.data.isCommitter
            })
          }.bind(this))
        }
      })
    })
  },

  // user: Ember.computed('session.profile.email', function(){
  //   return Fetcher.find('user', this.get('session.profile.email'))
  // }),

  // Handle appear
  show: function() {
    Ember.get(this, 'lock').show()
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


  logout: function() {
    this.get('session').setProperties({
      authenticatedAt: null,
      Authorization:   null,
      profile:         null,
    })
  }

});
