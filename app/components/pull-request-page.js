import Ember from 'ember';
import _ from "npm:lodash";
import hbs from 'htmlbars-inline-precompile';
import rpc from "../lib/rpc";
import Fetcher from "../lib/fetcher";

let {get, set} = Ember

export default Ember.Component.extend({

  setupAutoSave: Ember.on('didInsertElement', function(){this.autoSave()}),

  session: Ember.inject.service(),

  stickyCommentOptions: {
    topSpacing: 50
  },

  autoSave(){
    Ember.run.later(this, function(){
      if (Ember.isNone(get(this, 'model.id'))) return;
      if (get(this, 'isAutoSaving') === true) return;
      Ember.set(this, 'isAutoSaving', true)
      rpc["pullRequest:save"](get(this, 'model'), () => {
        Ember.run.later(this, () => Ember.set(this, 'isAutoSaving', false), 500)
        this.autoSave()
      }, () => { set(this, 'isAutoSaving', false)})
    }, 10000)
  },

  reversedActivities: Ember.computed('model.activities.@each', function(){
    return _(get(this, 'model.activities') || []).reverse().value()
  }),

  nullEducationLevels: Ember.computed('model.standardSet.educationLevels.@each', function(){
    return Ember.isNone(Ember.get(this, 'model.standardSet.educationLevels'))
  }),

  jurisdictions: Ember.computed(function(){
    var ObjectPromiseProxy = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin);
    return ObjectPromiseProxy.create({
      promise: Fetcher.find('jurisdiction', 'index')
    })
  }),

  jurisdiction: Ember.computed('model.standardSet.jurisdiction.id', function(){
    var ObjectPromiseProxy = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin);
    return ObjectPromiseProxy.create({
      promise: Fetcher.find('jurisdiction', get(this, 'model.standardSet.jurisdiction.id'))
    })
  }),

  subjects: Ember.computed('jurisdiction.standardSets.@each.subject', 'model.standardSet.subject', function(){
    let jurisdictionSubjects = _.unique(_.map(get(this, 'jurisdiction.standardSets'), function(set){
      return get(set, 'subject')
    })).sort()
    if (!_.includes(jurisdictionSubjects, get(this, 'model.standardSet.subject'))){
      jurisdictionSubjects.push(get(this, 'model.standardSet.subject'))
    }
    return jurisdictionSubjects.sort()
  }),

  actions: {
    save(){
      if (get(this, 'isAutoSaving') === true) return;
      set(this, 'isAutoSaving', true)
      rpc["pullRequest:save"](get(this, 'model'), function(){
        Ember.run.later(this, function(){
          set(this, 'isAutoSaving', false)
          set(this, 'isSavingError', null)
        }, 750)
      }.bind(this), function(err){
        set(this, 'isSavingError', "We hit an error! Email us at support@commoncurriculum.com if this happens again. Error Code:" + err.statusText)
        set(this, 'isAutoSaving', false)
      }.bind(this))
    },
    submitComment(){
      let comment = get(this, 'commentValue')
      set (this, 'commentIsSaving', true)
      rpc["pullRequest:addComment"](get(this, 'model.id'), comment, function(data){
        set(this, 'commentValue', '')
        set(this, 'commentIsSaving', false)
        set(this, 'model.activities', data.data.activities)
      }.bind(this))
    },

    submit(){
      set(this, 'isSaving', true)
      rpc["pullRequest:save"](get(this, 'model'), function(){
        rpc["pullRequest:submit"](get(this, 'model.id'), function(data){
          set(this, 'isSaving', false)
          set(this, 'model', data.data)
        }.bind(this), function(err){
          set(this, 'savingError', err)
        }.bind(this))
      }.bind(this))
    },

    revise(){
      set(this, 'isSaving', true)
      rpc["pullRequest:save"](get(this, 'model'), function(){
        rpc["pullRequest:changeStatus"](get(this, 'model.id'), "revise-and-resubmit", get(this, 'statusComment'), function(data){
          set(this, 'isSaving', false)
          set(this, 'statusComment', "")
          set(this, 'model', data.data)
        }.bind(this), function(err){
          set(this, 'savingError', err)
        }.bind(this))
      }.bind(this))
    },

    reject(){
      set(this, 'isSaving', true)
      rpc["pullRequest:save"](get(this, 'model'), function(){
        rpc["pullRequest:changeStatus"](get(this, 'model.id'), "rejected", get(this, 'statusComment'), function(data){
          set(this, 'isSaving', false)
          set(this, 'statusComment', "")
          set(this, 'model', data.data)
        }.bind(this), function(err){
          set(this, 'savingError', err)
        }.bind(this))
      }.bind(this))
    },

    approve(){
      set(this, 'isSaving', true)
      rpc["pullRequest:save"](get(this, 'model'), function(){
        rpc["pullRequest:changeStatus"](get(this, 'model.id'), "approved", get(this, 'statusComment'), function(data){
          set(this, 'isSaving', false)
          set(this, 'statusComment', "")
          set(this, 'model', data.data)
        }.bind(this), function(err){
          set(this, 'savingError', err)
        }.bind(this))
      }.bind(this))
    },

    selectJurisdiction(id, title){
      set(this, 'model.standardSet.jurisdiction.id', id)
      set(this, 'model.standardSet.jurisdiction.title', title)
    },

    selectSubject(value){
      if (value === "__CUSTOM__") {
        value = window.prompt("Enter your subject")
      }
      set(this, 'model.standardSet.subject', value)
    }
  },

  layout: hbs`
    {{partial "navbar"}}

    <div class="container">
      <div class="row" style="margin-top: 100px;">
        {{#if model.standardSet.jurisdiction.id}}
          <div class="col-sm-12">
            <div class="standard-set-editor-draft-box">
              {{#if isSavingError}}
                <pre>{{isSavingError}}</pre>
                <br>
              {{/if}}
              {{#if isSaving}}
                <div class="loading-ripple loading-ripple-md">{{partial "icons/ripple"}}</div>
              {{else}}
                <div class="row">
                  <div class="col-sm-6">
                    <h2 class="standard-set-editor-subhead">Status</h2>
                    <div class="standard-set-editor-draft-box__statuses">
                      <div class="standard-set-editor-draft-box__status {{if (eq model.status 'draft') 'is-active'}}">Draft</div>
                      <div class="standard-set-editor-draft-box__status {{if (eq model.status 'approval-requested') 'is-active'}}">Approval Requested</div>
                      {{#if (eq model.status "revise-and-resubmit")}}
                        <div class="standard-set-editor-draft-box__status {{if (eq model.status 'revise-and-resubmit') 'is-active'}}">Revise and resubmit</div>
                      {{/if}}
                      <div class="standard-set-editor-draft-box__status {{if (eq model.status 'approved') 'is-active'}}">Standards Approved</div>
                      {{#if (eq model.status "rejected")}}
                        <div class="standard-set-editor-draft-box__status {{if (eq model.status 'rejected') 'is-active'}}">Rejected</div>
                      {{/if}}
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="standard-set-editor-draft-box__buttons">
                      <div class="btn-group">
                        <div class="standard-set-editor-draft-box__button btn-lg btn btn-default" {{action "save"}}>
                          <span class="loading-ripple loading-ripple--sliding {{if isAutoSaving 'is-visible'}}">{{partial "icons/ripple"}}</span>
                          Save
                        </div>
                        {{#if (eq model.status "draft")}}
                          <div class="standard-set-editor-draft-box__button btn-lg btn btn-default" {{action "submit"}}>Submit</div>
                        {{/if}}
                        {{#if (eq model.status "revise-and-resubmit")}}
                          <div class="standard-set-editor-draft-box__button btn-lg btn btn-default" {{action "submit"}}>Resubmit</div>
                        {{/if}}
                        {{#if session.isCommitter}}
                          {{#if (eq model.status "approval-requested")}}
                            <div class="standard-set-editor-draft-box__button btn-lg btn btn-default" {{action "revise"}}>Request Revision</div>
                          {{/if}}
                          {{#unless (eq model.status "approved")}}
                            <div class="standard-set-editor-draft-box__button btn-lg btn btn-default" {{action "reject"}}>Reject</div>
                            <div class="standard-set-editor-draft-box__button btn-lg btn btn-default" {{action "approve"}}>Approve</div>
                          {{/unless}}
                        {{/if}}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-12">
                    {{#if session.isCommitter}}
                      <br>
                      {{textarea class="form-control" rows="3" value=statusComment placeholder="Comment to attach to the status change"}}
                    {{/if}}
                    {{#if model.statusComment}}
                      <div class="standard-set-editor-draft-box__status-comment">{{htmlize model.statusComment}}</div>
                    {{/if}}
                  </div>
                </div>
              {{/if}}
            </div>

            <h2 class="standard-set-editor-subhead">Directions</h2>
            <p class="standard-set-editor-directions">
              First, thanks so much for helping improve the standards.
              We (and all the teachers that use these standards) appreciate it.
              Second, if you have any questions, scroll to the bottom and add a comment.
              We'll respond within the week (or sooner!).
              Third, when you're done, click "Submit" up top. We'll get an email and then take a look at the standards.
              If they look good, we'll accept them. If there's anything that looks a miss or could be improved,
              we'll send you an email and you'll get a chance to revise them as much as necessary.
            </p>

            <h2 class="standard-set-editor-subhead">Description</h2>
            <div class="form-horizontal">
              <div class="form-group">
                <label class="control-label col-sm-2">Jurisdiction</label>
                <div class="col-sm-10">
                  {{input value=model.standardSet.jurisdiction.title type="text" class="form-control" placeholder="Oregon" disabled=true}}
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
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label class="control-label col-sm-2">Title</label>
                <div class="col-sm-10">
                  {{input value=model.standardSet.title type="text" class="form-control" placeholder="For instance, 'First Grade' or 'Algebra I'"}}
                </div>
              </div>
              <div class="form-group">
                <label class="control-label col-sm-2">Source URL</label>
                <div class="col-sm-10">
                  {{input value=model.standardSet.document.sourceURL type="url" class="form-control" placeholder="If you're copying and pasting the standards from anywhere (like your State's Department of Education), enter that URL here"}}
                </div>
              </div>
              <div class="form-group">
                <label class="control-label col-sm-2">Education Levels</label>
                <div class="col-sm-10">
                  {{#unless nullEducationLevels}}
                    {{education-level-checkboxes value=model.standardSet.educationLevels}}
                  {{/unless}}
                </div>
              </div>
            </div>

            <h2 class="standard-set-editor-subhead">Standards</h2>
            {{standards-sorter-editor standardsHash=model.standardSet.standards}}


            <h2 class="standard-set-editor-subhead">Comments & Questions</h2>
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
          </div>
        {{else}}
          {{jurisdiction-lists
            jurisdictions=jurisdictions
            newOrganization=newOrganization
            selectJurisdiction=(action 'selectJurisdiction') }}
        {{/if}}
      </div>
    </div>
  `

})
