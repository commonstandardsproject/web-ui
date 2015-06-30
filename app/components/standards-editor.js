import Ember from "ember";
import hbs from 'htmlbars-inline-precompile';
import Standards from "../models/standards";
import diff from "npm:fast-json-patch";
import _ from "npm:lodash";


export default Ember.Component.extend({



  // orderedStandards: Ember.computed('standards.@each.position', function(){
  //   return this.get('standards')
  // }),

  orderedStandards: Ember.computed('standardsHash', function(){
    console.log('redo ordered standards', this.get('standardsHash'))
    console.log(_.pluck(Standards.hashToArray(this.get('standardsHash')), 'id'))
    return Standards.hashToArray(this.get('standardsHash'))
  }),


  actions: {
    itemMoved(object, oldPosition, newPosition){
      console.log('args', arguments)
      var below = this.get('orderedStandards')[newPosition - 1]
      var above = this.get('orderedStandards')[newPosition]
      var belowPosition
      var abovePosition
      below ? belowPosition = below.position : belowPosition = 0;
      above ? abovePosition = above.position : abovePosition = belowPosition + 2000;

      // Ember.set(this.get('standardsHash')[object.id], 'position', Math.floor(belowPosition + ((abovePosition - belowPosition) / 2) ))
      // console.log('oldPosition', object.position, 'newPosition', Math.floor(belowPosition + ((abovePosition - belowPosition) / 2) ))
      // Ember.set(object, 'position', Math.floor(belowPosition + ((abovePosition - belowPosition) / 2) ))
      // Ember.set(this.get('standardsHash')["E8C41506286643DF8BDDF5373674D290"], 'position', 500)

      // var hash = JSON.parse(JSON.stringify(this.get('standardsHash')))
      // this.set('standardsHash', {})
      Ember.run.later(this, function(){
        // this.set('standardsHash', hash)
        // this.notifyPropertyChange('standardsHash')
        // this.rerender()
      }, 1000)
    },

    move(){
      Ember.set(this.get('standardsHash')["E8C41506286643DF8BDDF5373674D290"], 'position', 4500)
      this.notifyPropertyChange('standardsHash')
      this.rerender()
    },
    indent(standard){
      Ember.set(standard, 'depth', standard.depth + 1)
    },
    outdent(standard){
      Ember.set(standard, 'depth', standard.depth - 1)
    },
    moveUp(){

    },
    moveDown(){
    }
  },


  layout: hbs`

    {{sortable-items
      itemCollection=orderedStandards
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
