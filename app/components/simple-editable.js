import Ember from "ember"
import hbs from "htmlbars-inline-precompile"
import _ from "npm:lodash"

export default Ember.Component.extend({
  tagName: "div",
  attributeBindings: ["contenteditable", "placeholder"],

  // Variables:
  editable: true,
  isUserTyping: false,
  plaintext: true,
  placeholder: "",

  classNameBindings: ["isEmpty"],

  isEmpty: Ember.computed("value", function() {
    return this.get("value") === "" || this.get("value") == null || this.get("value") === undefined
  }),

  // Properties:
  contenteditable: Ember.computed("editable", function() {
    var editable = this.get("editable")
    return editable ? "true" : undefined
  }),

  // Observers:
  willRender() {
    if (this.get("isUserTyping")) return
    if (this.$() === undefined) return
    var value = this.get("value") || ""
    this.$().html(value)
  },

  didInsertElement() {
    if (this.$() === undefined) return
    var value = this.get("value") || ""
    this.$().html(value)
  },

  focusIn: function() {
    if (this.$() === undefined) return
    var text = this.$().text()

    var focusInWordCount = 0
    // if there are words
    if (text.length > 0) {
      focusInWordCount = text.split(" ").length
    }

    this.set("focusInWordCount", focusInWordCount)
    this.set("isUserTyping", true)
    return true
  },

  focusOut: function() {
    var text = this.$().text()
    var focusOutWordCount = 0

    // if there are words
    if (text.length > 0) {
      focusOutWordCount = text.split(" ").length
    }
    var deltaCount = focusOutWordCount - this.get("focusInWordCount")

    if (this.get("tracking-name") && deltaCount !== 0) {
      // analytics.track(this.get('tracking-name'), {
      //   words: deltaCount
      // })
    }
    this.set("isUserTyping", false)
    return true
  },

  keyDown: function(event) {
    if (!event.metaKey) {
      this.set("isUserTyping", true)
    }
    // prevent enter key
    if (event.shiftKey !== true && (event.keyCode === 13 || event.which === 13)) {
      event.preventDefault()
      this.sendAction("onEnterKey")
      return true
    }

    if ((event.ctrlKey === true || event.metaKey === true) && (event.keyCode === 8 || event.which === 8)) {
      this.sendAction("onMetaDelete")
    }

    // Up/Down Arrow
    if (event.keyCode === 38) {
      this.sendAction("onArrowUp")
    }
    if (event.keyCode === 40) {
      this.sendAction("onArrowDown")
    }

    // Left/Right Arrow + command
    if ((event.ctrlKey === true || event.metaKey === true) && event.keyCode === 37) {
      this.sendAction("onArrowLeft")
    }
    if ((event.ctrlKey === true || event.metaKey === true) && event.keyCode === 39) {
      this.sendAction("onArrowRight")
    }

    return true
  },

  keyUp: function(event) {
    let text = this.$().text()
    text = this.get("maxLength") ? _.truncate(text, { length: this.get("maxLength"), omission: "" }) : text
    return this.set("value", text)
  },

  drop: function(event) {
    event.preventDefault()
  },

  paste: function(e) {
    var pastedText
    if (window.clipboardData && window.clipboardData.getData) {
      // IE
      pastedText = window.clipboardData.getData("URL")
    } else if (e.originalEvent.clipboardData && e.originalEvent.clipboardData.getData) {
      pastedText = e.originalEvent.clipboardData.getData("text/plain")
    }
    document.execCommand("insertHTML", false, pastedText)
    this.set("value", this.$().text())

    e.preventDefault()
  },
})
