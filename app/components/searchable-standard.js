import Ember from "ember";
import hbs from 'htmlbars-inline-precompile';

export default Ember.Component.extend({


  textToCopy: Ember.computed('standard.description', function(){
    var statementNotation = this.get('standard.statementNotation') || ''
    return [statementNotation, this.get('standard.description')].join(' ')
  }),

  classNames: ['searchable-standard'],
  classNameBindings: ['classNameDepth'],
  classNameDepth: Ember.computed('standard.depth', function(){
    return "searchable-standard--depth-" + this.get("standard.depth")
  }),

  layout: hbs`
    <div class="searchable-standard__list-id">{{standard.listId}}</div>
    <div class="searchable-standard__description">{{{standard.description}}}
      <em class="searchable-standard__statement-notation">{{standard.statementNotation}}</em>
      {{!-- {{partial "icons/ios7-link"}} --}}
      {{#zero-clipboard text=textToCopy title="Copy to clipboard" class="btn hint--top searchable-standard__btn-copy" data-hint="Copy to clipboard" afterCopy=this.attrs.didCopy }}
        {{partial "icons/clipboard"}}
      {{/zero-clipboard}}
    </div>
  `

})
