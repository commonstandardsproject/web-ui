import Ember from 'ember';
import _ from "npm:lodash";
import hbs from 'htmlbars-inline-precompile';
import rpc from "../lib/rpc";

let {get, set} = Ember

export default Ember.Component.extend({

  // setupAutoSave: Ember.on('didInsertElement', function(){this.autoSave()}),

  session: Ember.inject.service(),

  stickyCommentOptions: {
    topSpacing: 50
  },

  autoSave(){
    Ember.run.later(this, function(){
      Ember.set(this, 'isSaving', true)
      rpc["pullRequest:save"](get(this, 'model'), () => {
        Ember.run.later(this, () => Ember.set(this, 'isSaving', false), 1000)
        this.autoSave()
      })
    }, 10000)
  },

  reversedActivities: Ember.computed('model.activities.@each', function(){
    return _(get(this, 'model.activities') || []).reverse().value()
  }),

  // TODO
  // - create Jurisdiction
  // - save every 10 seconds?

  nullEducationLevels: Ember.computed('model.standardSet.educationLevels.@each', function(){
    return Ember.isNone(Ember.get(this, 'model.standardSet.educationLevels'))
  }),

  actions: {
    save(){
      rpc["pullRequest:save"](get(this, 'model'), function(){

      })
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
      rpc["pullRequest:submit"](get(this, 'model.id'), function(data){
        set(this, 'isSaving', false)
        set(this, 'model', data.data)
      }.bind(this), function(err){
        set(this, 'savingError', err)
      }.bind(this))
    }
  },

  layout: hbs`
    {{partial "navbar"}}

    <div class="container">

      <div class="row" style="margin-top: 60px;">
        <div class="col-sm-12">
          <div class="standard-set-editor-draft-box">
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
                      <div class="standard-set-editor-draft-box__status {{if (eq model.status 'rejected') 'is-active'}}">Revise and resubmit</div>
                    {{/if}}
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="standard-set-editor-draft-box__buttons">
                    <div class="btn-group">
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
                        <div class="standard-set-editor-draft-box__button btn-lg btn btn-default" {{action "reject"}}>Reject</div>
                        <div class="standard-set-editor-draft-box__button btn-lg btn btn-default" {{action "approve"}}>Approve</div>
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
                    <div class="standard-set-editor-draft-box__status-comment">{{model.statusComment}}</div>
                  {{/if}}
                </div>
              </div>
            {{/if}}
          </div>

          <h2 class="standard-set-editor-subhead">Directions</h2>
          <p>
            First, thanks for helping improve the standards. We (and all the teachers that use these standards) appreciate it. Second, to edit a standard, it's really easy -- just click into the text and make your change. When you're done, scroll down to bottom and click "Submit Change".
          </p>

          <h2 class="standard-set-editor-subhead">Description</h2>
          <div class="form-horizontal">
            <div class="form-group">
              <label class="control-label col-sm-2">Jurisdiction</label>
              <div class="col-sm-10">
                {{input value=model.standardSet.jurisdiction.title type="text" class="form-control" placeholder="Oregon"}}
              </div>
            </div>
            <div class="form-group">
              <label class="control-label col-sm-2">Subject</label>
              <div class="col-sm-10">
                {{input class="form-control" value=model.standardSet.subject type="text" placeholder="Math or English or Reading"}}
              </div>
            </div>
            <div class="form-group">
              <label class="control-label col-sm-2">Title</label>
              <div class="col-sm-10">
                {{input value=model.standardSet.title type="text" class="form-control" placeholder="E.g. First Grade or HS-Algebra"}}
              </div>
            </div>
            <div class="form-group">
              <label class="control-label col-sm-2">Source URL</label>
              <div class="col-sm-10">
                {{input value=model.standardSet.sourceUrl type="url" class="form-control" placeholder="e.g. The website where you're copying & pasting the standards from"}}
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
                    {{activity.title}}
                  </div>
                </div>
              </div>
            {{/each}}
          </div>
        </div>
      </div>
    </div>
  `

})
