import Ember from "ember"
import _ from "npm:lodash"
import hbs from "htmlbars-inline-precompile"
import { storageFor } from "ember-local-storage"

export default Ember.Component.extend({
  session: storageFor("persistedSession"),

  actions: {
    onSubmit() {
      var data = {
        title: this.get("title"),
        url: this.get("url"),
        submitterEmail: this.get("session.profile.email"),
        submitterName: this.get("submitterName"),
        type: this.get("type"),
      }

      let values = _.values(data)
      let has = _.curry(_.includes, 2)(values)
      let isValid = !has("") && !has(null) && !has(undefined)

      if (isValid) {
        this.attrs.onSubmit(data)
      } else {
        this.set("errorMessage", "You must fill out all the fields")
      }
    },
  },

  layout: hbs`
  <form class="add-jurisdiction {{if showFormInFloatingBox 'in-floating-box'}}">
    {{#if errorMessage}}
      <div class="alert alert-danger">{{errorMessage}}</div>
    {{/if}}
    <div class="form-group">
      <label for="add-jurisdiction__title">{{humanizedType}} Name</label>
      {{input id="add-jurisdiction__title" class="form-control" value=title placeholder="Enter name" required=true}}
    </div>
    <div class="form-group">
      <label for="add-jurisdiction__url">{{humanizedType}} Website</label>
      {{input id="add-jurisdiction__url" class="form-control" value=url placeholder="Enter website" required=true}}
    </div>
    <div class="form-group">
      <label for="add-jurisdiction__submitter">Your Full Name</label>
      {{input id="add-jurisdiction__submitter-name" class="form-control" value=submitterName placeholder="Enter your full name" required=true}}
    </div>
    <div class="form-group">
      <label for="add-jurisdiction__submitter-email">Your Email</label>
      {{input id="add-jurisdiction__submitter-email" class="form-control" value=session.profile.email placeholder="Enter your email" required=true}}
    </div>
    <div class="form-group">
      <div class="btn btn-link" {{action this.attrs.toggleForm}}>Cancel</div>
      <input type="submit" value="Create" class="btn btn-primary" {{action "onSubmit"}}>
    </div>
  </form>
  `,
})
