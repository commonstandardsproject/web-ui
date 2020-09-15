import Ember from "ember"
import hbs from "htmlbars-inline-precompile"
import _ from "npm:lodash"

export default Ember.Component.extend({
  layout: hbs`
  {{#unless item.isCollapsed}}
  {{#sortable-item tagName="div" model=item group=group handle=".sortable-standard__handle" id=(join-words 'sortable-item-' item.id) }}
  <div class="sortable-standard sortable-standard-table" data-id={{item.id}}>
      <div class="sortable-standard__icons">
        <div class="sortable-standard__move-up sortable-standard__handle sortable-standard__icon hint--top" aria-label="Drag" {{action attrs.prepareMove on="mouseDown"}} data-hint="Move">
          {{partial "icons/arrow-move"}}
        </div>
        <div class="sortable-standard__outdent sortable-standard__icon hint--top" aria-label="Outdent" data-hint="Outdent" {{action attrs.outdent item}}>
          {{partial "icons/arrow-left"}}
        </div>
        <div class="sortable-standard__indent sortable-standard__icon hint--top" aria-label="Indent" data-hint="Indent" {{action attrs.indent item}}>
          {{partial "icons/arrow-right"}}
        </div>
        <div class="sortable-standard__delete sortable-standard__icon hint--top" aria-label="Delete" data-hint='Remove' {{action attrs.removeStandard item.id}}>
          {{partial "icons/ios7-trash-filled"}}
        </div>
      </div>
    <div class="sortable-standard sortable-standard__column--depth-{{item.depth}} sortable-standard__columns" data-id={{item.id}}>

      <div class="sortable-standard__column--list-id">
        {{simple-editable
          value=item.listId
          class="sortable-standard__list-id hint--bottom"
          placeholder="List Identifier"
          onEnterKey=attrs.onEnterKey
          onMetaDelete=attrs.removeStandard
          onArrowUp=(action attrs.onArrow "up" item.id "sortable-standard__list-id")
          onArrowDown=(action attrs.onArrow "down" item.id "sortable-standard__list-id")
          onArrowLeft=(action attrs.outdent item)
          onArrowRight=(action attrs.indent item)
        }}
      </div>
      <div class="sortable-standard__column--description">
        {{simple-editable
          value=item.description
          class="sortable-standard__description"
          onEnterKey=attrs.onEnterKey
          onMetaDelete=attrs.removeStandard
          onArrowLeft=(action attrs.outdent item)
          onArrowRight=(action attrs.indent item)
        }}
      </div>
      <div class="sortable-standard__column--statement-notation">
        {{simple-editable
          value=item.statementNotation
          class="sortable-standard__statement-notation"
          onEnterKey=attrs.onEnterKey
          onMetaDelete=attrs.removeStandard
          onArrowUp=(action attrs.onArrow "up" item.id "sortable-standard__statement-notation")
          onArrowDown=(action attrs.onArrow "down" item.id "sortable-standard__statement-notation")
          onArrowLeft=(action attrs.outdent item)
          onArrowRight=(action attrs.indent item)
        }}
      </div>
    </div>
  </div>
  {{!-- {{#unless item.isCollapsed}}
    {{#sortable-group onChange=attrs.reorder as |nestedGroup|}}
      {{#each item.ancestorIds as |id index|}}
        {{sortable-standard item=(look-up standards id) index=index group=nestedGroup standards=standards}}
      {{/each}}
    {{/sortable-group}}
  {{/unless}} --}}
  {{/sortable-item}}
  {{/unless}}

  `,
})
