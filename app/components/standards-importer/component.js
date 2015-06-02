import Ember from 'ember';
import config from '../../config/environment';

export default Ember.Component.extend({

  actions: {
    viewJurisdiction(id={}){
      this.sendAction('viewJurisdiction', id.id)
    },

    viewStandardsDocument(id){
      this.sendAction("viewStandardsDocument", id)
    },

    viewStandardsSet(query){
      this.sendAction("viewStandardsSet", query)
    },

    importStandards(query){
      this.sendAction("importStandards", query)
    }
  }


});
