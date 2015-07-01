import Ember from "ember";
import hbs from 'htmlbars-inline-precompile';
import store from "../lib/store2";
import differ from "../lib/differ";
import rpc from "../lib/rpc";
import Standards from "../models/standards";
import MultiselectCheckboxesComponent from 'ember-multiselect-checkboxes/components/multiselect-checkboxes';
import _ from "npm:lodash";


export default Ember.Component.extend({

  standards: Ember.computed('standardsSet.standards', function(){
    return Standards.hashToArray(this.get('standardsSet.standards'))
  }),

  actions: {
    diff(){
      var diff = differ(
        store.server.find('standardsSet', this.get('standardsSet.id')),
        store.local.find('standardsSet', this.get('standardsSet.id'))
      )
      console.log('diff' , diff)
    },
    onFormSubmit(attrs){
      var diff = differ(
        store.server.find('standardsSet', this.get('standardsSet.id')),
        store.local.find('standardsSet', this.get('standardsSet.id'))
      )
      if (_.keys(diff).length == 0){
        this.set('diffError', "You haven't changed anything yet!")
        return
      } else {
        this.set('diffError', "")
      }
      rpc["commit:make"](attrs, function(data){
        this.set('commitSuccess', "Your change was successful! We'll review it in the next day (or two if we're really busy) and let you know if anything doesn't look right.")
      }.bind(this))
    }
  },

  diffError: "",

  layout: hbs`


    {{#if standardsSet.submissions}}
      <h2 class="standards-set-editor-subhead">Changes waiting to be approved</h2>
      <ul>
      {{#each standardsSet.submissions as |submission|}}
        <li>{{submission.title}}</li>
      {{/each}}
      </ul>
    {{/if}}


    <div class="btn btn-block btn-default" {{action "diff"}}>Diff</div>
    <h2 class="standards-set-editor-subhead">Directions</h2>
    <p>
      First, thanks for helping improve the standards. We (and all the teachers that use these standards) appreciate it. Second, to edit a standard, it's really easy -- just click into the text and make your change. When you're done, scroll down to bottom and click "Submit Change".
    </p>


    <h2 class="standards-set-editor-subhead">Description</h2>
    <div class="form-horizontal">
      <div class="form-group">
        <label class="control-label col-sm-2">Title</label>
        <div class="col-sm-10">
          {{input value=standardsSet.title type="text" class="form-control" placeholder="E.g. First Grade or HS-Algebra"}}
        </div>
      </div>
      <div class="form-group">
        <label class="control-label col-sm-2">Subject</label>
        <div class="col-sm-10">
          {{input class="form-control" value=standardsSet.subject type="text"}}
        </div>
      </div>
      <div class="form-group">
        <label class="control-label col-sm-2">Source URL</label>
        <div class="col-sm-10">
          {{input value=standardsSet.sourceUrl type="url" class="form-control"}}
        </div>
      </div>
      <div class="form-group">
        <label class="control-label col-sm-2">Education Levels</label>
        <div class="col-sm-10">
          {{#if standardsSet.educationLevels}}
            {{education-level-checkboxes value=standardsSet.educationLevels}}
          {{/if}}
        </div>
      </div>
    </div>


    <h2 class="standards-set-editor-subhead">Standards</h2>
    {{standards-editor standardsHash=standardsSet.standards}}


    {{!-- <h2 class="standards-set-editor-subhead">Change the standards</h2> --}}
    {{standards-set-commit-maker
      standardsSet=standardsSet
      onFormSubmit=(action 'onFormSubmit')
      diffError=diffError
      commitSuccess=commitSuccess
    }}


  `

})
