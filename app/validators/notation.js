import _ from "npm:lodash"

export default function validateNotation() {
  return (key, oldValue) => {
    let checkStandardNotation = _.filter(Object.values(oldValue), standard => {
      return !_.isEmpty(standard.statementNotation)
    })

    let isValid = checkStandardNotation.length / Object.values(oldValue).length

    return isValid >= 0.3 ? true : "notation needed"
  }
}
