import Ember from "ember";
import Fetcher from "../lib/fetcher2";
import _ from "npm:lodash";
import Standards from "../models/standards";
import Immutable from "npm:immutable";

export default Ember.Component.extend({

  pane: "standards",

  setPane: Ember.on('init', function(){
    if (this.get('id').match(/blank/) !== null) this.set('pane', 'jurisdictions')
  }),

  standardSet: Ember.computed('id', function(){
    if (this.get('id').match(/blank/) !== null) return;
    return Fetcher.find('standardsSet', this.get('id'))
  }),

  jurisdiction: Ember.computed('standardSet.jurisdictionId', 'jurisdictionId', function(){
    var id = this.get('jurisdictionId') || this.get('standardSet.jurisdictionId')
    return Fetcher.find('jurisdiction', id)
  }),

  subjects: Ember.computed('jurisdiction.standardSets', function(){
    var sets = this.get('jurisdiction.standardSets') || {}
    return _.chain(sets).pluck('subject').uniq().value().sort()
  }),

  gradeLevels: Ember.computed('subject', 'standardSet.subject', 'jurisdiction.standardSets', function(){
    var sets = this.get('jurisdiction.standardSets') || {}
    var subject = this.get('subject') || this.get('standardSet.subject')
    return _.chain(sets).filter({subject: subject}).sortBy('title').value()
  }),


  currentJurisdiction: Ember.computed('standardSet.jurisdiction', 'jurisdiction.title', function(){
    return this.get('standardSet.jurisdiction') || this.get('jurisdiction.title')
  }),

  currentSubject: Ember.computed('standardSet.subject', 'subject', function(){
    return this.get('standardSet.subject') || this.get('subject')
  }),


  standards: Ember.computed('standardSet.standards', function(){
    return Standards.linkedListToArray(Immutable.fromJS(this.get('standardSet.standards')))
  }),

  actions: {
    selectJurisdiction(jurisdiction){
      // this.sendAction('selectSet', 'blank'+Ember.generateGuid(), this.get('id'))
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
      // this.sendAction('selectSet', 'blank'+Ember.generateGuid(), this.get('id'))
      this.set('pane', pane)
    },

    removeSet(){
      this.sendAction('removeSet', this.get('id'))
    }
  }


})
