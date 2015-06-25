import Ember from 'ember';
import _ from "npm:lodash";
import Fetcher from "../lib/fetcher2";

export default Ember.Component.extend({

  authenticate:    Ember.inject.service(),
  session:         Ember.inject.service(),
  isAuthenticated: Ember.computed.alias('session.isAuthenticated'),
  pane:            "jurisdictions",

  jurisdictions: Ember.computed(function(){
    return Fetcher.find('jurisdiction', 'index')
  }),

  actions: {
    signIn(){
      this.get('authenticate').showSignin()
    },
    showReset(){
      this.get('authenticate').logout()
    },
    selectJurisdiction(id){
      this.set('jurisdictionId', id)
      this.set('pane', 'jurisdiction')
    }
  }

})
