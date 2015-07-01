import Ember from 'ember';
import _ from "npm:lodash";
import hbs from 'htmlbars-inline-precompile';

export default Ember.Component.extend({


  isSearchVisible: Ember.computed('standardSetIds', function(){
    return _.chain(this.get('standardSetIds'))
            .filter(s => !_.contains(s, 'blank'))
            .value().length > 0
  }),


  actions: {
    addPane(){
      this.sendAction('addPane')
    },
    selectSet(id, oldId){
      this.sendAction('selectSet', id, oldId)
    },
    removeSet(id){
      if (this.get('standardSetIds').length == 1) return;
      this.sendAction('removeSet', id)
    }
  },

  layout: hbs`
  {{partial "navbar"}}

  <div class="search-interface">

    <div class="search-bar {{if isSearchVisible 'show'}}">
      {{input value=query class="search-bar__input" placeholder="What would you like to search for?"}}
      <div class="show-link" {{action 'showLink'}}>
        {{partial "icons/ios7-link"}}
      </div>
    </div>

    <div class="search-panes">
      {{#each standardSetIds as |id|}}
        {{standard-set id=id jurisdictions=jurisdictions selectSet="selectSet" class="standard-set" removeSet="removeSet"}}
      {{/each}}
      {{#if isSearchVisible}}
        <div class="add-search-pane-button" {{action 'addPane'}}>
          {{partial "icons/ios7-browser-outline"}}
        </div>
      {{/if}}
    </div>
  </div>
  `


})
