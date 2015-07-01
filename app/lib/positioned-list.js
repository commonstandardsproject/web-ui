import Ember from "ember";
import _ from "npm:lodash";

/**
 * Public: Move an item
 *
 * First, we remove the object. This simplifies the index
 * counting. If we leave the object in the array, we have to
 * account for whether the new index is above or below thd
 * old index
 *
 * oldIndex - the index the item is at now
 * newIndex - the index you want to move the item to
 *
 * Returns self
 */
export function moveItem(sortedArray, newIdx, oldIdx){
  var item = sortedArray.objectAt(oldIdx)
  var array = _.clone(sortedArray) || []
  array.removeObject(item)

  var position = _getPositionForIndex(newIdx, array)

  if (_isInteger(position) == false || position < 0){
    array.splice(newIdx, 0, item)
    this._rebalanceList(array)
  } else {
    Ember.set(item, 'position', position)
  }

  return this
}



/**
 * Public: Add an object at the specified index
 *
 * object   - The object to add
 * newIndex - The position to insert the object at
 *
 * Returns self
 */

export function addObjectAtIndex(sortedArray, object, newIndex){
  var array = _.clone(sortedArray)

  var position = _getPositionForIndex(newIndex, array)
  Ember.set(object, 'position', position)

  if (_isInteger(position) == false || position < 0){
    _rebalanceList(array)
  }

  return this
}

/**
 * Public. Add a model above the current model
 *
 * model    - to insert above
 * newModel - the model to insert
 *
 * Returns this
 */

export function addModelAbove(sortedArray, model, newModel) {
  var index = sortedArray.indexOf(model);
  if (index == -1){ index = 0 }
  this.addObjectAtIndex(sortedArray, newModel, index)

  return this
}



/**
 * Public. Add a model below the current model
 *
 * model    - to insert above
 * newModel - the model to insert
 *
 * Returns this
 */

export function addModelBelow(sortedArray, model, newModel){
  var index = sortedArray.indexOf(model);
  this.addObjectAtIndex(sortedArray, newModel, index + 1)

  return this
}


/* Private:  Return the position to set an element
 * if you want to insert it at a specificed index
 *
 * Index - Integer to insert at
 *
 * Returns the position
 *
 * NOTE:
 * The list should probably be rebalanced if the position
 * is not an integer or negative
 */

function _getPositionForIndex(newIndex, array){

  var above, below, position;
  if (array.length == 0){
    position = 1000
  } else if (newIndex == 0){
    // add at beginning
    var firstItemPosition = Ember.get(array.objectAt(0), 'position')
    position = firstItemPosition - 1000
  } else if (newIndex >= array.length){
    // add at end
    var lastItemPosition = Ember.get(array.objectAt(array.length - 1), 'position')
    position = lastItemPosition + 1000
  } else {
    var below =  array.objectAt(newIndex - 1)
    var above =  array.objectAt(newIndex)
    var abovePosition = Ember.get(above, 'position')
    var belowPosition = Ember.get(below, 'position')
    if (abovePosition - belowPosition > 2){
      position = belowPosition + Math.floor((abovePosition - belowPosition)/2)
    } else {
      position = belowPosition + 0.5
    }
  }
  return position
}



function _rebalanceList(array){
  Ember.run.sync()
  Ember.run(this, function(){
    Ember.beginPropertyChanges()
    _.each(array, function(item, index){
      Ember.set(item, 'position', (index+1)*1000)
    })
    Ember.endPropertyChanges()
  })
}


function _isInteger(number) {
  return number % 1 === 0;
}
