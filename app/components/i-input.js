import Ember from 'ember';
import _ from "npm:lodash";
import Immutable from "npm:immutable";

export default Ember.Component.extend(Ember.TextSupport, {
  tagName: "input",

  attributeBindings: [
    'accept',
    'autocomplete',
    'autosave',
    'dir',
    'formaction',
    'formenctype',
    'formmethod',
    'formnovalidate',
    'formtarget',
    'height',
    'inputmode',
    'lang',
    'list',
    'max',
    'min',
    'multiple',
    'name',
    'pattern',
    'size',
    'step',
    'type',
    'value',
    'width'
  ],

  focusOut: function(event){
    this.sendAction('focus-out', this.get('value'), this.get('object'), this.get('field'), event)
  }

})
