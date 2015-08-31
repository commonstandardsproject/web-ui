import Immutable from "npm:immutable";
import store from "./store";
import _ from "npm:lodash";


export const _update = function(doc, hash){
  return doc.withMutations(map => {
    hash.get("$set").map((v, k) => {
      map.setIn(k.split('.'), v)
    })
    return map
  })
}

export var update = function(modelName, id, hash){
  var delta     = store.deltas.add(modelName, id, hash)
  var serverDoc = store.serverCache.find(modelName, id)
  var newDoc    = _update(serverDoc, delta)

  store.local.add(modelName, id, newDoc)
}
