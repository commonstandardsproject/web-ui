import Ember from "ember"
import Application from "@ember/application"
import Resolver from "./resolver"
import loadInitializers from "ember-load-initializers"
import config from "./config/environment"

const App = Application.extend({
  modulePrefix: config.modulePrefix,
  Resolver: Resolver,
  customEvents: {
    paste: "paste",
  },
})

loadInitializers(App, config.modulePrefix)

Ember.LinkComponent.reopen({
  attributeBindings: ["data-hint"],
})

Ember.Component.reopen({
  attributeBindings: ["data-hint"],
})

export default App
