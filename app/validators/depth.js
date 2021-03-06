import _ from "npm:lodash"

export default function validateDepth() {
  return (key, oldValue) => {
    let depthObj = _.chain(Object.values(oldValue))
      .map(standard => standard.depth)
      .groupBy()
      .reduce((result, val, key) => {
        result[key] = val.length
        return result
      }, {})
      .value()

    //ensures outline form by counting # of standards with indentation of 0 and 1
    let isValid = depthObj[0] >= 1 && depthObj[1] >= 4
    return isValid ? true : "indentation needed"
  }
}
