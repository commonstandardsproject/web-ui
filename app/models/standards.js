import _ from "npm:lodash";

var StandardModel = {

  hashToArray(hash){
    return _(hash).values().sortBy('position').compact().value()
  },


}

export default StandardModel;
