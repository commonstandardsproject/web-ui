import Ember from 'ember';
import _ from "npm:lodash";
import hbs from 'htmlbars-inline-precompile';
import rpc from "../lib/rpc";

let get = Ember.get

export default Ember.Component.extend({

  // setupAutoSave: Ember.on('didInsertElement', function(){this.autoSave()}),

  autoSave(){
    Ember.run.later(this, function(){
      Ember.set(this, 'isSaving', true)
      rpc["pullRequest:save"](get(this, 'model'), () => {
        Ember.run.later(this, () => Ember.set(this, 'isSaving', false), 1000)
        this.autoSave()
      })
    }, 10000)
  },

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
    }
  },

  layout: hbs`
    {{partial "navbar"}}

    <div class="container">
      <div class="row" style="margin-top: 60px;">

        <div class="col-sm-12">

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


          <h2 class="standard-set-editor-subhead">Status: Draft</h2>
          <p>
            When you're ready to submit this for us to review and approve, click this button!
            {{ladda-button text="Submit" data-style="zoom-in" data-size="s" class="standard-set-editor__request-approval-button" isSpinning=isRequestingApproval action="requestApproval"}}
          </p>

          <h2 class="standard-set-editor-subhead">Comments/Activities</h2>
          {{ladda-button text="Save" data-style="zoom-in" data-size="s" class="standard-set-editor__save-button" isSpinning=isSaving action="save"}}
          Leave a note
          Activity
          {{#each model.activities as |activity|}}
            {{activity.type}}
            {{activity.title}}
          {{/each}}
        </div>

      </div>
    </div>

  `

})
