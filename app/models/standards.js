import updater from "../lib/updater";
import Immutable from "npm:immutable";

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

  linkedListToArray(sHash){
    if (sHash == undefined) return;
    var first = sHash.find((v, k) => {
      return v.get('firstStandard') == true
    })
    var getNext = function(acc, hash, standard){
      acc.push(standard.toJS())
      if (standard.get('nextStandard')) {
        getNext(acc, hash, hash.get(standard.get('nextStandard')))
      }
      return acc
    }
    return getNext([], sHash, first)
  }
}

export default StandardModel;
