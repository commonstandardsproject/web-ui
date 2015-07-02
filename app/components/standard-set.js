import Ember from "ember";
import Fetcher from "../lib/fetcher2";
import _ from "npm:lodash";
import Standards from "../models/standards";
import Immutable from "npm:immutable";
import hbs from 'htmlbars-inline-precompile';

export default Ember.Component.extend({

  pane: "standards",

  classNameBindings: ['wasInserted'],

  // addInsertedClass: Ember.on('didInsertElement', function(){
  //   console.log('did insert')
  //   Ember.run.later(this, () => {this.set('wasInserted', true)}, 50)
  // }),

  linkToSet: Ember.computed('standardSetId', function(){
    return 'http://localhost:4200/search?ids=%5B"' + this.get('id') + '"%5D'
  }),

  showRemoveButton: Ember.computed('index', function(){
    return this.get('index') !== 0
  }),

  setPane: Ember.on('init', function(){
    if (this.get('id').match(/blank/) !== null) this.set('pane', 'jurisdictions')
  }),

  standardSet: Ember.computed('id', function(){
    if (this.get('id').match(/blank/) !== null) return;
    return Fetcher.find('standardsSet', this.get('id'))
  }),

  jurisdiction: Ember.computed('standardSet.jurisdiction.id', 'jurisdictionId', function(){
    var id = this.get('jurisdictionId') || this.get('standardSet.jurisdiction.id')
    return Fetcher.find('jurisdiction', id)
  }),

  subjects: Ember.computed('jurisdiction.standardsSets', function(){
    var sets = this.get('jurisdiction.standardsSets') || {}
    return _.chain(sets).pluck('subject').uniq().value().sort()
  }),

  gradeLevels: Ember.computed('subject', 'standardSet.subject', 'jurisdiction.standardsSets', function(){
    var sets = this.get('jurisdiction.standardsSets') || {}
    var subject = this.get('subject') || this.get('standardSet.subject')
    return _.chain(sets).filter({subject: subject}).sortBy('title').value()
  }),


  currentJurisdiction: Ember.computed('standardSet.jurisdiction', 'jurisdiction.title', function(){
    return this.get('standardSet.jurisdiction.title') || this.get('jurisdiction.title')
  }),

  currentSubject: Ember.computed('standardSet.subject', 'subject', function(){
    return this.get('standardSet.subject') || this.get('subject')
  }),


  standards: Ember.computed('standardSet.standards', function(){
    return Standards.hashToArray(this.get('standardSet.standards'))
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
      this.set('pane', 'standards-set')
    },

    backToPane(pane){
      // this.sendAction('selectSet', 'blank'+Ember.generateGuid(), this.get('id'))
      this.set('pane', pane)
    },

    removeSet(){
      this.sendAction('removeSet', this.get('id'))
    },

    toggleLinkToSet(){
      this.toggleProperty('showLinkToSet')
    },

    didCopy(){
      this.set('showCopyMessage', true)
      Ember.run.later(this, function(){
        this.set('showCopyMessage', false)
      }, 1000)
    }
  },

  layout: hbs`
  <div class="alert alert-success alert-floating {{if showCopyMessage 'show'}}">Copied to your clipboard!</div>

  <div class="standard-set__inner standard-set__inner--four-panes standard-set__inner--show-{{pane}} standard-set__inner--drop-transition">

    <div class="standard-set-pane">
      <div class="standard-set-pane-header">
        <div class="standard-set-pane__remove" {{action 'removeSet'}}>{{partial "icons/ios7-close-outline"}}</div>
        <div class="standard-set-pane-header__choose-jurisdiction">First, select a state or organization</div>
        <div class="clearfix"></div>
      </div>
    </div>

    <div class="standard-set-pane">
      <div class="standard-set-pane-header">
        <div class="standard-set-pane__remove" {{action 'removeSet'}}>{{partial "icons/ios7-close-outline"}}</div>
        <div class="standard-set-pane__back" {{action 'backToPane' 'grade-levels'}}>&larr;</div>
        <div class="standard-set-header__jurisdiction" {{action 'backToPane' 'jurisdictions'}}>{{currentJurisdiction}}</div>
        <div class="standard-set-header__subject standard-set-header__select">Select a Subject</div>
        <div class="clearfix"></div>
      </div>
    </div>

    <div class="standard-set-pane">
      <div class="standard-set-pane-header">
        <div class="standard-set-pane__remove" {{action 'removeSet'}}>{{partial "icons/ios7-close-outline"}}</div>
        <div class="standard-set-pane__back" {{action 'backToPane' 'grade-levels'}}>&larr;</div>
        <div class="standard-set-header__jurisdiction" {{action 'backToPane' 'jurisdictions'}}>{{currentJurisdiction}}</div>
        <div class="standard-set-header__subject" {{action 'backToPane' 'subjects'}}>{{currentSubject}}</div>
        <div class="standard-set-header__title standard-set-header__select">Select a grade level</div>
        <div class="clearfix"></div>
      </div>
    </div>

    <div class="standard-set-pane">
      <div class="standard-set-pane-header">
        {{#if showRemoveButton}}
          <div class="standard-set-pane__remove hint--left" data-hint="Close this search pane"{{action 'removeSet'}}>{{partial "icons/ios7-close-outline"}}</div>
        {{/if}}
        <div class="standard-set-pane__link hint--left" data-hint="Link to these standards" {{action 'toggleLinkToSet'}}>{{partial "icons/ios7-link"}}</div>
        {{#link-to 'edit' (query-params standardsSetId=standardSet.id pane="standards-set") class="standard-set-pane__edit hint--left" tagName="div" data-hint="Fix a typo in these standards"}}
          {{partial "icons/ios7-compose"}}
        {{/link-to}}
        <div class="standard-set-pane__back" {{action 'backToPane' 'grade-levels'}}>&larr;</div>
        <div class="standard-set-header__jurisdiction" {{action 'backToPane' 'jurisdictions'}}>{{currentJurisdiction}}</div>
        <div class="standard-set-header__subject" {{action 'backToPane' 'subjects'}}>{{currentSubject}}</div>
        <div class="standard-set-header__title" {{action 'backToPane' 'grade-levels'}}>{{standardSet.title}}</div>
        <a class="standard-set-header__document-title" href={{standardSet.source}} target="_blank">
          {{standardSet.documentTitle}}
        </a>
        {{#if showLinkToSet}}
          <div class="standard-set-header__link-to-set">
            <a href="{{linkToSet}}" target="_blank">{{linkToSet}}</a>
          </div>
        {{/if}}
      </div>
    </div>
  </div>





  <div class="standard-set__inner standard-set__inner--four-panes standard-set__inner--show-{{pane}}">

    <div class="standard-set-pane">
      <div class="standard-set-pane__selectable-list">
      {{#each jurisdictions as |jur|}}
        <div class="standard-set-pane__selectable-list__item" {{action 'selectJurisdiction' jur}}>{{jur.title}}</div>
      {{/each}}
      </div>
    </div>

    <div class="standard-set-pane">
      <div class="standard-set-pane__selectable-list">
      {{#each subjects as |subject|}}
        <div class="standard-set-pane__selectable-list__item" {{action 'selectSubject' subject}}>{{subject}}</div>
      {{/each}}
      </div>
    </div>

    <div class="standard-set-pane">
      <div class="standard-set-pane__selectable-list">
      {{#each gradeLevels as |set|}}
        <div class="standard-set-pane__selectable-list__item" {{action 'selectSet' set}}>{{set.title}}</div>
      {{/each}}
      </div>
    </div>

    <div class="standard-set-pane">
      <div class="searchable-standard-list">
      {{#each standards as |standard|}}
        {{searchable-standard standard=standard didCopy=(action 'didCopy')}}
      {{/each}}
      </div>
    </div>
  </div>
  `


})
