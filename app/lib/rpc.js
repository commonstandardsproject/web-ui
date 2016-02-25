import config from '../config/environment';
import {local} from "../lib/store";
import Ember from "ember";
import _ from "npm:lodash";


var headers = function(){
  return {
    "Api-Key":        JSON.parse(sessionStorage.getItem('es__apiKey')) || config.APP.apiKey,
    "Authorization":  JSON.parse(sessionStorage.getItem('es__Authorization'))
  }
}

var defaultPost = function(){
  return {
    contentType: "application/json",
    dataType:    "json",
    method:      "POST",
    headers:     headers()
  }
}

export default Ember.Object.create({

  addJurisdiction(data, cb, errCb){
    $.ajax(_.merge({}, defaultPost(), {
      url:      config.APP.apiBaseUrl + 'jurisdictions',
      data:     JSON.stringify({jurisdiction: data}),
      success:  cb,
      error:    errCb
    }))
  },

  "pullRequest:create": function(data, cb, error){
    $.ajax(_.merge({}, defaultPost(), {
      url:      config.APP.apiBaseUrl + 'pull_requests',
      data:    JSON.stringify(data),
      success:  cb,
      error:    error,
    }))
  },

  "pullRequest:save": function(data, cb, error){
    $.ajax(_.merge({}, defaultPost(), {
      url:     config.APP.apiBaseUrl + 'pull_requests' + '/' + data.id,
      data:    JSON.stringify({data: data}),
      success: cb,
      error:   error,
    }))
  },

  "commit:make": function(data, cb, error){
    $.ajax(_.merge({}, defaultPost(), {
      url:      config.APP.apiBaseUrl + 'commits',
      data:     JSON.stringify({data: data}),
      success:  cb,
      error:    error,
    }))
  },

  "commit:approve": function(id, cb){
    $.ajax(_.merge({}, defaultPost(), {
      url:      config.APP.apiBaseUrl + 'commits' + '/' + id + '/approve',
      success:  cb,
      error:    cb
    }))
  },

  "commit:reject": function(id, cb){
    $.ajax(_.merge({}, defaultPost(), {
      url:      config.APP.apiBaseUrl + 'commits' + '/' + id + '/reject',
      success:  cb,
      error:    cb,
    }))
  },

  "user:updateAllowedOrigins": function(id, origins, cb){
    $.ajax(_.merge({}, defaultPost(), {
      url:      config.APP.apiBaseUrl + 'users' + '/' + id + '/allowed_origins',
      data:     JSON.stringify({data: origins}),
      success:  cb,
      error:    cb,
    }))
  },

  "user:afterSignIn": function(profile, cb){
    $.ajax(_.merge({}, defaultPost(), {
      url:      config.APP.apiBaseUrl + 'users/signed_in',
      data:     JSON.stringify({ profile: profile }),
      success(data){
        local.add('user', data.data.email, data)
        return cb(data)
      },
      error: cb
    }))
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
    $.ajax(_.merge({}, defaultPost(), {
      url:      config.APP.apiBaseUrl + 'standard_sets',
      data:     JSON.stringify(params),
      success:  cb,
      error:    cb
    }))
  }


})
