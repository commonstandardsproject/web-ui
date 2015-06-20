import Ember from 'ember';
import Auth0Mixin from '../../../mixins/auth0';
import { module, test } from 'qunit';

module('Unit | Mixin | auth0');

// Replace this with your real tests.
test('it works', function(assert) {
  var Auth0Object = Ember.Object.extend(Auth0Mixin);
  var subject = Auth0Object.create();
  assert.ok(subject);
});
