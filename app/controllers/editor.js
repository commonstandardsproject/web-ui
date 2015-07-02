import Ember from 'ember';
import config from '../config/environment';
import Fetcher from "../lib/fetcher";
import Immutable from "npm:immutable";

export default Ember.Controller.extend({

  queryParams: ['jurisdictionId', 'standardSetId'],
  jurisdictionId: null,
  jurisdictions: [],


  fetchJurisdictions: Ember.on('init', function(){
    $.ajax({
      url: config.urls.getJurisdictions,
      method: "get",
      headers: {
        "Auth-Token": "vZKoJwFB1PTJnozKBSANADc3"
      },
      success: function(res){
        this.set('jurisdictions', res.data)
      }.bind(this)
    })
  }),

  models(){
    var jurisdiction = Fetcher.find('jurisdiction', this.get('jurisdictionId'))
    if (jurisdiction !== this.get('jurisdiction')) {
      // console.log('update jurisdiction')
      this.set('jurisdiction', jurisdiction)
    }

    var standardSet = Fetcher.find('standardSet', this.get('standardSetId'))
    if (standardSet !== this.get('standardSet')){
      // console.log('update standards set')
      this.set('standardSet', standardSet)
    }
    // this.set('jurisdiction', Fetcher.find('jurisdiction', this.get('jurisdictionId')))
    // this.set('standardSet', Fetcher.find('standardSet', this.get('standardSetId')))
  },

  onStart: Ember.on('init', function(){
    Fetcher.on('storeUpdated', this.models.bind(this))
  }),

  watcher: Ember.observer('jurisdictionId', 'standardSetId', function(){
    this.models()
  }),



});
