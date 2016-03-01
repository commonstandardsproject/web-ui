import Ember from 'ember';
import resetScroll from "../mixins/reset-scroll";
import Fetcher from "../lib/fetcher";

export default Ember.Route.extend(resetScroll, {

  beforeModel(){
    analytics.track('Search Page')
  },

  model(){
    return Fetcher.find('jurisdiction', 'index')
  }

});
