/* eslint-env node */
const EmberApp = require("ember-cli/lib/broccoli/ember-app")
var nodeSass = require("node-sass")

module.exports = function (defaults) {
  var app = new EmberApp(defaults, {
    sassOptions: {
      implementation: nodeSass,
    },
    // Add options here
  })

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  app.import("bower_components/auth0-lock/build/lock.js")
  app.import("bower_components/jsoneditor/dist/jsoneditor.js")
  app.import("bower_components/jsoneditor/dist/jsoneditor.css")
  app.import("vendor/sweetalert/sweetalert.css")
  app.import("vendor/sweetalert/sweetalert-dev.js")
  app.import("vendor/ember/ember-template-compiler.js")

  return app.toTree()
}
