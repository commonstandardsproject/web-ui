import _ from "npm:lodash";
import rusDiff from "npm:rus-diff";

export default function(a, b){
  var diff = rusDiff.diff(a, b)
  return _.map(diff, function(value, key){
    return {
      op:           key,
      pathAndValue: value
    }
  })

}
