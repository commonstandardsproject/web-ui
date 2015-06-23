import config from '../config/environment';
import {registerModel} from './store';
import {registerModel as registerModel2} from './store2';

export var jurisdiction = {
  url: config.APP.apiBaseUrl + 'jurisdictions'
}

registerModel('jurisdiction')
registerModel2('jurisdiction')


export var standardsSet = {
  url: config.APP.apiBaseUrl + 'standard_sets'
}

registerModel('standardsSet')
registerModel2('standardsSet')

export var user = {
  url: config.APP.apiBaseUrl + 'users'
}

registerModel('user')
registerModel2('user')
