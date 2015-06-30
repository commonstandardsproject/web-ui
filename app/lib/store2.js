import Ember from "ember";

var store = {
  localModels: {},
  deltas:      {},
  serverCache: {},
}


var registerModel = function(model){
  return store.localModels[model] = Ember.Object.create()
}


var local = {

  find(modelName, id){
    var model = store.localModels[modelName][id]
    if (Ember.isNone(model)){
      model = store.localModels[modelName][id] = Ember.Object.create({
        _status: {
          inLocalStore: false,
        }
      })
    }
    return model
  },

  add(modelName, id, doc){
    store.localModels[modelName][id] = store.localModels[modelName][id] || Ember.Object.create({})
    store.localModels[modelName][id].setProperties(doc)
  }
}


/**
Options:
- store
  - models
    - standards
      - id
        - local
        - server
        - deltas

- store
  - local
  - server
  - deltas

I think I like the latter because of invalidating the server cache or finding the deltas,
*/


var server = {

  find(modelName, id){
    var model = store.serverCache[modelName][id]
    if (Ember.isNone(model)){
      model = store.serverCache[modelName][id] = Ember.Object.create({})
    }
    return model
  },

  add(modelName, id, doc){
    store.serverCache[modelName][id] = store.localModels[modelName][id] || Ember.Object.create({})
    store.localModels[modelName][id].setProperties(doc)
  }

}


var deltas = {
  add(modelName, id, hash){
    var state = store().mergeDeepIn(['deltas', modelName, id], hash)
    // _update(state)
    return store().getIn(['deltas', modelName, id])
  }
}




export {registerModel, local, deltas};
