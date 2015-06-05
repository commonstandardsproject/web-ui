import Immutable from "npm:immutable";


var _store = Immutable.Map({
  models: Immutable.Map(),
})

var store = function(){
  return _store
}

var registerModel = function(model){
  _store = _store.setIn(['models', model], Immutable.Map())
  return _store
}

var update = function(state){
  _store = state
}




export {registerModel, update, store};
