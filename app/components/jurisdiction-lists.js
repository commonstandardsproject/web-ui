import Ember from "ember"
import hbs from "htmlbars-inline-precompile"
import _ from "npm:lodash"
import rpc from "../lib/rpc"

export default Ember.Component.extend({
  showAddOrganizationForm: false,
  showAddSchoolForm: false,

  stateJurisdictions: Ember.computed("jurisdictions.list", function() {
    return _.filter(this.get("jurisdictions.list"), { type: "state" })
  }),

  orgJurisdictions: Ember.computed("jurisdictions.list", function() {
    return _.filter(this.get("jurisdictions.list"), { type: "organization" })
  }),

  schoolJurisdictions: Ember.computed("jurisdictions.list", function() {
    return _.filter(this.get("jurisdictions.list"), { type: "school" })
  }),

  actions: {
    toggleAddOrganizationForm() {
      this.toggleProperty("showAddOrganizationForm")
    },

    toggleAddSchoolForm() {
      this.toggleProperty("showAddSchoolForm")
    },

    addJurisdiction(data) {
      rpc.addJurisdiction(
        data,
        function(_data) {
          this.attrs.selectJurisdiction(_data.data.id, _data.data.title)
        }.bind(this),
        function(err) {
          swal({
            type: "error",
            title: "Oh no!",
            text: "Go find Scott or Marika",
          })
          console.log(err)
        }
      )
    },
  },

  layout: hbs`
    <div class="jurisdiction-columns">
      <div class="jurisdiction-columns__column">
        <h2 class="jurisdiction-columns__heading">States</h2>
        {{jurisdiction-list
          jurisdictions=stateJurisdictions
          selectJurisdiction=this.attrs.selectJurisdiction
        }}
      </div>
      <div class="jurisdiction-columns__column">
        <h2 class="jurisdiction-columns__heading">Organizations</h2>
        {{jurisdiction-list
          jurisdictions=orgJurisdictions
          selectJurisdiction=this.attrs.selectJurisdiction
        }}
        {{#if showAddOrganizationForm}}
          {{add-jurisdiction type="organization" humanizedType="Organization" toggleForm=(action 'toggleAddOrganizationForm') onSubmit=(action 'addJurisdiction')}}
        {{else}}
          <div class="btn btn-lg btn-primary btn-block" {{action "toggleAddOrganizationForm"}}>
            Add an organization
          </div>
        {{/if}}
      </div>
      <div class="jurisdiction-columns__column">
        <h2 class="jurisdiction-columns__heading">Schools</h2>
        {{jurisdiction-list
          jurisdictions=schoolJurisdictions
          selectJurisdiction=this.attrs.selectJurisdiction
        }}
        {{#if showAddSchoolForm}}
          {{add-jurisdiction type="school" humanizedType="School" toggleForm=(action 'toggleAddSchoolForm') onSubmit=(action 'addJurisdiction')}}
        {{else}}
          <div class="btn btn-lg btn-primary btn-block" {{action "toggleAddSchoolForm"}}>
            Add school/district
          </div>
        {{/if}}
      </div>
    </div>
  `,
})
