import Ember from 'ember';
import _ from "npm:lodash";

export default Ember.Component.extend({

  actions: {
    onSubmit(){
      var data = {
        title:          this.get('title'),
        url:            this.get('url'),
        submitterEmail: this.get('session.profile.email'),
        submitterName:  this.get('submitterName'),
        type:           this.get('type')
      }

      let values = _.values(data)
      let has = _.curry(_.includes, 2)(values)
      let isValid = !has("") && !has(null) && !has(undefined)

      if (isValid){
        this.attrs.onSubmit(data)
      } else {
        this.set('errorMessage',  "You must fill out all the fields");
      }
    }
  }
});
