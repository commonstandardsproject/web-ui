import Ember from "ember"
import hbs from "htmlbars-inline-precompile"

export default Ember.Component.extend({
  layout: hbs`
    <div class="standards-edit">
      {{#each (filter-by "key" propertyName errors) as |errorset|}}
        {{#each errorset.validation as |error|}}
          <li>{{error}}</li>
        {{/each}}
      {{/each}}
    </div>
  `,
})
