import Ember from 'ember';
import _ from "npm:lodash";
import Immutable from "npm:immutable";
import updater from "../lib/updater"
import Standards from "../models/standards"
import hbs from 'htmlbars-inline-precompile';


export default Ember.Component.extend({

  standardsList: Ember.computed('standardsHash', function(){
    var sHash = this.get('standardsHash')
    if (Ember.isNone(sHash)) return;
    return Standards.linkedListToArray(this.get('standardsHash'))
  }),

  actions: {
    update(value, object, field, e){
      Standards.update(this.get('standardsSet'), object, field, value)
    }
  },
  layout: hbs`
    <div class="editable-standards-list">
    {{#each standardsList key="id" as |standard|}}
      <editable-standard standard={{standard}} update="update"/>
    {{/each}}
    </div>
  `

})
