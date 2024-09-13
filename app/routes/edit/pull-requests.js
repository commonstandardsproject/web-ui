import Ember from "ember"
import { storageFor } from "ember-local-storage"
import Fetcher from "../../lib/fetcher"
import resetScroll from "../../mixins/reset-scroll"

export default Ember.Route.extend(resetScroll, {
  authenticate: Ember.inject.service(),
  session: storageFor("persistedSession"),

  isAuthenticated: Ember.computed("session.authenticatedAt", function () {
    return Date.now() - this.get("session.authenticatedAt") < 3100000
  }),

  beforeModel(transition) {
    if (Ember.get(this, "isAuthenticated") === false) {
      this.transitionTo("edit").then(() => {
        Ember.get(this, "authenticate").show()
        Ember.get(this, "authenticate.lock").on("authenticate", () => {
          transition.retry()
        })
      })
    }
  },

  model(params) {
    return Fetcher.find("pullRequest", params.id)
  },
})
