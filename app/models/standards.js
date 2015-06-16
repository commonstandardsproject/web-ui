import updater from "../lib/updater";
import Immutable from "npm:immutable";

var Standards = {
  update(standardsSet, standard, field, value){
    var key = ["standards", standard.id, field].join('.')
    var updateHash =  Immutable.Map({
      "$set": Immutable.Map({
        [key]: value
      })
    })
    updater.update("standardsSet", standardsSet.get('id'), updateHash)
  }
}

export default Standards;
