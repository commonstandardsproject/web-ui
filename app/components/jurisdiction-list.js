import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

export default Ember.Component.extend({

  tagName: "ul",
  classNames: ['jurisdiction-list'],
  layout: hbs`
    {{#each jurisdictions as |jurisdiction|}}
      <li class="jurisdiction-list__item" {{action this.attrs.selectJurisdiction jurisdiction.id jurisdiction.title}}>{{jurisdiction.title}}</li>
    {{/each}}
  `
});
