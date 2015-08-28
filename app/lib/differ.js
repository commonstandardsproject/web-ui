import _ from "npm:lodash";
import rusDiff from "npm:rus-diff";

export default function(a, b){
  var diff = rusDiff.diff(a, b)
  return _.flatten(_.map(diff, (hash, op) => {
     return _.map(hash, (value, path) => {
      return {
        op: op,
        path: path,
        value: value
      }
    })
  }))

}
