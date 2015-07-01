import Ember from "ember";
import hbs from 'htmlbars-inline-precompile';
import Standards from "../models/standards";
import diff from "npm:fast-json-patch";
import _ from "npm:lodash";
import listSorter from "../lib/positioned-list";
import uuid from "npm:node-uuid";


export default Ember.Component.extend({

  orderedStandards: Ember.computed('standardsHash', function(){
    return Standards.hashToArray(this.get('standardsHash'))
  }),


  actions: {
    indent(standard){
      Ember.set(standard, 'depth', standard.depth + 1)
    },
    outdent(standard){
      Ember.set(standard, 'depth', standard.depth - 1)
    },
    reorder(newArray, draggedItem){
      var oldIndex = _.indexOf(this.get('orderedStandards'), draggedItem)
      var newIndex = _.indexOf(newArray, draggedItem)
      listSorter.moveItem(this.get('orderedStandards'), newIndex, oldIndex)
      this.notifyPropertyChange('standardsHash')
    },
    addStandard(){
      var id = uuid.v4().replace('-', '').toUpperCase()
      this.get('standardsHash')[id] = {
        depth:    Ember.get(_.last(this.get('orderedStandards')), 'depth'),
        position: Ember.get(_.last(this.get('orderedStandards')), 'position') + 1000
      }
      this.notifyPropertyChange('standardsHash')
    }
  },


  layout: hbs`

    {{#sortable-group tagName="div" onChange="reorder" as |group|}}
      {{#each orderedStandards as |item| }}
        {{#sortable-item tagName="div" model=item group=group handle=".sortable-standard__handle"}}
          {{partial "sortable-items-partial"}}
        {{/sortable-item}}
      {{/each}}
    {{/sortable-group}}

    <br>
    <div class="btn btn-default btn-block" {{action "addStandard"}}>{{partial "icons/ios7-add"}} Add a standard</div>

  `

})
