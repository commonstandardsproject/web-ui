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

export var pullRequest = {
  url: config.APP.apiBaseUrl + 'pull_requests'
}

registerModel('pullRequest')
registerModel2('pullRequest')

export var userPullRequests = {
  url: config.APP.apiBaseUrl + 'pull_requests/user'
}

registerModel('userPullRequests')
registerModel2('userPullRequests')
