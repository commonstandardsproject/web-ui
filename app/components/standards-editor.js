import Ember from 'ember';
import _ from "npm:lodash";
import Immutable from "npm:immutable";
import hbs from 'htmlbars-inline-precompile';

export default Ember.Component.extend({

  showJurisdictions: false,

  showPane: Ember.computed('jurisdiction', 'showJurisdictions', function(){
    if (Ember.isNone(this.get('jurisdiction')) || this.get('showJurisdictions')) {
      return "show-jurisdictions";
    } else {
      return "show-standard-sets"
    }
  }),

  standardSets: Ember.computed('jurisdiction', function(){
    // debugger;
    if (!this.get('jurisdiction')) return;
    var sets = this.attrs.jurisdiction.value.get('standardSets') || Immutable.List()
    return sets.sortBy(s => s.get('subject'))
  }),

  actions: {
    showJurisdictions: function(){
      this.set('showJurisdictions', true)
    },

    hideJurisdictions: function(){
      this.set('showJurisdictions', false)
    },

    clickJurisdiction: function(){
      this.set('showJurisdictions', false)
    },

  },

  layout: hbs`
  {{partial "navbar"}}

  <div class="editor-grid">
    <div class="editor-grid__column editor-grid__column--with-panes">
      <div class="editor-grid__column__pane-container {{showPane}}">
        <div class="editor-grid__column__pane">
          <div class="editor-grid__column__header">
            <h1 class="editor-grid__column__title"> Jurisdictions & Organizations </h1>
          </div>
          <div class="editor-grid__column__body">
            <div class="editor__jurisdiction-list">
              {{#each controller.jurisdictions as |jurisdiction|}}
                <span {{action "clickJurisdiction"}}>
                {{#link-to (query-params jurisdictionId=jurisdiction.id) class="editor__jurisdiction-list__item" }}
                  {{jurisdiction.title}}
                {{/link-to}}
                </span>
              {{/each}}
            </div>
          </div>
        </div>

        <div class="editor-grid__column__pane">
          <div class="editor-grid__column__header">
            <a class="btn btn-default" {{action "showJurisdictions"}} href="#">&larr; Back to Jurisdictions</a>
            <h1 class="editor-grid__column__title">{{i-g jurisdiction "title"}}</h1>
          </div>
          <div class="editor-grid__column__body">
            <div class="standard-set-list">
            {{#each standardSets as |set|}}
              {{#link-to (query-params standardsSetId=(i-g set "id")) class="standard-set-list__item"}}
                <div class="standard-set-list__subject">{{i-g set "subject"}}</div>
                <div class="standard-set-list__title">{{i-g set "title"}}</div>
              {{/link-to}}
            {{/each}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="editor-grid__column editor-grid__column--standards">
      <div class="editor-grid__column__header">
        <h1 class="editor-grid__column__title">Standards</h1>
      </div>
      <div class="editor-grid__column__body">
        <label for="title">Title</label>
        <input id="title" value={{i-g standardsSet "title"}}>
        {{editable-standards-list standardsSet=standardsSet standardsHash=(i-g standardsSet "standards") }}
      </div>
    </div>
  </div>
  `


})
