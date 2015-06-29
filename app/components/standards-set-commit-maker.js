import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

export default Ember.Component.extend({


  classNames: ['standards-set-commit-maker'],
  layout: hbs`

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
          {{input value=session.email class="form-control"}}
        </div>
      </div>
    </div>

    <div class="form-group">
      <div class="btn btn-primary btn-block form-control">Submit Change</div>
    </div>
  `

})
