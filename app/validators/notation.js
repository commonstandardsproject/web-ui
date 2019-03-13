import _ from "npm:lodash"

export default function validateNotation() {
  return (key, oldValue) => {
    let checkStandardNotation = _.map(Object.values(oldValue), standard => {
      if (standard.statementNotation) {
        return true
      } else {
        return false
      }
    })

    let hasNotation = _.filter(checkStandardNotation, notation => {
      return notation === true
    })
    return hasNotation.length / checkStandardNotation.length >= 0.3 ? true : "notation needed"
  }
}
