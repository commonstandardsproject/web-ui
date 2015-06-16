import Ember from 'ember';
import _ from "npm:lodash";
import Immutable from "npm:immutable";
import updater from "../lib/updater"
import Standards from "../models/standards"

export default Ember.Component.extend({

  standardsList: Ember.computed('standardsHash', function(){
    var sHash = this.get('standardsHash')
    if (Ember.isNone(sHash)) return;
    var first = sHash.find((v, k) => {
      return v.get('firstStandard') == true
    })
    var getNext = function(acc, hash, standard){
      acc.push(standard)
      if (standard.get('nextStandard')) {
        getNext(acc, hash, hash.get(standard.get('nextStandard')))
      }
      return acc
    }
    return getNext([], sHash, first)
  }),

  actions: {
    update(value, object, field, e){
      Standards.update(this.get('standardsSet'), object, field, value)
    }
  }

})
