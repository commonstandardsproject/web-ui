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
      this.notifyPropertyChange('standardsHash')
    },

    outdent(standard){
      if (standard.depth === 0) return;
      analytics.track('Editor - Outdent')
      Ember.set(standard, 'depth', standard.depth - 1)
      this.notifyPropertyChange('standardsHash')
    },

    // find node above
    // find the node's last ancestorId and find the position of that item
    // increment it by 100 and apply to all the nodes from that point onward
    reorder(newArray, draggedItem){

      let offset = $(`#sortable-item-${draggedItem.id}`).offset()
      let scrollTop = $(window).scrollTop()
      let relativePosition = offset.top - scrollTop

      analytics.track('Editor - Reorder')

      var oldIndex = _.indexOf(this.get('orderedStandards'), draggedItem)
      var itemsToMoveIds = [get(draggedItem, 'id')]
      if (get(draggedItem, 'ancestorIds')) {
        itemsToMoveIds = itemsToMoveIds.concat(get(draggedItem, 'ancestorIds'))
      }

      var itemsToMove = _.map(itemsToMoveIds, id => get(this, `standardsHash.${id}`))

      // pull out the header item which is just null
      _.pull(newArray, null)
      var newIndex = _.indexOf(newArray, draggedItem)
      var itemAbove = newArray[newIndex - 1]
      var itemAboveIndex

      // index isn't 0, so we set it
      if (itemAbove){
        let ids = [get(itemAbove, 'id')];

        // if it's the same depth, we want the last of it's ancestors
        // as those are hidden in the UI
        if (itemAbove.depth === draggedItem.depth) {
          ids = _.compact(ids.concat(itemAbove.ancestorIds))
        }

        // look it up from the standardsHash
        itemAbove = get(this, `standardsHash.${_.last(ids)}`)

        itemAboveIndex = _.chain(get(this, 'orderedStandards'))
          .reject(s => _.includes(itemsToMoveIds, get(s, 'id')))
          .map(s => get(s, 'id'))
          .indexOf(get(itemAbove, 'id'))
          .run()

      } else {
        itemAboveIndex = -1
      }

      // Get the standards back with a new position
      var newStandards = listSorter.moveItemAndAncestors(get(this, 'orderedStandards'), itemsToMove, itemAboveIndex)

      // Update from the new standards
      _.each(get(this, 'standardsHash'), (value, key) => {
        set(get(this, 'standardsHash'), key, get(newStandards, key))
      })

      // Change the iscollapsed status
      _.forEach(get(this, 'standardsHash'), (s, id) => set(s, 'isCollapsed', false))

      // Let ember know we changed the hash
      this.notifyPropertyChange('standardsHash')

      // Scroll to the old place
      Ember.run.scheduleOnce('afterRender', this, function(){
        let newOffset = $(`#sortable-item-${draggedItem.id}`).offset()
        $(window).scrollTop(newOffset.top - relativePosition)
      })
    },
    onEnterKey(item){
      var newStandard = this.addStandard(item.depth, item.position + 1)
      Ember.run.scheduleOnce('afterRender', function(){
        $("[data-id=" + newStandard.id + "] .sortable-standard__list-id").focus()
      })
      return true
    },

    onArrow(direction, itemId, className){
      let index = _.chain(get(this, 'orderedStandards'))
        .map(s => get (s, 'id'))
        .findIndex(s => s === itemId)
        .value()

      let addend
      if (direction === "up") addend = -1
      if (direction === "down") addend = +1
      let nextStandard = get(this, 'orderedStandards').objectAt(index + addend)

      if (nextStandard) {
        $(`[data-id=${get(nextStandard, 'id')}] .${className}`).focus()
      }
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
      // get offset
      let offset = $(`#sortable-item-${item.id}`).offset()
      let scrollTop = $(window).scrollTop()
      let relativePosition = offset.top - scrollTop

      // console.log('firstoffset', offset, scrollTop, offset.top-scrollTop)

      _(get(this, 'orderedStandards'))
        .filter(s => get(s, 'depth') > get(item, 'depth'))
        .forEach(s => set(s, 'isCollapsed', true))
        .run()

      // Sync so the sortable helper has the right data
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

      {{#each orderedStandards as |item index| }}
        {{sortable-standard
          group=group
          standards=standardsHash
          item=item
          index=index
          key=item.id
          onEnterKey=(action "onEnterKey" item)
          onArrow=(action "onArrow")
          removeStandard=(action "removeStandard" item.id index)
          prepareMove=(action "prepareMove" item)
          indent=(action "indent")
          outdent=(action "outdent")
          removeStandard=(action "removeStandard")
        }}

      {{/each}}
    {{/sortable-group}}

    <br>
    <div class="btn btn-default btn-block" {{action "addStandard"}}>{{partial "icons/ios7-add"}} Add a standard</div>

  `

})
