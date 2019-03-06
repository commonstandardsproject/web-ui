import Ember from "ember"
import hbs from "htmlbars-inline-precompile"
let { get } = Ember

export default Ember.Component.extend({
  init() {
    this._super(...arguments)
  },

  layout: hbs`
    <div>
      {{pull-request-page model=model}}
    </div>
  `,
})
