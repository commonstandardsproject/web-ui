import Ember from "ember";
import Fetcher from "../lib/fetcher";
import _ from "npm:lodash";
import Standards from "../models/standards";
import Immutable from "npm:immutable";

export default Ember.Component.extend({

  pane: "standards",

  setPane: Ember.on('init', function(){
    if (this.get('id').match(/blank/) !== null) this.set('pane', 'jurisdictions')
  }),

  models: function(){
    var jurisdictions = Fetcher.find('jurisdiction', 'index')
    if (jurisdictions){ this.set('jurisdictions', jurisdictions.toJS()) }

    if (this.get('jurisdictionId')){
      var jurisdiction = Fetcher.find('jurisdiction', this.get('jurisdictionId'))
      if (jurisdiction){
        this.set('jurisdiction', jurisdiction.toJS())
      }
    }

    if (this.get('id').match(/blank/) == null){
      var set = Fetcher.find('standardsSet', this.get('id'))
      if (set){ this.set('standardSet', set.toJS()) }
    }
  },

  subjects: Ember.computed('jurisdiction', 'jurisdictionId', function(){
    var sets = this.get('jurisdiction.standardSets') || {}
    return _.chain(sets).pluck('subject').uniq().value().sort()
  }),

  gradeLevels: Ember.computed('subject', 'jurisdiction', function(){
    var sets = this.get('jurisdiction.standardSets') || {}
    return _.chain(sets).filter({subject: this.get('subject')}).sortBy('title').value()
  }),

  onStart: Ember.on('init', function(){
    this.models()
    Fetcher.on('storeUpdated', this.models.bind(this))
  }),

  watcher: Ember.observer('jurisdictionId', 'standardsSetId', 'id', function(){
    this.models()
  }),

  observeSet: Ember.observer('standardSet', function(){
    if (!this.get('standardSet')) return;

    this.set('subject', this.get('standardSet.subject'))
    this.set('jurisdictionId', this.get('standardSet.jurisdictionId'))

  }),


  standards: Ember.computed('standardSet', function(){
    return Standards.linkedListToArray(Immutable.fromJS(this.get('standardSet.standards')))
  }),

  actions: {
    selectJurisdiction(jurisdiction){
      this.set('jurisdictionId', jurisdiction.id)
      this.set('pane', 'subjects')
    },

    selectSubject(subject){
      this.set('subject', subject)
      this.set('pane', 'grade-levels')
    },

    selectSet(set){
      this.sendAction('selectSet', set.id, this.get('id'))
      this.set('pane', 'standards')
    },

    backToPane(pane){
      this.set('pane', pane)
    }
  }


})
