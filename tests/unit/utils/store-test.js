import updater from '../../../lib/updater';
import Immutable from "npm:immutable";
import { module, test } from 'qunit';

module('Unit | Utility | store');

// Replace this with your real tests.
test('it works', function(assert) {
  var update = updater.update(Immutable.Map({
    a: "hi",
    b: "don't touch"
  }), {
    "$set": {
      a: "hello",
      "c.a": "deep"
    }
  })
  assert.equal(update.get('a'), "hello");
  assert.equal(update.get('b'), "don't touch");
  assert.equal(update.getIn(['c', 'a']), "deep");
});
