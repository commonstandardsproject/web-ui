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
    },
    removeStandard(standard){
      delete this.get('standardsHash')[Ember.get(standard, 'id')]
      this.notifyPropertyChange('standardsHash')
    }
  },


  layout: hbs`

    {{#sortable-group tagName="div" onChange="reorder" as |group|}}
      {{#each orderedStandards as |item| }}
        {{#sortable-item tagName="div" model=item group=group handle=".sortable-standard__handle"}}
          <div class="sortable-standard sortable-standard--depth-{{item.depth}}" data-id={{item.id}} key={{item.id}}>
            <div class="sortable-standard__icons">
              <div class="sortable-standard__delete sortable-standard__icon hint--top" data-hint='Remove' {{action "removeStandard" item}}>
                {{partial "icons/ios7-trash-filled"}}
              </div>
              <div class="sortable-standard__outdent sortable-standard__icon hint--top" data-hint="Outdent" {{action "outdent" item}}>
                {{partial "icons/arrow-left"}}
              </div>
              <div class="sortable-standard__indent sortable-standard__icon hint--top" data-hint="Indent" {{action "indent" item}}>
                {{partial "icons/arrow-right"}}
              </div>
              <div class="sortable-standard__move-up sortable-standard__handle sortable-standard__icon hint--top" data-hint="Move">
                {{partial "icons/arrow-move"}}
              </div>
            </div>
            <div class="sortable-standard__columns">
              <div class="sortable-standard__column--list-id">
                {{simple-editable value=item.listId class="sortable-standard__list-id hint--bottom" data-hint="E.g A or B or 1. or 2" placeholder="List Identifier"}}
              </div>
              <div class="sortable-standard__column--description">
                {{simple-editable value=item.description class="sortable-standard__description"}}
                {{simple-editable value=item.statementNotation class="sortable-standard__statement-notation"}}
              </div>
            </div>
          </div>
        {{/sortable-item}}
      {{/each}}
    {{/sortable-group}}

    <br>
    <div class="btn btn-default btn-block" {{action "addStandard"}}>{{partial "icons/ios7-add"}} Add a standard</div>

  `

})
