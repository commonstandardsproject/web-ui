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
  }

}
