import Ember from "ember"
import hbs from "htmlbars-inline-precompile"
import MultiselectCheckboxesComponent from "ember-multiselect-checkboxes/components/multiselect-checkboxes"

export default MultiselectCheckboxesComponent.extend({
  tagName: "div",
  classNames: ["education-level-checkboxes"],

  layout: hbs`
  {{#each checkboxes as |checkbox|}}
    <div class="checkbox education-level-checkboxes__checkbox {{if checkbox.isSelected 'checked'}}">
      <label>
        {{input type="checkbox" checked=checkbox.isSelected disabled=disabled}}
        {{checkbox.label}}
      </label>
    </div>
  {{/each}}
  `,
})
