import Immutable from "npm:immutable";
import Fetcher from "./fetcher"


var _store = Immutable.Map({
  localModels: Immutable.Map(),
  deltas: Immutable.Map(),
  serverCache: Immutable.Map(),
})

var store = function(){
  return _store
}

var registerModel = function(model){
  return store().setIn(['localModels', model], Immutable.Map())
}

var _update = function(state){
  _store = state
  return state
}

var local = {
  find(modelName, id){
    return store().getIn(['localModels', modelName, id])
  },

  add(modelName, id, doc){
    var state = _update(store().setIn(['localModels', modelName, id], doc))
    _update(state)
    // var s = doc.getIn(['standards', "D45BAC3CF12547D09B0A42C63B7277D9"])
    // if (s) console.log('s', s.toJS())
    Fetcher.trigger('storeUpdated')
    return state
  }
}


var serverCache = {
  add(modelName, id, doc){
    _update(store().setIn(['serverCache', modelName, id], doc))

    // currently ignores appling the local changes
    local.add(modelName, id, doc)
  },

  find(modelName, id){
    return store().getIn(['serverCache', modelName, id])
  }
}


var deltas = {
  add(modelName, id, hash){
    console.log('hash', hash.toJS())
    var state = store().mergeDeepIn(['deltas', modelName, id], hash)
    _update(state)
    return store().getIn(['deltas', modelName, id])
  }
}




export {registerModel, serverCache, local, deltas};
