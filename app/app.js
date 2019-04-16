import Ember from "ember"
import Application from "@ember/application"
import Resolver from "./resolver"
import loadInitializers from "ember-load-initializers"
import * as Sentry from "@sentry/browser"
import { init } from "@sentry/browser"
import * as Integrations from "@sentry/integrations"
import config from "./config/environment"

const App = Application.extend({
  modulePrefix: config.modulePrefix,
  Resolver: Resolver,
  customEvents: {
    paste: "paste",
  },
})

if (config.environment === "production") {
  init({
    dsn: "https://fc38237be543483c8faf57ebd6310e94@sentry.io/1440387",
    environment: config.environment,
    integrations: [new Integrations.Ember()],
  })
}

loadInitializers(App, config.modulePrefix)

Ember.LinkComponent.reopen({
  attributeBindings: ["data-hint"],
})

Ember.Component.reopen({
  attributeBindings: ["data-hint"],
})

export default App
