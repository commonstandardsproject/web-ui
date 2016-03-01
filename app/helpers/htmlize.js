import Ember from 'ember';

export default Ember.Helper.helper(function(params=[""]/*, hash*/){
  return Ember.String.htmlSafe(params[0].replace(/(\r\n|\n|\r)/g,"<br />"));
});
