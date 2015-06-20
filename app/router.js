import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('home', {path: '/'})
  this.route('search')
  this.route('api-info')
  this.route('document-importer');
  this.route('edit', function(){
    this.route('info')
  });
  this.route('editor')
});

export default Router;
