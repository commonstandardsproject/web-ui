import config from '../config/environment';
import {local} from "../lib/store";
import Ember from "ember";


var headers = function(){
  return {
    "Api-Key":        config.APP.apiKey,
    "Authorization":  JSON.parse(sessionStorage.getItem('es__Authorization'))
  }
}

export default Ember.Object.create({

  addJurisdiction(data, cb, errCb){
    $.ajax({
      url:      config.APP.apiBaseUrl + 'jurisdictions',
      dataType: "json",
      method:   "POST",
      headers:  headers(),
      data:     {jurisdiction: data},
      success:  cb,
      error:    errCb
    })
  },

  "commit:make": function(data, cb, error){
    $.ajax({
      url:      config.APP.apiBaseUrl + 'commits',
      dataType: "json",
      method:   "POST",
      headers:  headers(),
      data:     {data: data},
      success:  cb,
      error:    error,
    })
  },

  "commit:approve": function(id, cb){
    $.ajax({
      url:      config.APP.apiBaseUrl + 'commits' + '/' + id + '/approve',
      dataType: "json",
      method:   "POST",
      headers:  headers(),
      success:  cb,
      error:    cb,
    })
  },

  "commit:reject": function(id, cb){
    $.ajax({
      url:      config.APP.apiBaseUrl + 'commits' + '/' + id + '/reject',
      dataType: "json",
      method:   "POST",
      headers:  headers(),
      success:  cb,
      error:    cb,
    })
  },

  "user:updateAllowedOrigins": function(id, origins, cb){
    $.ajax({
      url:      config.APP.apiBaseUrl + 'users' + '/' + id + '/allowed_origins',
      dataType: "json",
      method:   "POST",
      headers:  headers(),
      data:     {data: origins},
      success:  cb,
      error:    cb,
    })
  },

  "user:afterSignIn": function(profile, cb){
    $.ajax({
      url:      config.APP.apiBaseUrl + 'users/signed_in',
      method:   "POST",
      dataType: "json",
      data:     { profile: profile },
      headers:  headers(),
      success(data){
        local.add('user', data.data.email, data)
        return cb(data)
      },
      error: cb
    })
  },

  "fetcherGet": function(url, cb){
    $.ajax({
      url:     url,
      method:  "GET",
      headers: headers(),
      success: cb,
      error:   cb
    })
  },

  "standardSet:create": function(params, cb){
    $.ajax({
      url:      config.APP.apiBaseUrl + 'standard_sets',
      method:   "POST",
      dataType: "json",
      data:     params,
      headers:  headers(),
      success:  cb,
      error:    cb
    })
  }


})
