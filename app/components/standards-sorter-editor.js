import Ember from "ember";
import hbs from 'htmlbars-inline-precompile';
import Standards from "../models/standards";
import diff from "npm:fast-json-patch";
import _ from "npm:lodash";
import listSorter from "../lib/positioned-list";
import uuid from "npm:node-uuid";

let get = Ember.get
let set = Ember.set


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
      console.log('newarray', newArray)
      analytics.track('Editor - Reorder')
      var oldIndex = _.indexOf(this.get('orderedStandards'), draggedItem)
      // We have to account for the top header item
      var newIndex = _.indexOf(newArray, draggedItem) -1
      console.log('newIndex Item', get(newArray[newIndex], 'description'))
      console.log('newIndex', newIndex)
      listSorter.moveItem(this.get('orderedStandards'), newIndex, oldIndex)
      _.forEach(get(this, 'standardsHash'), (s, id) => set(s, 'isCollapsed', false))
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
    },
    prepareMove(item){
      console.log('event', item)
      // get offset
      let offset = $(`#sortable-item-${item.id}`).offset()
      let scrollTop = $(window).scrollTop()

      let relativePosition = offset.top - scrollTop

      // console.log('firstoffset', offset, scrollTop, offset.top-scrollTop)

      _(get(this, 'orderedStandards'))
        .filter(s => get(s, 'depth') > get(item, 'depth'))
        .forEach(s => set(s, 'isCollapsed', true))
        .run()

      Ember.run.sync()

      // Since we hid all the elements, we need to scroll to the right place on the screen.
      Ember.run.scheduleOnce('afterRender', this, function(){
        let newOffset = $(`#sortable-item-${item.id}`).offset()
        $(window).scrollTop(newOffset.top - relativePosition)
      })
    },

  },


  layout: hbs`

    {{#sortable-group tagName="div" onChange="reorder" onDragStart="onDragStart" as |group|}}
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
      {{log orderedStandards}}
      {{#each orderedStandards as |item index| }}
        {{sortable-standard group=group standards=standardsHash item=item index=index onEnterKey=(action "onEnterKey" item) removeStandard=(action "removeStandard" item.id index) key=item.id prepareMove=(action "prepareMove" item)}}
      {{/each}}
    {{/sortable-group}}

    <br>
    <div class="btn btn-default btn-block" {{action "addStandard"}}>{{partial "icons/ios7-add"}} Add a standard</div>

  `

})
