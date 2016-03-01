import Ember from "ember";
import models from './models';
import store from './store';
import rpc from "./rpc";
import _ from "npm:lodash";

var requests = []

var Fetcher = Ember.Object.extend(Ember.Evented, {

  find(modelName, id, fetch){
    if (Ember.isNone(id)){
      return new Ember.RSVP.Promise(function(resolve, reject){
        resolve(null)
      });
    }
    var model = store.local.find(modelName, id)

    return new Ember.RSVP.Promise(function(resolve, reject){
      if(shouldFetch(model._status) || fetch === true){
        model._status.isFetching = true
        var url = models[modelName].url + '/' + id.replace('index', '')
        rpc["fetcherGet"](url, function(_data){
          if (_data === undefined) return
          var data = _.clone(_data.data) || {}
          if (Ember.isArray(data)){
            data = {
              list: _data.data
            }
          }
          data._status = {
            inLocalStore: true,
            isFetching: false,
          }
          store.local.add(modelName, id, data)
          store.server.add(modelName, id, data)
          resolve(data)
        }.bind(this), function(err){
          reject(err)
        })
      } else {
        resolve(model)
      }
    })

  }
})

var shouldFetch = function(status){
  return status.inLocalStore !== true && status.isFetching !== true
}

var fetcher = Fetcher.create()

export {fetcher as default};
