import updater from "../lib/updater";
import Immutable from "npm:immutable";

/**
 * Standards Model
 */

export default {
  /**
   * Update the model
   */
  update(standardsSet, standard, field, value){
    var key = ["standards", standard.get('id'), field].join('.')
    updater.update("standardsSet", standardsSet.get('id'), Immutable.Map({
      "$set": Immutable.Map({
        [key]: value
      })
    }))

  }
}
