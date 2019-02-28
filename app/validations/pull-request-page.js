import { validatePresence, validateFormat } from "ember-changeset-validations/validators"

export default {
  submitterName: validatePresence(true),
  submitterEmail: validateFormat({ type: "email" }),
  "standardSet.educationLevels": validatePresence(true),
  "standardSet.document.sourceURL": validateFormat({ type: "url" }),
  "standardSet.document.title": validateFormat(true),
  "standardSet.standards.subject": validatePresence(true),
  "standardSet.title": validatePresence(true),
  "standardSet.jurisdiction.title": validatePresence(true),
}
