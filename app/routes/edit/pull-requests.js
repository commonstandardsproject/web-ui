import Ember from 'ember';
import Fetcher from "../../lib/fetcher"
import resetScroll from "../../mixins/reset-scroll";

export default Ember.Route.extend(resetScroll, {

  authenticate:    Ember.inject.service(),
  session:         Ember.inject.service(),

  isAuthenticated: Ember.computed('session.authenticatedAt', function(){
    return (Date.now() - this.get('session.authenticatedAt')) < 3100000
  }),

  beforeModel(){
    if (Ember.get(this, 'isAuthenticated') === false) {
      this.transitionTo('edit')
    }
  },

  model(params){
    return Fetcher.find('pullRequest', params.id)
  }

});
