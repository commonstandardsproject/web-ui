import config from '../config/environment';

export default {

  addJurisdiction(data, cb, errCb){
    $.ajax({
      url:      config.urls.postJurisdiction,
      dataType: "json",
      method:   "POST",
      data:     {jurisdiction: data},
      success:  cb,
      error:    errCb
    })
  },

  "commit:make": function(data, cb){
    $.ajax({
      url:      config.urls.postCommit,
      dataType: "json",
      method:   "POST",
      data:     {data: data},
      success:  cb,
      error:    cb,
    })
  },

  "commit:approve": function(id, cb){
    $.ajax({
      url:      config.urls.postCommitApproval + '/' + id,
      dataType: "json",
      method:   "POST",
      success:  cb,
      error:    cb,
    })
  },

  "user:updateAllowedOrigins": function(id, origins, cb){
    $.ajax({
      url:      config.urls.postUser + '/' + id + '/allowed_origins',
      dataType: "json",
      method:   "POST",
      data:     {data: origins},
      success:  cb,
      error:    cb,
    })
  }


}
