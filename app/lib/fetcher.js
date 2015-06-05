import models from './models';
import store from "./store";
import Immutable from "npm:immutable";
import _ from "npm:lodash";


var requests = []

var Fetcher = Ember.Object.extend(Ember.Evented, {
  find(modelName, id){
    var model = store.store().getIn(['models', modelName, id])

    if (model) return model;
    if (_.contains(requests, modelName+id)) return Immutable.Map();
    requests.push(modelName+id)

    $.ajax({
      url: models[modelName].url + '/' + id,
      dataType: "json",
      type: "get",
      success: function(data){
        console.log('Imm', Immutable.fromJS(data.data))
        store.update(store.store().setIn(['models', modelName, id], Immutable.fromJS(data.data)))
        _.pull(requests, modelName+id)
        this.trigger('storeUpdated')
      }.bind(this)
    })

    return Immutable.Map()

  }
})

var fetcher = Fetcher.create()

export {fetcher as default};
