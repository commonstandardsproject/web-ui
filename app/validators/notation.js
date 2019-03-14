import _ from "npm:lodash"

export default function validateNotation() {
  return (key, oldValue) => {
    let checkStandardNotation = _.filter(Object.values(oldValue), standard => {
      return !_.isEmpty(standard.statementNotation)
    })
    //checking if ~1/3 of standards have notation
    let isValid = checkStandardNotation.length / Object.values(oldValue).length >= 0.3

    return isValid ? true : "notation needed"
  }
}
