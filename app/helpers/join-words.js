import Ember from 'ember';

export function joinWords(params/*, hash*/) {
  return params.join('');
}

export default Ember.HTMLBars.makeBoundHelper(joinWords);
