import Ember from 'ember';

export function iG(params/*, hash*/) {

  if (params[0] && params[0].get) {
    return params[0].get(params[1])
  }

}

export default Ember.HTMLBars.makeBoundHelper(iG);
