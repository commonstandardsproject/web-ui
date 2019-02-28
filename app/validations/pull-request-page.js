import { validatePresence, validateFormat } from "ember-changeset-validations/validators"

export default {
  "standardSet.submitterName": validatePresence(true),
  "standardSet.submitterEmail": validateFormat({ type: "email" }),
  "standardSet.educationLevels": validatePresence(true),
  "standardSet.document.sourceURL": validateFormat({ type: "url" }),
  "standardSet.document.title": validateFormat(true),
  "standardSet.standards.subject": validatePresence(true),
  "standardSet.standards.title": validatePresence(true),
  "standardSet.jurisdiction.title": validatePresence(true),
}
