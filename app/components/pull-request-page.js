import Ember from "ember"
import _ from "npm:lodash"
import hbs from "htmlbars-inline-precompile"
import rpc from "../lib/rpc"
import Fetcher from "../lib/fetcher"
import { isEmpty } from "@ember/utils"
import { storageFor } from "ember-local-storage"
import PullRequestValidations from "../validations/pull-request-page"
import lookUpValidator from "ember-changeset-validations"
import Changeset from "ember-changeset"

let { get, set } = Ember

export default Ember.Component.extend({
  PullRequestValidations,
  init() {
    this._super(...arguments)
    this.triedToSubmit = false
    this.lastSavedAt = new Date()
  },

  setupAutoSave: Ember.on("didInsertElement", function() {
    this.autoSave()
    this.autoValidate()
  }),

  session: storageFor("persistedSession"),

  stickyCommentOptions: {
    topSpacing: 50,
  },

  autoSave() {
    Ember.run.later(
      this,
      function() {
        if (this.isDestroyed || this.isDestroying) return
        get(this, "model.status") === "draft" ? set(this, "triedToSubmit", false) : set(this, "triedToSubmit", true)

        if (Ember.isNone(get(this, "model.id"))) return
        if (get(this, "isAutoSaving") === true) return
        this.validateThis()
        Ember.set(this, "isAutoSaving", true)
        rpc["pullRequest:save"](
          get(this, "model"),
          () => {
            set(this, "lastSavedAt", new Date())
            Ember.run.later(this, () => Ember.set(this, "isAutoSaving", false), 500)
            this.autoSave()
          },
          () => {
            alert("Saving wasn't successful.")
            set(this, "isAutoSaving", false)
          }
        )
      },
      10000
    )
  },

  autoValidate() {
    Ember.run.later(
      this,
      function() {
        if (this.isDestroyed || this.isDestroying) return
        get(this, "model.status") === "draft" ? set(this, "triedToSubmit", false) : set(this, "triedToSubmit", true)
        this.validateThis()
      },
      3000
    )
  },

  showEditingInterface: Ember.computed("model.status", "session.isCommitter", function() {
    let isCommitter = get(this, "session.isCommitter")
    let status = get(this, "model.status")
    if (isCommitter === true) {
      return true
    } else {
      if (status === "draft" || status === "revise-and-resubmit") {
        return true
      } else {
        return false
      }
    }
  }),

  reversedActivities: Ember.computed("model.activities.@each", function() {
    return _(get(this, "model.activities") || [])
      .reverse()
      .value()
  }),

  nullEducationLevels: Ember.computed("model.standardSet.educationLevels.@each", function() {
    return Ember.isNone(Ember.get(this, "model.standardSet.educationLevels"))
  }),

  jurisdictions: Ember.computed("model.standardSet.jurisdiction.id", function() {
    var ObjectPromiseProxy = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin)
    return ObjectPromiseProxy.create({
      promise: Fetcher.find("jurisdiction", "index", true),
    })
  }),

  jurisdiction: Ember.computed("model.standardSet.jurisdiction.id", function() {
    var ObjectPromiseProxy = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin)
    return ObjectPromiseProxy.create({
      promise: Fetcher.find("jurisdiction", get(this, "model.standardSet.jurisdiction.id")),
    })
  }),

  subjects: Ember.computed("jurisdiction.standardSets.@each.subject", "model.standardSet.subject", function() {
    let jurisdictionSubjects = _.uniq(
      _.map(get(this, "jurisdiction.standardSets"), function(set) {
        return get(set, "subject")
      })
    ).sort()
    if (!_.includes(jurisdictionSubjects, get(this, "model.standardSet.subject"))) {
      jurisdictionSubjects.push(get(this, "model.standardSet.subject"))
    }
    return jurisdictionSubjects.sort()
  }),
  validateThis() {
    let validationMap = PullRequestValidations
    let changeset = new Changeset(get(this, "model"), lookUpValidator(validationMap), validationMap)
    changeset.validate().then(() => {
      set(this, "errors", changeset.get("errors"))
      let errorArray = get(this, "errors")

      if (Ember.isEmpty(errorArray) === true) {
        set(this, "descriptionIsValid", true)
        set(this, "standardLengthIsValid", true)
        set(this, "standardNotationIsValid", true)
        set(this, "standardIndentationIsValid", true)
      } else {
        let fieldsToDetermineValidate = [
          "submitterName",
          "submitterEmail",
          "standardset.educationLevels",
          "standardSet.document.sourceURL",
          "standardSet.document.title",
          "standardSet.subject",
          "standardSet.title",
          "standardSet.jurisdiction.title",
        ]

        let allErrorKeys = _.map(errorArray, error => error.key)

        let descriptionIsValid = _.size(_.intersection(fieldsToDetermineValidate, allErrorKeys)) === 0
        set(this, "descriptionIsValid", descriptionIsValid)

        let formatValidateFields = ["indentation needed", "notation needed", "not enough standards"]
        let formattingErrors = _.chain(errorArray)
          .map(error => error.validation)
          .flatten()
          .intersectionBy(formatValidateFields)
          .value()

        set(this, "standardIndentationIsValid", !formattingErrors.includes("indentation needed"))

        set(this, "standardNotationIsValid", !formattingErrors.includes("notation needed"))

        set(this, "standardLengthIsValid", !formattingErrors.includes("not enough standards"))
      }
    })
  },

  actions: {
    toggleAddOrganizationForm() {
      this.toggleProperty("showAddOrganizationForm")
    },

    toggleAddSchoolForm() {
      this.toggleProperty("showAddSchoolForm")
    },

    addJurisdiction(data) {
      set(this, "showAddSchoolForm", false)
      set(this, "showAddOrganizationForm", false)
      rpc.addJurisdiction(
        data,
        function(_data) {
          set(this, "model.standardSet.jurisdiction.id", _data.data.id)
          set(this, "model.standardSet.jurisdiction.title", _data.data.title)
        }.bind(this),
        function(err) {
          swal({
            type: "error",
            title: "We've run into an error creating the jurisdiction!",
            text: "Contact support@commoncurriculum.com",
          })
          console.log(err)
        }
      )
    },

    validate() {
      this.validateThis()
    },

    save() {
      if (get(this, "isAutoSaving") === true) return
      set(this, "isAutoSaving", true)
      rpc["pullRequest:save"](
        get(this, "model"),
        function() {
          Ember.run.later(
            this,
            function() {
              set(this, "isAutoSaving", false)
              set(this, "isSavingError", null)
            },
            750
          )
        }.bind(this),
        function(err) {
          set(
            this,
            "isSavingError",
            "We hit an error! Email us at support@commoncurriculum.com if this happens again. Error Code:" +
              err.statusText
          )
          set(this, "isAutoSaving", false)
        }.bind(this)
      )
    },

    submitComment() {
      let comment = get(this, "commentValue")
      set(this, "commentIsSaving", true)
      rpc["pullRequest:addComment"](
        get(this, "model.id"),
        comment,
        function(data) {
          set(this, "commentValue", "")
          set(this, "commentIsSaving", false)
          set(this, "model.activities", data.data.activities)
        }.bind(this)
      )
    },

    submit() {
      set(this, "triedToSubmit", true)
      if (Ember.isBlank(get(this, "model.submitterEmail")) || get(this, "model.submitterEmail") === "") {
        swal("Make sure your email is filled out!")
        return false
      }
      if (Ember.isEmpty(get(this, "errors"))) {
        set(this, "isSaving", true)
        rpc["pullRequest:save"](
          get(this, "model"),
          function() {
            rpc["pullRequest:submit"](
              get(this, "model.id"),
              function(data) {
                set(this, "isSaving", false)
                set(this, "model", data.data)
              }.bind(this),
              function(err) {
                set(this, "savingError", err)
              }.bind(this)
            )
          }.bind(this)
        )
      } else {
        swal(
          "These standards aren't ready for submitting, yet! Make sure all the checkboxes are green and fix any errors."
        )
      }
    },

    revise() {
      set(this, "isSaving", true)
      rpc["pullRequest:save"](
        get(this, "model"),
        function() {
          rpc["pullRequest:changeStatus"](
            get(this, "model.id"),
            "revise-and-resubmit",
            get(this, "statusComment"),
            function(data) {
              set(this, "isSaving", false)
              set(this, "statusComment", "")
              set(this, "model", data.data)
            }.bind(this),
            function(err) {
              set(this, "savingError", err)
            }.bind(this)
          )
        }.bind(this)
      )
    },

    reject() {
      set(this, "isSaving", true)
      rpc["pullRequest:save"](
        get(this, "model"),
        function() {
          rpc["pullRequest:changeStatus"](
            get(this, "model.id"),
            "rejected",
            get(this, "statusComment"),
            function(data) {
              set(this, "isSaving", false)
              set(this, "statusComment", "")
              set(this, "model", data.data)
            }.bind(this),
            function(err) {
              set(this, "savingError", err)
            }.bind(this)
          )
        }.bind(this)
      )
    },

    approve() {
      set(this, "isSaving", true)
      rpc["pullRequest:save"](
        get(this, "model"),
        function() {
          rpc["pullRequest:changeStatus"](
            get(this, "model.id"),
            "approved",
            get(this, "statusComment"),
            function(data) {
              set(this, "isSaving", false)
              set(this, "statusComment", "")
              set(this, "model", data.data)
            }.bind(this),
            function(err) {
              set(this, "savingError", err)
            }.bind(this)
          )
        }.bind(this)
      )
    },

    selectJurisdiction(id, title) {
      set(this, "model.standardSet.jurisdiction.id", id)
      set(this, "model.standardSet.jurisdiction.title", title)
      this.validateThis()
      // Scroll to the top since the size changed
      window.scrollTo(0, 0)
    },

    selectJurisdictionFromDropdown(value) {
      let id = value.split("*")[0]
      let title = value.split("*")[1]
      set(this, "model.standardSet.jurisdiction.id", id)
      set(this, "model.standardSet.jurisdiction.title", title)
      this.validateThis()
    },

    selectSubject(value) {
      if (value === "__CUSTOM__") {
        swal(
          {
            title: "Enter your subject",
            type: "input",
            showCancelButton: true,
            closeOnConfirm: true,
            animation: "slide-from-top",
            inputPlaceholder: "Write something",
          },
          inputValue => {
            if (inputValue === false) return false
            if (inputValue === "") {
              swal.showInputError("You need to write something!")
              return false
            }
            set(this, "model.standardSet.subject", inputValue)
            swal.close()
          }
        )
      } else {
        set(this, "model.standardSet.subject", value)
      }
      this.validateThis()
    },
  },

  layout: hbs`
    {{partial "navbar"}}

    <div class="container">
      {{#if this.showEditingInterface}}
      <div class="row" style="margin-top: 80px;">
        {{#if model.standardSet.jurisdiction.id}}
          {{#unless session.isCommitter}}
            <div class="standard-set-editor-draft-box --directions">
            <h2 class="standard-set-editor__subhead">Directions</h2>
            <p class="standard-set-editor__directions">
              First, thanks so much for helping improve the standards! We (and all the teachers that use these standards) really appreciate it.
            </p>
            <h3 class="standard-set-editor__h3">Your Goal</h3>
            <ul>
              <li class="standard-set-editor__directions-list">The standards you paste here should look like a pretty, outlined list by the time you’re done.</li>
            </ul>

            <h3 class="standard-set-editor__h3">How to do this</h3>
            <ul>
              <li class="standard-set-editor__directions-list">Add a new line: click “Add Standard” or press the “Enter” if you're in a standard.</li>
              <li class="standard-set-editor__directions-list">Indent or outdent: the in/out arrows on the right of each standard (or CTRL + Arrow Key).</li>
              <li class="standard-set-editor__directions-list">Move a standard: the drag icon on the right of each standard.</li>
              <li class="standard-set-editor__directions-list">Delete a standard: the trash can on the right of each standard (or CTRL + Delete).</li>
              <li class="standard-set-editor__directions-list">Need to come back later?  Don't worry - your standards save automatically! When you come back, click "Create/Edit Standards" on the homepage and then "Get Started".</li>
            </ul>

            <h3 class="standard-set-editor__h3">When you’re done</h3>
            <ul>
              <li class="standard-set-editor__directions-list">Click "Submit". We’ll take action on your submission within a week (or sooner!).</li>
              <li class="standard-set-editor__directions-list">We’ll either approve your standards or send it back to you with a few comments for revision.</li>
              <li class="standard-set-editor__directions-list">If you have any questions, add a comment to your submission below the standards portion.</li>
            </ul>
          </div>
          {{/unless}}

          <div class="verification-container">
            <div class="col-sm-9">

                <h2 class="standard-set-editor__subhead">Description</h2>
                <div class="form-horizontal">
                  <div class="form-group">
                    <label class="control-label col-sm-2">Your Name</label>
                    <div class="col-sm-10">
                      {{input value=model.submitterName type="text" class="form-control" placeholder="Name" focusOut=(action "validate")}}
                      {{#if triedToSubmit}}
                        {{validate-pull-request errors=errors propertyName="submitterName"}}
                      {{/if}}

                    </div>
                  </div>
                  <div class="form-group">
                    <label class="control-label col-sm-2">Your Email</label>
                    <div class="col-sm-10">
                      {{input value=model.submitterEmail type="text" class="form-control" placeholder="Email" type="email" focusOut=(action "validate")}}
                      {{#if triedToSubmit}}
                        {{validate-pull-request errors=errors propertyName="submitterEmail"}}
                      {{/if}}
                    </div>
                  </div>
                  {{#if model.forkedFromStandardSetId}}
                    <div class="form-group">
                      <label class="control-label col-sm-2">Modified From</label>
                      <div class="col-sm-10">
                        <a target="_blank" href='http://commonstandardsproject.com/search?ids=%5B"{{model.forkedFromStandardSetId}}"%5D'>http://commonstandardsproject.com/search?ids=%5B"{{model.forkedFromStandardSetId}}"%5D</a>
                      </div>
                    </div>
                  {{/if}}
                  <div class="form-group">
                    <label class="control-label col-sm-2">Organization</label>
                    <div class="col-sm-10">
                      {{#if session.isCommitter}}
                        <div class="admin-form-group">

                        <select class="form-control" oninput={{action "selectJurisdictionFromDropdown" value="target.value"}}>
                          <option selected>State, Organization, or School</option>
                          {{#each jurisdictions.content.list as |jurisdiction|}}
                            <option value="{{jurisdiction.id}}*{{jurisdiction.title}}" selected={{eq jurisdiction.id model.standardSet.jurisdiction.id}}>{{jurisdiction.title}}</option>
                          {{/each}}
                        </select>
                        {{#if showAddOrganizationForm}}
                          {{add-jurisdiction showFormInFloatingBox=true type="organization" humanizedType="Organization" toggleForm=(action 'toggleAddOrganizationForm') onSubmit=(action 'addJurisdiction')}}
                        {{else}}
                          <div class="standard-set-editor-draft-box__button btn admin-btn" {{action "toggleAddOrganizationForm"}}>
                            + ORGANIZATION
                          </div>
                        {{/if}}
                        {{#if showAddSchoolForm}}
                          {{add-jurisdiction showFormInFloatingBox=true type="school" humanizedType="School" toggleForm=(action 'toggleAddSchoolForm') onSubmit=(action 'addJurisdiction')}}
                        {{else}}
                          <div class="standard-set-editor-draft-box__button btn admin-btn" {{action "toggleAddSchoolForm"}}>
                            + SCHOOL/DISTRICT
                          </div>
                        {{/if}}
                      </div>
                      {{else}}
                        {{input value=model.standardSet.jurisdiction.title type="text" class="form-control" placeholder="Oregon" disabled=true focusOut=(action "validate")}}
                      {{/if}}
                    </div>
                    <div class="ed-levels">
                      {{#if triedToSubmit}}
                        {{validate-pull-request errors=errors propertyName="standardSet.jurisdiction.title"}}
                      {{/if}}
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="control-label col-sm-2">Subject</label>
                    <div class="col-sm-10">
                      <select class="form-control" oninput={{action "selectSubject" value="target.value"}}>
                        <option value="__CUSTOM__" selected="false">Let me enter my own...</option>
                        {{#each subjects as |subject|}}
                          <option value="{{subject}}" selected="{{if (eq subject model.standardSet.subject) 'true'}}">{{subject}}</option>
                        {{/each}}
                        {{#if triedToSubmit}}
                          {{validate-pull-request errors=errors propertyName="standardSet.standards.subject"}}
                        {{/if}}

                      </select>
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="control-label col-sm-2">Grade or Course Name</label>
                    <div class="col-sm-10">
                      {{input value=model.standardSet.title type="text" class="form-control" placeholder="The grade level or name of the course. E.g. 'First Grade', 'Algebra I', 'Advanced Band', 'Middle School', or 'AP'" focusOut=(action "validate")}}
                      {{#if triedToSubmit}}
                        {{validate-pull-request errors=errors propertyName="standardSet.title"}}
                      {{/if}}
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="control-label col-sm-2">Source Title</label>
                    <div class="col-sm-10">
                      {{input value=model.standardSet.document.title type="url" class="form-control" placeholder="The name of the publication you got these from. E.g. 'South Dakota Content Standards'" focusOut=(action "validate")}}
                      {{#if triedToSubmit}}
                        {{validate-pull-request errors=errors propertyName="standardSet.document.title"}}
                      {{/if}}
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="control-label col-sm-2">Source URL</label>
                    <div class="col-sm-10">
                      {{input value=model.standardSet.document.sourceURL type="url" class="form-control" placeholder="If you're copying and pasting the standards from anywhere (like your State's Department of Education), enter that URL here"focusOut=(action "validate")}}
                      {{#if triedToSubmit}}
                        {{validate-pull-request errors=errors propertyName="standardSet.document.sourceURL"}}
                      {{/if}}
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="control-label col-sm-2">Education Levels</label>
                    <div class="col-sm-10">
                      {{#unless nullEducationLevels}}
                        {{education-level-checkboxes value=model.standardSet.educationLevels mouseLeave=(action "validate")}}
                      {{/unless}}
                    </div>
                    {{#if triedToSubmit}}
                      <div class="col-sm-10 ed-levels">
                        {{validate-pull-request errors=errors propertyName="standardSet.educationLevels"}}
                      </div>
                    {{/if}}
                  </div>
                </div>
              </div>
            <div class="standard-set-editor-draft-box">
              {{#if isSavingError}}
                <pre>{{isSavingError}}</pre>
                <br>
              {{/if}}
              {{#if isSaving}}
                <div class="loading-ripple loading-ripple-md">{{partial "icons/ripple"}}</div>
              {{else}}
                <div class="row">
                  <div>
                    <h2 class="standard-set-editor__subhead">Status</h2>
                    <p>Last saved {{moment-from-now this.lastSavedAt}}.</p>
                    {{!-- <a href="">Save</a> --}}
                    <div class="standard-set-editor-draft-box__statuses">
                      <div class="standard-set-editor-draft-box__status {{if (eq model.status 'draft') 'is-active'}}">Draft</div>
                      <div class="standard-set-editor-draft-box__status {{if (eq model.status 'approval-requested') 'is-active'}}">Approval Requested</div>
                      {{#if triedToSubmit}}
                        <div class="standard-set-editor-draft-box__status {{if (eq model.status 'revise-and-resubmit') 'is-active'}}">Revise and resubmit</div>
                      {{/if}}
                      <div class="standard-set-editor-draft-box__status {{if (eq model.status 'approved') 'is-active'}}">Standards Approved</div>
                      {{#if (eq model.status "rejected")}}


                        <div class="standard-set-editor-draft-box__status {{if (eq model.status 'rejected') 'is-active'}}">Rejected</div>
                      {{/if}}
                    </div>

                    </div>

                    {{#unless session.isCommitter}}
                    <div>
                      <ul><h3 class="standard-set-editor__list-heading">Did you remember to:</h3>
                        <li class="standard-set-editor-draft-box__checklist {{if this.descriptionIsValid 'is-valid'}}">
                          <span class="checkmark">{{partial "icons/ios-checkmark-circle-outline"}}</span>
                          Fill in all description fields in the form on the left
                        </li>
                        <li class="standard-set-editor-draft-box__checklist check-reason">This helps us validate the source and content of the standards.</li>
                        <li class="standard-set-editor-draft-box__checklist {{if this.standardLengthIsValid 'is-valid'}}">
                          <span class="checkmark">{{partial "icons/ios-checkmark-circle-outline"}}</span>
                          Add at least 5 standards
                        </li>
                        <li class="standard-set-editor-draft-box__checklist check-reason">If you have fewer than 5 total standards, they will not be approved.</li>
                        <li class="standard-set-editor-draft-box__checklist {{if this.standardIndentationIsValid 'is-valid'}}">
                          <span class="checkmark">{{partial "icons/ios-checkmark-circle-outline"}}</span>
                          Indent at least 4 substandards
                        </li>
                        <li class="standard-set-editor-draft-box__checklist check-reason">Please visually group your standards.</li>
                        <li class="standard-set-editor-draft-box__checklist {{if this.standardNotationIsValid 'is-valid'}}">
                          <span class="checkmark">{{partial "icons/ios-checkmark-circle-outline"}}</span>
                          Add an abbreviation on the right of each line
                        </li>
                        <li class="standard-set-editor-draft-box__checklist check-reason">This is how you'll search for your standards in CSP once they are accepted.</li>
                      </ul>
                    </div>
                  {{/unless}}
                  <div>
                    <div class="row">
                      <div class="col-sm-12">
                        {{#if model.statusComment}}
                          <div class="standard-set-editor-draft-box__status-comment">{{htmlize model.statusComment}}</div>
                        {{/if}}
                        {{#if session.isCommitter}}
                          <br>
                          {{textarea class="form-control" rows="3" value=statusComment placeholder="Comment to attach to the status change"}}
                        {{/if}}
                      </div>
                    </div>
                    <div class="standard-set-editor-draft-box__buttons">
                        {{#if (eq model.status "draft")}}
                          <div class="standard-set-editor-draft-box__button btn approval-btn {{if session.isCommitter false "non-committer"}}" {{action "submit"}}>Submit</div>
                        {{/if}}
                        {{#if (eq model.status "revise-and-resubmit")}}
                          <div class="standard-set-editor-draft-box__button btn approval-btn {{if session.isCommitter false "non-committer"}}" {{action "submit"}}>Resubmit</div>
                        {{/if}}
                        {{#if session.isCommitter}}
                          {{#if (eq model.status "approval-requested")}}
                            <div class="standard-set-editor-draft-box__button btn approval-btn" {{action "revise"}}>Request Revision</div>
                          {{/if}}
                          {{#unless (eq model.status "approved")}}
                            <div class="standard-set-editor-draft-box__button btn approval-btn" {{action "reject"}}>Reject</div>
                            <div class="standard-set-editor-draft-box__button btn approval-btn" {{action "approve"}}>Approve</div>
                          {{/unless}}
                        {{/if}}
                    </div>

                  </div>
                </div>

              {{/if}}
            </div>
        </div>


            <h2 class="standard-set-editor__subhead">Standards</h2>
            {{standards-sorter-editor standardsHash=model.standardSet.standards validate=(action "validate") isCommitter=session.isCommitter }}

            <h2 class="standard-set-editor__subhead">Comments & Questions</h2>
            {{#if commentIsSaving}}
              <div class="loading-ripple loading-ripple-md">{{partial "icons/ripple"}}</div>
            {{else}}
              {{textarea class="form-control" rows="3" value=commentValue placeholder="If you have a comment or questions for us, just let write it here and we'll respond!"}}
              <br>
              <div class="btn btn-block btn-default" {{action "submitComment"}}>Comment</div>
            {{/if}}

            <div class="standard-set-editor-activies">
              {{#each reversedActivities as |activity|}}
                <div class="standard-set-editor-activity">
                  <div class="standard-set-editor-activity__icon">
                    {{#if (eq activity.type "created")}}
                      {{partial "icons/ios7-lightbulb"}}
                    {{/if}}
                    {{#if (eq activity.type "forked")}}
                      {{partial "icons/ios7-lightbulb"}}
                    {{/if}}
                    {{#if (eq activity.type "comment")}}
                      {{partial "icons/ios7-chatboxes-outline"}}
                    {{/if}}
                    {{#if (eq activity.type "status-change")}}
                      {{partial "icons/ios7-flowers-outline"}}
                    {{/if}}
                  </div>
                  <div class="standard-set-editor-activity__content">
                    <div class="standard-set-editor-activity__timestamp">{{moment-format activity.createdAt "MMMM Do, YYYY"}}</div>
                    <div class="standard-set-editor-activity__title">
                      {{#if (eq activity.type "comment")}}
                        <div class="standard-set-editor-activity__comment-user">{{activity.userName}}</div>
                      {{/if}}
                      {{#if (eq activity.type "status-change")}}
                        <div class="standard-set-editor-activity__comment-user">{{activity.status}}</div>
                      {{/if}}
                      {{htmlize activity.title}}
                    </div>
                  </div>
                </div>
              {{/each}}
            </div>
        {{else}}
          {{jurisdiction-lists
            jurisdictions=jurisdictions
            newOrganization=newOrganization
            selectJurisdiction=(action 'selectJurisdiction') }}
        {{/if}}
      </div>
    {{/if}}
    {{#if (eq this.showEditingInterface false)}}
      {{#if (eq model.status "approved")}}
        <div class="approved-standards">
          <h3>Your standards have been approved!</h3>
          <div>
            {{#link-to 'edit' class='approved-standards-btn'}}
              <div class="standard-set-editor-draft-box__button btn">Submit another set of standards</div>
            {{/link-to}}
            {{#link-to 'search' class='approved-standards-btn'}}
              <div class="standard-set-editor-draft-box__button btn">Search Standards</div>
            {{/link-to}}
          </div>
        </div>
      {{/if}}
      {{#if (eq model.status "approval-requested")}}
        <div class="approved-standards">
          <h3>Your standards have been submitted!</h3>
          <p>We'll take a look and get back to you in the next week (if not sooner).</p>
          <div>
            {{#link-to 'edit'}}
              <div class="standard-set-editor-draft-box__button btn">Submit another set of standards</div>
            {{/link-to}}
            {{#link-to 'search'}}
              <div class="standard-set-editor-draft-box__button btn">Search Standards</div>
            {{/link-to}}
          </div>
        </div>
      {{/if}}
      {{#if (eq model.status "rejected")}}
        <div class="approved-standards">
          <h3>We're sorry, your standards were not accepted.</h3>
          <p>If you think this is a mistake, please email us at <a href="mailto:support@commoncurriculum.com">support@commoncurriculum.com.</a></p>
          <div>
            {{#link-to 'edit'}}
              <div class="standard-set-editor-draft-box__button btn">Submit another set of standards</div>
            {{/link-to}}
            {{#link-to 'search'}}
              <div class="standard-set-editor-draft-box__button btn">Search Standards</div>
            {{/link-to}}
          </div>
        </div>
      {{/if}}
    {{/if}}
</div>
  `,
})
