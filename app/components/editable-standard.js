import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';


export default Ember.Component.extend({
  actions: {
    update(value, object, field, e){
      this.sendAction('update', value, object, field)
    }
  },
  layout: hbs`
  <div class="editable-standard depth-{{standard.depth}}">
    {{i-input value=standard.listId focus-out="update" field="listId" object=standard}}
    <div class="editable-standard__listId">
      {{standard.listId}}
    </div>
    <div class="editable-standard__description">{{standard.description}}</div>
    <div class="editable-standard__notation">{{standard.statementNotation}}</div>
  </div>
  `
})
