import updater from "../lib/updater";
import Immutable from "npm:immutable";
import _ from "npm:lodash";

var StandardModel = {
  update(standardsSet, standard, field, value){
    var key = ["standards", standard.id, field].join('.')
    var updateHash =  Immutable.Map({
      "$set": Immutable.Map({
        [key]: value
      })
    })
    updater.update("standardsSet", standardsSet.get('id'), updateHash)
  },


  hashToArray(hash){
    return _(hash).values().sortBy('position').value()
  },


}

export default StandardModel;
