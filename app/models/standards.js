import updater from "../lib/updater";
import Immutable from "npm:immutable";
import _ from "npm:lodash";

var StandardModel = {
  update(standardSet, standard, field, value){
    var key = ["standards", standard.id, field].join('.')
    var updateHash =  Immutable.Map({
      "$set": Immutable.Map({
        [key]: value
      })
    })
    updater.update("standardSet", standardSet.get('id'), updateHash)
  },


  hashToArray(hash){
    return _(hash).values().sortBy('position').compact().value()
  },


}

export default StandardModel;
