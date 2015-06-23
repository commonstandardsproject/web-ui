import Ember from 'ember';
import auth0 from "../mixins/auth0";
import resetScroll from "../mixins/reset-scroll";

export default Ember.Route.extend(auth0, resetScroll, {
  actions: {
    signIn: function(){
      return this.showSignin()
    }
  }

});
