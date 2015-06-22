import Ember from "ember";
import config from '../config/environment';

export default {
  afterSignIn(profile){
    $.ajax({
      method:   "POST",
      dataType: "json",
      url:      config.urls.postUserSignedIn,
      data: {
        profile: profile,
      },
      headers: {
        "Auth-Token": "vZKoJwFB1PTJnozKBSANADc3"
      },
      success(){
        console.log('updated successfully')
      },
      error(){

      }
    })
  }
}
// Ember.Object.extend({
//
//
// })
