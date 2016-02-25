import Ember from 'ember';
import _ from "npm:lodash";
import hbs from 'htmlbars-inline-precompile';
import rpc from "../lib/rpc";

let get = Ember.get

export default Ember.Component.extend({

  // TODO
  // - create Jurisdiction
  // - save every 10 seconds?

  nullEducationLevels: Ember.computed('model.standardSet.educationLevels.@each', function(){
    return Ember.isNone(Ember.get(this, 'model.standardSet.educationLevels'))
  }),

  actions: {
    save(){
      console.log('model', get(this, 'model.standardSet.educationLevels'))
      rpc["pullRequest:save"](get(this, 'model'), function(){

      })
    }
  },

  layout: hbs`
    {{partial "navbar"}}

    <div class="row" style="margin-top: 120px;">

      <div class="col-sm-9">

        <div class="btn" {{action "save"}}>Save</div>

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
                {{log model.standardSet.educationLevels}}
                {{education-level-checkboxes value=model.standardSet.educationLevels}}
              {{/unless}}
            </div>
          </div>
        </div>


        <h2 class="standard-set-editor-subhead">Standards</h2>
        {{standards-sorter-editor standardsHash=model.standardSet.standards}}
      </div>
      <div class="col-sm-3">
        Leave a note
        Activity
        {{#each model.activity as |activity|}}
          {{activity.type}}
          {{activity.title}}
        {{/each}}
      </div>
    </div>

  `

})
