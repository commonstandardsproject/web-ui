import Ember from "ember";
import hbs from 'htmlbars-inline-precompile';
import Standards from "../models/standards"
import diff from "npm:fast-json-patch";


export default Ember.Component.extend({


  /**
   * We'll change this to not a linked list soon.
   */
  standards: Ember.computed('standardsHash', function(){
    return Standards.linkedListToArrayNormal(this.get('standardsHash'))
  }),


  actions: {
    itemMoved(object, oldPosition, newPosition){
      console.log('args', arguments)
    }
  },


  layout: hbs`

    {{sortable-items
      itemCollection=standards
      className="sortable-standards"
      animation=100
      handle=".item__handle"
      filter=".item--pinned"
      draggable=".sortable-standard"
      ghostClass="sortable-standard--ghost"
      onItemMoveAction="itemMoved"
      templateName="sortable-items-partial"
      noItemText="<div style='text-align:center'>No items found</div>"
    }}

  `

})
