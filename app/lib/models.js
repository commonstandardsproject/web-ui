import config from '../config/environment';
import {registerModel} from './store';
import {registerModel as registerModel2} from './store';

export var jurisdiction = {
  url: config.APP.apiBaseUrl + 'jurisdictions'
}

registerModel('jurisdiction')
registerModel2('jurisdiction')


export var standardSet = {
  url: config.APP.apiBaseUrl + 'standard_sets'
}

registerModel('standardSet')
registerModel2('standardSet')

export var user = {
  url: config.APP.apiBaseUrl + 'users'
}

registerModel('user')
registerModel2('user')

export var commit = {
  url: config.APP.apiBaseUrl + 'commits'
}

registerModel('commit')
registerModel2('commit')
