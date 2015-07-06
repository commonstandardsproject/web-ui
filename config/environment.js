/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'standards-importer',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
        'ember-routing-htmlbars-improved-actions': true,
        'ember-views-component-block-info': true,
        'ember-htmlbars-component-generation': true
      }
    },
    // Here you can pass flags/options to your application instance
    // when it is created
    APP: {
      apiKey: "vZKoJwFB1PTJnozKBSANADc3"
    }
  };


  if (environment === 'development') {
    ENV.APP.apiBaseUrl = "http://teachnow.local:9393/api/"
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    ENV.APP.apiBaseUrl = "http://localhost:9393/api/"
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.APP.apiBaseUrl = "http://api.commonstandardsproject.com/api/"

  }

  return ENV;
};
