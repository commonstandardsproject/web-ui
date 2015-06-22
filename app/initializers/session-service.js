// app/initializers/session-service.js
import Session from '../services/storage';

var session = Session.create({
  type: 'session',
});

export function initialize(container, application) {
  container.register('service:session', session, {instantiate: false});
  application.inject('route', 'session', 'service:session');
  application.inject('component', 'session', 'service:session');
}

export default {
  name: 'session-service',
  initialize: initialize
};
