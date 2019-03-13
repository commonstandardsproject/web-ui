import _ from "npm:lodash"

export default function validateNotation() {
  return (key, oldValue) => {
    let checkStandardNotation = _.filter(Object.values(oldValue), standard => {
      return standard.statementNotation
    })

    let isValid = checkStandardNotation.length / Object.values(oldValue).length

    return isValid >= 0.3 ? true : "notation needed"
  }
}
