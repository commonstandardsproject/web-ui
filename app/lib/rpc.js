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
  }

}
