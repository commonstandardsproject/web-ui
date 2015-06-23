import Ember from "ember";
import config from '../config/environment';
import {local} from "../lib/store2";

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
      success(data){
        local.add('users', data.data.email, data)
        return data
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
