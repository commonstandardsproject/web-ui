import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams:    ['pane', 'standardsSetId', 'jurisdictionId'],
  pane:           'jurisdictions',
  standardsSetId: null
})
