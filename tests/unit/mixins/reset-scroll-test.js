import Ember from 'ember';
import ResetScrollMixin from '../../../mixins/reset-scroll';
import { module, test } from 'qunit';

module('Unit | Mixin | reset scroll');

// Replace this with your real tests.
test('it works', function(assert) {
  var ResetScrollObject = Ember.Object.extend(ResetScrollMixin);
  var subject = ResetScrollObject.create();
  assert.ok(subject);
});
