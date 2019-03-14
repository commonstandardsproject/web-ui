export default function lengthValidator() {
  return (key, oldValue) => {
    let numberOfStandards = Object.keys(oldValue).length
    let isValid = numberOfStandards >= 5
    return isValid ? true : "not enough standards"
  }
}
