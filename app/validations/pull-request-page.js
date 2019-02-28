import { validatePresence, validateFormat } from "ember-changeset-validations/validators"

export default {
  submitterName: validatePresence({ presence: true, message: "please enter your name" }),
  submitterEmail: validateFormat({ type: "email", message: "must be a valid email address" }),
  "standardSet.educationLevels": validatePresence({ presence: true, message: "please select an education level" }),
  "standardSet.document.sourceURL": validateFormat({ type: "url", message: "must be a valid URL" }),
  "standardSet.document.title": validatePresence({ presence: true, message: "please enter the title of the source" }),
  "standardSet.standards.subject": validatePresence({ presence: true, message: "please enter a subject" }),
  "standardSet.title": validatePresence({ presence: true, message: "please enter the grade or course name" }),
  "standardSet.jurisdiction.title": validatePresence({
    presence: true,
    message: "please select the name of the organization",
  }),
}
