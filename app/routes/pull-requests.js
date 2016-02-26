import Ember from 'ember';
import Fetcher from "../lib/fetcher"

export default Ember.Route.extend({

  model(params){
    return Fetcher.find('pullRequest', params.id)
  }
  
});
