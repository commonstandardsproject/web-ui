export default function lengthValidator() {
  return (key, oldValue) => {
    let numberOfStandards = Object.keys(oldValue).length
    return numberOfStandards >= 5 ? true : "not enough standards"
  }
}
