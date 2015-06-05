import Ember from 'ember';
import config from '../config/environment';
import Fetcher from "../lib/fetcher";

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
    this.set('jurisdiction', Fetcher.find('jurisdiction', this.get('jurisdictionId')))
  },

  onStart: Ember.on('init', function(){
    Fetcher.on('storeUpdated', this.models.bind(this))
  }),

  watcher: Ember.observer('jurisdictionId', function(){
    this.models()
  }),

  // jurisdiction: Ember.computed('jurisdictionId', function(){
  //   return store.Fetcher.find('jurisdiction', this.get('jurisdictionId'))
  // }),

  // fetchStandardsSets: Ember.observer('jurisdictionId', function(){
  //   $.ajax({
  //     url: config.urls.getJurisdictions + '/' + this.get('jurisdictionId'),
  //     dataType: "json",
  //     type: "get",
  //     success: function(res){
  //       this.set('jurisdiction', res.data)
  //     }.bind(this)
  //   })
  // }),

  fetchStandardsSet: Ember.observer('standardsSetId', function(){
    $.ajax({
      url: config.urls.getStandardsSet + '/' + this.get('standardsSetId'),
      dataType: "json",
      type: "get",
      success: function(res){
        this.set('standardsSet', Ember.Object.create(res.data))
        window.ss = this.get('standardsSet')
      }.bind(this)
    })
  }),





});
