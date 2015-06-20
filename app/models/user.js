import Ember from "ember";
import config from '../config/environment';

export default {
  afterSignIn(profile){
    $.ajax({
      method:   "POST",
      dataType: "json",
      url:      config.urls.postUsers,
      data: {
        profile: profile,
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
