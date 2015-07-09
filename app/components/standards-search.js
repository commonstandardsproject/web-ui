import Ember from 'ember';
import _ from "npm:lodash";
import hbs from 'htmlbars-inline-precompile';

export default Ember.Component.extend({

  search: Ember.inject.service('AlgoliaSearch'),

  isSearchVisible: Ember.computed('standardSetIds', function(){
    return _.chain(this.get('standardSetIds'))
            .filter(s => !_.contains(s, 'blank'))
            .value().length > 0
  }),


  didUpdateAttrs(){
    Ember.run.throttle(this, this.searchAlgolia, 30)
  },

  searchAlgolia(){
    if (this.get('query') == "" || Ember.isNone(this.get('query'))){
      this.set('results', null)
      return
    }
    this.get('search.index').search(this.get('query'), {
      attributesToRetrieve: 'id',
      tagFilters: [this.get('standardSetIds')]
    }).then(data => {
      this.set('results', _.pluck(data.hits, 'id'))
    }).catch(function(err){
      console.log('err', err)
    })
  },


  actions: {
    selectSet(id, oldId){
      analytics.track('Search - Select Set')
      this.attrs.selectSet(id, oldId)
    },
    removeSet(id){
      analytics.track('Search - Remove Set')
      if (this.get('standardSetIds').length == 1) return;
      this.attrs.removeSet(id)
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
        {{standard-set id=id jurisdictions=jurisdictions selectSet="selectSet" class="standard-set" removeSet="removeSet" results=results}}
      {{/each}}
      {{#if isSearchVisible}}
        <div class="add-search-pane-button hint--left" {{action this.attrs.addPane}} data-hint="Compare standards by adding a pane">
          {{partial "icons/ios7-browser-outline"}}
          <div class="add-search-pane-button__text">Compare Standards</div>
        </div>
      {{/if}}
    </div>
  </div>
  <a href="http://commoncurriculum.com" class="sponsorship-footer">
    <div class="sponsorship-footer__logo">{{partial "icons/cc-logo"}}</div>
    <div class="sponsorship-footer__loving">Lovingly built by Common Curriculum, the social lesson planner with standards built-in</div>
  </a>
  `


})
