import config from '../config/environment';
import {registerModel, foo} from './store';

export var jurisdiction = {
  url: config.APP.apiBaseUrl + 'jurisdictions'
}

registerModel('jurisdiction')


export var standardsSet = {
  url: config.APP.apiBaseUrl + 'standard_sets'
}

registerModel('standardsSet')
