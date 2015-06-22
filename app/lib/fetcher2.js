import models from './models';
import store from './store2';
import _ from "npm:lodash";

var requests = []

var Fetcher = Ember.Object.extend(Ember.Evented, {

  find(modelName, id){
    if (Ember.isNone(id)) return null;
    var model = store.local.find(modelName, id)

    if(shouldFetch(model._status)){
      $.ajax({
        url: models[modelName].url + '/' + id.replace('index', ''),
        method: "GET",
        headers: {
          "Auth-Token": "vZKoJwFB1PTJnozKBSANADc3"
        },
        success: function(_data){
          var data = _data.data
          if (Ember.isArray(data)){
            data = {
              list: _data.data
            }
          }
          data._status = {
            inLocalStore: true,
            isFetching: false,
          }
          return store.local.add(modelName, id, data)
        }.bind(this)
      })
    }

    return model

  }
})

var shouldFetch = function(status){
  return status.inLocalStore !== true && status.isFetching !== true
}

var fetcher = Fetcher.create()

export {fetcher as default};
