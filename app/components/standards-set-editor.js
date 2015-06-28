import Ember from "ember";
import hbs from 'htmlbars-inline-precompile';
import MultiselectCheckboxesComponent from 'ember-multiselect-checkboxes/components/multiselect-checkboxes';


export default Ember.Component.extend({



  layout: hbs`
    <h2>Standards</h2>
    {{standards-editor standardsHash=standardsSet.standards}}

    <h2>Description</h2>
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
          {{education-level-checkboxes value=standardsSet.educationLevels}}
        </div>
      </div>
    </div>

  `

})
