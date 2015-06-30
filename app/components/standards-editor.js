import Ember from "ember";
import hbs from 'htmlbars-inline-precompile';
import Standards from "../models/standards"
import diff from "npm:fast-json-patch";


export default Ember.Component.extend({


  /**
   * We'll change this to not a linked list soon.
   */
  standards: Ember.computed('standardsHash', function(){
    return Standards.hashToArray(this.get('standardsHash'))
  }),


  actions: {
    itemMoved(object, oldPosition, newPosition){
      console.log('args', arguments)
    },
    indent(standard){
      Ember.set(standard, 'depth', standard.depth + 1)
    },
    outdent(standard){
      Ember.set(standard, 'depth', standard.depth - 1)
    }
  },


  layout: hbs`

    {{sortable-items
      itemCollection=standards
      class="sortable-standards"
      animation=100
      handle=".sortable-handle"
      draggable=".sortable-standard"
      ghostClass="sortable-standard--ghost"
      onItemMoveAction="itemMoved"
      templateName="sortable-items-partial"
      noItemText="<div style='text-align:center'>No items found</div>"
      indent="indent"
      outdent="outdent"
    }}

    <div class="btn btn-default btn-block" {{action "addStandard"}}>{{partial "icons/ios7-add"}} Add a standard</div>

  `

})
