import Ember from "ember"
import algoliasearch from "npm:algoliasearch"

export default Ember.Service.extend({
  index: Ember.computed(function() {
    var client = algoliasearch("O7L4OQENOZ", "d6679b2a84e9b985c208bbca79ab4d31")
    return client.initIndex("common-standards-project")
  }),
})
