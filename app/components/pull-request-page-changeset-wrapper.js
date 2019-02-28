import Ember from "ember"
import hbs from "htmlbars-inline-precompile"
import Changeset from "ember-changeset"
let { get } = Ember

export default Ember.Component.extend({
  init() {
    this._super(...arguments)
    let model = get(this, "model")
    this.changeset = new Changeset(model)
  },

  layout: hbs`
      {{pull-request-page model=(changeset model)}}
  `,
})
