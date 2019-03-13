import _ from "npm:lodash"

export default function validateDepth() {
  return (key, oldValue) => {
    let depthObj = _.chain(Object.values(oldValue))
      .map(standard => standard.depth)
      .groupBy(Math.floor)
      .reduce((result, val, key) => {
        result[key] = val.length
        return result
      }, {})
      .value()

    return depthObj[0] >= 2 && depthObj[1] >= 2 ? true : "indentation needed"
  }
}
