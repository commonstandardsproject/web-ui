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

  addStandard(depth, position){
    analytics.track('Editor - Add Standard')
    var id = uuid.v4().replace(/-/g, '').toUpperCase()
    var standard = {
      id:                id,
      depth:             depth,
      position:          position,
      listId:            "",
      description:       "",
      statementNotation: ""
    }
    this.get('standardsHash')[id] = standard
    this.notifyPropertyChange('standardsHash')
    return standard
  },


  actions: {
    indent(standard){
      analytics.track('Editor - Indent')
      Ember.set(standard, 'depth', standard.depth + 1)
    },
    outdent(standard){
      if (standard.depth === 0) return;
      analytics.track('Editor - Outdent')
      Ember.set(standard, 'depth', standard.depth - 1)
    },
    reorder(newArray, draggedItem){
      analytics.track('Editor - Reorder')
      var oldIndex = _.indexOf(this.get('orderedStandards'), draggedItem)
      var newIndex = _.indexOf(newArray, draggedItem)
      listSorter.moveItem(this.get('orderedStandards'), newIndex, oldIndex)
      this.notifyPropertyChange('standardsHash')
    },
    onEnterKey(item){
      var newStandard = this.addStandard(item.depth, item.position + 1)
      Ember.run.scheduleOnce('afterRender', function(){
        $("[data-id=" + newStandard.id + "] .sortable-standard__list-id").focus()
      })
      return true
    },
    addStandard(){
      var depth = _.get(_.last(this.get('orderedStandards')), 'depth', 0)
      var position = _.get(_.last(this.get('orderedStandards')), 'position', 0) + 1000
      this.addStandard(depth, position)
    },
    removeStandard(id, index){
      if (window.confirm("Are you sure you want to delete this standard?")){
        analytics.track('Editor - Remove Standard')
        delete this.get('standardsHash')[id]
        this.notifyPropertyChange('standardsHash')
        if (index){
          Ember.run.scheduleOnce('afterRender', function(){
            var $el = $('.sortable-standard__list-id')[index]
            if ($el) $el.focus(); // might be the last item, so check if it exists
          })
        }
      }
    }
  },


  layout: hbs`

    {{#sortable-group tagName="div" onChange="reorder" as |group|}}
      {{! We need to wrap this as a sortable item so the sortable item handler
          knows to include it when it calculates absolute position}}
      {{#sortable-item tagName="div" group=group handle=".sortable-standard__handle"}}
      <div class="sortable-standard sortable-standard__header">
        <div class="sortable-standard__columns">
          <div class="sortable-standard__column--list-id sortable-standard__column--header">
            <div>Outline</div>
            <div class="sortable-standard__column--help-text">E.g. I, II, III or A, B, C, etc</div>
          </div>
          <div class="sortable-standard__column--description sortable-standard__column--header">
            <div>Standard</div>
            <div class="sortable-standard__column--help-text">The text of the standard</div>
          </div>
          <div class="sortable-standard__column--statement-notation sortable-standard__column--header">
            <div>Code</div>
            <div class="sortable-standard__column--help-text">The shorthand identifier e.g. 1.NBT.4</div>
          </div>
          <div class="sortable-standard__icons sortable-standard__column--header">
            <div>Actions</div>
            <div class="sortable-standard__column--help-text">Move, Ident, Outdent, Delete</div>
          </div>
        </div>
      </div>
      {{/sortable-item}}
      {{#each orderedStandards as |item index| }}
        {{#sortable-item tagName="div" model=item group=group handle=".sortable-standard__handle"}}
          <div class="sortable-standard sortable-standard--depth-{{item.depth}}" data-id={{item.id}} key={{item.id}}>
            <div class="sortable-standard__columns">
              <div class="sortable-standard__column--list-id">
                {{simple-editable value=item.listId class="sortable-standard__list-id hint--bottom" placeholder="List Identifier" onEnterKey=(action "onEnterKey" item) removeStandard=(action "removeStandard" item.id index)}}
              </div>
              <div class="sortable-standard__column--description">
                {{simple-editable value=item.description class="sortable-standard__description" onEnterKey=(action "onEnterKey" item) removeStandard=(action "removeStandard" item.id index)}}
              </div>
              <div class="sortable-standard__column--statement-notation">
                {{simple-editable value=item.statementNotation class="sortable-standard__statement-notation" onEnterKey=(action "onEnterKey" item) removeStandard=(action "removeStandard" item.id index)}}
              </div>
              <div class="sortable-standard__icons">
                <div class="sortable-standard__move-up sortable-standard__handle sortable-standard__icon hint--top" data-hint="Move">
                  {{partial "icons/arrow-move"}}
                </div>
                <div class="sortable-standard__outdent sortable-standard__icon hint--top" data-hint="Outdent" {{action "outdent" item}}>
                  {{partial "icons/arrow-left"}}
                </div>
                <div class="sortable-standard__indent sortable-standard__icon hint--top" data-hint="Indent" {{action "indent" item}}>
                  {{partial "icons/arrow-right"}}
                </div>
                <div class="sortable-standard__delete sortable-standard__icon hint--top" data-hint='Remove' {{action "removeStandard" item.id}}>
                  {{partial "icons/ios7-trash-filled"}}
                </div>

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
