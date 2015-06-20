import Ember from 'ember';
import auth0 from "../mixins/auth0";

export default Ember.Route.extend(auth0, {
  actions: {
    signIn: function(){
      return this.showSignin()
    }
  }

});
