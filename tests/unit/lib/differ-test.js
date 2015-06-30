import { moduleFor, test } from 'ember-qunit';
import { module } from 'qunit';
import differ from "../../../lib/differ";

// moduleFor('lib:differ', 'Unit | Lib | differ', {
//   // Specify the other units that are required for this test.
//   // needs: ['service:foo']
// });

module('Unit | Lib | differ', {})

// Replace this with your real tests.
test('it exists', function(assert) {
  assert.ok(differ)
});

test('$set in hash', function(assert){
  var diff = differ({a: 1}, {a: 1, b:2})
  assert.deepEqual(diff, {"$set": {"b": 2}})
})

test('finds differences in array', function(assert){
  var diff = differ({a: [1, 2]}, {a: [1]})
  assert.deepEqual(diff, {
    "$set": {
      "a": [1]
    }

  })
})

test('$unset', function(assert){
  var diff = differ({a: [1, 2]}, {})
  assert.deepEqual(diff, {
    "$unset": { a: true} })
})
