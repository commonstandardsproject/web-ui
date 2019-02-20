import Ember from "ember"
import hbs from "htmlbars-inline-precompile"

export default Ember.Component.extend({
  tagName: "button",
  isSpinning: false,
  progress: 0,
  disabled: false,
  attributeBindings: ["data-style", "disabled", "data-size", "data-color"],
  classNames: ["ladda-button"],
  click: function() {
    this.sendAction("action")
  },
  setProgress: function() {
    var progress = this.get("progress")
    var button = this.$().ladda()
    button.ladda("setProgress", progress)
  }.observes("progress"),
  start: function() {
    var button = this.$().ladda()
    button.ladda("start")
  },
  stop: function() {
    var button = this.$().ladda()
    button.ladda("stop")
  },
  toggleSpinning: function() {
    var isSpinning = this.get("isSpinning")
    if (isSpinning) {
      this.start()
    } else {
      this.stop()
    }
  }.observes("isSpinning"),
  isLoading: function() {
    var button = this.$().ladda()
    return button.ladda("isLoading")
  }.property(),

  layout: hbs`
    <span class="ladda-label">{{text}}</span>
  `,
})
