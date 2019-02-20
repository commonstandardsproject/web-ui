import Ember from "ember"
import Fetcher from "../../lib/fetcher"
import resetScroll from "../../mixins/reset-scroll"
import { storageFor } from "ember-local-storage"

export default Ember.Route.extend(resetScroll, {
  authenticate: Ember.inject.service(),
  session: storageFor("persistedSession"),

  isAuthenticated: Ember.computed("session.authenticatedAt", function() {
    return Date.now() - this.get("session.authenticatedAt") < 3100000
  }),

  beforeModel(transition) {
    if (Ember.get(this, "isAuthenticated") === false) {
      this.transitionTo("edit").then(
        function() {
          Ember.get(this, "authenticate").showSignin(function() {
            transition.retry()
          })
        }.bind(this)
      )
    }
  },

  model(params) {
    return Fetcher.find("pullRequest", params.id)
  },
})
