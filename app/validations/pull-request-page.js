import { validatePresence, validateFormat } from "ember-changeset-validations/validators"

export default {
  submitterName: validatePresence({ presence: true, message: "please enter your name" }),
  submitterEmail: [
    validatePresence({ presence: true, message: "please enter your email address" }),
    validateFormat({ type: "email", message: "must be a valid email address" }),
  ],
  "standardSet.educationLevels": validatePresence({ presence: true, message: "please select an education level" }),
  "standardSet.document.sourceURL": [
    validatePresence({ presence: true, message: "please enter a source URL" }),
    validateFormat({ type: "url", message: "must be a valid URL" }),
  ],
  "standardSet.document.title": validatePresence({ presence: true, message: "please enter the title of the source" }),
  "standardSet.subject": validatePresence({ presence: true, message: "please enter a subject" }),
  "standardSet.title": validatePresence({ presence: true, message: "please enter the grade or course name" }),
  "standardSet.jurisdiction.title": validatePresence({
    presence: true,
    message: "please select the name of the organization",
  }),
}
