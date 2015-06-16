import Ember from 'ember';
import config from '../config/environment';
import Fetcher from "../lib/fetcher";
import Immutable from "npm:immutable";

export default Ember.Controller.extend({

  queryParams: ['jurisdictionId', 'standardsSetId'],
  jurisdictionId: null,
  jurisdictions: [],


  fetchJurisdictions: Ember.on('init', function(){
    $.ajax({
      url: config.urls.getJurisdictions,
      dataType: "json",
      type: "get",
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

    var standardsSet = Fetcher.find('standardsSet', this.get('standardsSetId'))
    if (standardsSet !== this.get('standardsSet')){
      // console.log('update standards set')
      this.set('standardsSet', standardsSet)
    }
    // this.set('jurisdiction', Fetcher.find('jurisdiction', this.get('jurisdictionId')))
    // this.set('standardsSet', Fetcher.find('standardsSet', this.get('standardsSetId')))
  },

  onStart: Ember.on('init', function(){
    Fetcher.on('storeUpdated', this.models.bind(this))
  }),

  watcher: Ember.observer('jurisdictionId', 'standardsSetId', function(){
    this.models()
  }),



});
