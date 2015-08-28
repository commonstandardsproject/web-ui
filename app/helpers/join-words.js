import Ember from 'ember';

export function joinWords(params/*, hash*/) {
  return params.join('');
}

export default Ember.Helper.helper(joinWords);
