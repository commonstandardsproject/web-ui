import Ember from "ember"
import hbs from "htmlbars-inline-precompile"

export default Ember.Component.extend({
  actions: {
    submit() {
      analytics.track("Editor - Submit Commit")
      if (
        Ember.isEmpty(Ember.get(this, "summary")) ||
        Ember.isEmpty(Ember.get(this, "session.profile.email")) ||
        Ember.isEmpty(Ember.get(this, "session.profile.name"))
      ) {
        this.set("error", "All fields must be filled in.")
        return
      } else {
        this.set("error", false)
      }
      this.attrs.onFormSubmit({
        committerName: Ember.get(this, "session.profile.name"),
        committerEmail: Ember.get(this, "session.profile.email"),
        commitSummary: Ember.get(this, "summary"),
      })
    },
  },

  summary: "",

  classNames: ["standard-set-commit-maker"],
  layout: hbs`

    {{#if diffError}}
      <div class="alert alert-danger">{{diffError}}</div>
    {{/if}}

    {{#if error}}
      <div class="alert alert-danger">{{error}}</div>
    {{/if}}

    {{#if commitError}}
      <div class="alert alert-danger">{{commitError}}</div>
    {{/if}}

    {{#if commitSuccess}}
      <div class="alert alert-success">{{commitSuccess}}</div>
    {{/if}}

    <div class="form-group">
      <label>Summary of Changes</label>
      {{textarea value=summary class="form-control"}}
    </div>

    <div class="row">
      <div class="col-xs-6">
        <div class="form-group">
          <label>Your Name</label>
          {{input value=session.profile.name class="form-control"}}
        </div>
      </div>
      <div class="col-xs-6">
        <div class="form-group">
          <label>Your Email</label>
          {{input value=session.profile.email class="form-control"}}
        </div>
      </div>
    </div>

    <div class="form-group">
      <div class="btn btn-primary btn-block form-control" {{action "submit"}}>Submit Change</div>
    </div>
  `,
})
