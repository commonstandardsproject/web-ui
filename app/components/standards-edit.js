import Ember from 'ember';
import _ from "npm:lodash";
import hbs from 'htmlbars-inline-precompile';
import Fetcher from "../lib/fetcher";

export default Ember.Component.extend({

  authenticate:    Ember.inject.service(),
  session:         Ember.inject.service(),
  isAuthenticated: Ember.computed.alias('session.isAuthenticated'),

  jurisdictions: Ember.computed(function(){
    return Fetcher.find('jurisdiction', 'index')
  }),

  jurisdiction: Ember.computed('jurisdictionId', function(){
    return Fetcher.find('jurisdiction', this.get('jurisdictionId'))
  }),

  standardSet: Ember.computed('standardSetId', function(){
    return Fetcher.find('standardSet', this.get('standardSetId'))
  }),

  paneObserver: Ember.observer('pane', function(){
    $(window).scrollTop(0)
  }),

  scrollOnStart: Ember.on('didInsertElement', function(){
    $(window).scrollTop(0)
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
    },
    selectStandardSet(id){
      this.set('standardSetId', id)
      this.set('pane', 'standard-set')
    },
    goToPane(pane){
      this.set('pane', pane)
    }
  },

  layout: hbs`
  {{partial "navbar"}}

  <div class="standards-edit">
    {{#if isAuthenticated}}
      <div class="standards-editor-panes show-{{pane}}">
        <div class="standards-editor-panes__inner">
          <div class="standards-editor-pane">
            <h1 class="standards-edit-pane__prompt">First, choose/create a State, Organization, or School/District</h1>
            {{#if jurisdictions._status.isFetching}}
              Loading...
            {{else}}
              {{jurisdiction-lists
                jurisdictions=jurisdictions
                newOrganization=newOrganization
                selectJurisdiction=(action 'selectJurisdiction') }}
            {{/if}}
          </div>

          <div class="standards-editor-pane">
            <h1 class="standards-edit-pane__prompt">
              <div class="standards-edit-pane__back" {{action "goToPane" "jurisdictions"}}>&larr; Back</div>
              Now, choose a set of standards</h1>
            {{#if jurisdiction._status.isFetching}}
              Loading...
            {{else}}
            {{standard-sets-list
              standardSets=jurisdiction.standardSets
              jurisdictionId=jurisdictionId
              selectStandardSet=(action 'selectStandardSet')
            }}
            {{/if}}
          </div>


          <div class="standards-editor-pane">
            <h1 class="standards-edit-pane__prompt">
              <div class="standards-edit-pane__back" {{action "goToPane" "jurisdiction"}}>&larr; Back</div>
              Standards Editor</h1>
          {{#if standardSet._status.isFetching}}
              Loading...
            {{else}}
            {{standard-set-editor
              standardSet=standardSet
              jurisdiction=jurisdiction
            }}
            {{/if}}
          </div>
          <div class="standards-editor-pane">
            <h1>Versions</h1>
            - list of versions
              with info about each version
          </div>
          <div class="standards-editor-pane">
            <h1>Version</h1>
            <h1>Approved?</h1>
          </div>

        </div>
      </div>
    {{else}}
      <div class="standards-edit-description">
        <h1 class="standards-edit-h1">
          Standards Creator & Editor
        </h1>
        <h2 class="standards-edit-h2">
          Are we missing standards you rely on? Has your school, district or charter network created their own custom standards? Add them to the database and make them searchable!
        </h2>
        <p>
          Welcome to the Common Standards Project editing interface. Here, you can add or edit any standard in the database or add your own. Once your standards are in the database, you can share them so your colleagues can easily search them.
        </p>
        <h3>How does this work?</h3>
        <p>
          First, log in or sign up below. Then, add or edit standars using the easy interface. Each time someone submits a change to  the standards, we review it and then save a version. This way, if someone makes a mistake (or edits with the standards you spent hours adding), we can rollback the change. Educator rely on standards to be accurate, so we take the integrity of standards very seriously.
        </p>
        <h3>A note on copyright</h3>
        <p>
          All standards on the Common Standards Project are copyright by the owner. This means that if you add standards, you still own the copyright to the standards and can do whatever you'd like with them. All standards on the Common Standards Project are also licensed under a <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">Creative Commons Attribution license</a>. This means anyone who uses the standards on Common Standards Project can use them for free with one condition -- they  have to give credit to the license holder. If you add your standards, this license will also apply to your work -- anyone can use your standards as long as they give you credit.
        </p>
        <div class="btn btn-primary btn-block btn-lg" {{action "signIn"}}>Get Started!</div>
      </div>
    {{/if}}

  </div>
  `

})
