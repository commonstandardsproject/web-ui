export default function lengthValidator() {
  return (key, oldValue) => {
    let length = Object.keys(oldValue).length
    return length >= 5
  }
}
