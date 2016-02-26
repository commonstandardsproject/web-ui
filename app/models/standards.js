import Ember from "ember";
import _ from "npm:lodash";

var StandardModel = {

  hashToArray(hash){
    let values = _(hash).values().sortBy('position').compact().value()
    return _(values).map((val, index) => {
      let stop = false
      let ancestorIds = _(values).drop(index + 1).filter(va => {
        if (va.depth === val.depth) stop = true;
        return stop === false && va.depth > val.depth
      }).pluck('id').run()
      Ember.set(val, 'ancestorIds', ancestorIds)
      Ember.set(val, 'isCollapsed', false)
      return val
    }).run()
  },


}

export default StandardModel;
