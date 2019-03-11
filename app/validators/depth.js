import _ from "npm:lodash"

export default function validateDepth() {
  return (key, oldValue) => {
    // _.chain(Object.values(oldValue))
    // _.map(standard => standard.depth)
    // _.groupBy(Math.floor)
    // _.reduce((result, val, key) => {
    //   result[key] = val.length
    //   return result
    // }, {}).value()
    //what the heck is a histogram?
    // historygraph["0"] > 0 && histograph["1"] > 2
    //
    //
    let depthObj = _.reduce(
      Object.values(oldValue),
      (acc, standard) => {
        if (!acc[standard.depth]) {
          acc[standard.depth] = 1
        } else {
          acc[standard.depth]++
        }
        return acc
      },
      {}
    )
    depthObj[0] >= 2 && depthObj[1] >= 2 ? true : false
  }
}
