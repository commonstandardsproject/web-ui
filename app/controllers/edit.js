import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams:    ['pane', 'standardSetId', 'jurisdictionId'],
  pane:           'jurisdictions',
  standardSetId: null
})
