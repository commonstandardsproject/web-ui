import Ember from "ember"
import _ from "npm:lodash"

export default Ember.Controller.extend({
  queryParams: ["query", "ids"],
  ids: ["blank"],

  actions: {
    addPane() {
      this.get("ids").pushObject("blank" + Ember.generateGuid())
    },
    selectSet(id, oldId) {
      var idx = this.get("ids").indexOf(oldId)
      this.get("ids").replace(idx, 1, [id])
    },
    removeSet(id) {
      this.get("ids").removeObject(id)
    },
  },
})
