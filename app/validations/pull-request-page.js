import { validatePresence, validateFormat } from "ember-changeset-validations/validators"

export default {
  submitterName: validatePresence({ presence: true, message: "Please enter your name" }),
  submitterEmail: [
    validatePresence({ presence: true, message: "Please enter your email address" }),
    validateFormat({ type: "email", message: "Must be a valid email address" }),
  ],
  "standardSet.educationLevels": validatePresence({ presence: true, message: "Please select an education level" }),
  "standardSet.document.sourceURL": [
    validatePresence({ presence: true, message: "Please enter a source URL" }),
    validateFormat({ type: "url", message: "Must be a valid URL" }),
  ],
  "standardSet.document.title": validatePresence({ presence: true, message: "Please enter the title of the source" }),
  "standardSet.subject": validatePresence({ presence: true, message: "Please enter a subject" }),
  "standardSet.title": validatePresence({ presence: true, message: "Please enter the grade or course name" }),
  "standardSet.jurisdiction.title": validatePresence({
    presence: true,
    message: "Please select the name of the organization",
  }),
}
