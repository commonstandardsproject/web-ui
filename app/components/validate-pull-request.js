import Ember from "ember"
import hbs from "htmlbars-inline-precompile"
import Changeset from "ember-changeset"
let { get } = Ember

export default Ember.Component.extend({
  layout: hbs`
    <div class="edit">
      {{#if errors}}
          {{#each (filter-by "key" propertyName errors) as |errorset|}}
            {{#each errorset.validation as |error|}}
              <li>{{error}}</li>
            {{/each}}
        {{/each}}
      {{/if}}
    </div>
  `,
})
