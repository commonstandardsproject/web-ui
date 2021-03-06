import Ember from "ember"
import config from "../../config/environment"
import hbs from "htmlbars-inline-precompile"

export default Ember.Component.extend({
  actions: {
    viewJurisdiction(id = {}) {
      this.sendAction("viewJurisdiction", id.id)
    },

    viewStandardsDocument(id) {
      this.sendAction("viewStandardsDocument", id)
    },

    viewstandardSet(query) {
      this.sendAction("viewstandardSet", query)
    },

    importStandards(query) {
      this.sendAction("importStandards", query)
    },
  },

  layout: hbs`
  <div class="grid">
    <div class="grid__column grid__column--jurisdiction">
      <div class="grid__column__scroller">
        {{ember-selectize
          content=jurisdictions
          optionValuePath="id"
          optionLabelPath="title"
          placeholder=jurisdiction.title
          select-item="viewJurisdiction"
          multiple=false
          id="jurisdiction-select"
        }}
        {{#if jurisdiction}}
        <ul class="selectable-list">
          {{#each jurisdiction.documents as |document|}}
            {{#link-to (query-params standardsDocumentId=document.id) tagName="li" class="selectable-list__item"}}
            {{document.title}}
            {{/link-to}}
          {{/each}}
        </ul>
        {{/if}}
      </div>
    </div>
    {{#if standardsDocument}}
    <div class="grid__column grid__column--standards-document">
      <div class="grid__column__scroller">
        <div class="form-rows">
          <div class="form-rows__row">
            <label>ID</label>
            <div class="form-rows__row__values">
              {{standardsDocument.id}}
            </div>
          </div>
          <div class="form-rows__row">
            <label>Title</label>
            <div class="form-rows__row__values">
              {{standardsDocument.document.title}}
            </div>
          </div>
          <div class="form-rows__row">
            <label>Subject</label>
            <div class="form-rows__row__values">
              {{standardsDocument.document.subject}}
            </div>
          </div>
          <div class="form-rows__row">
            <label>Source</label>
            <div class="form-rows__row__values">
              <a href={{standardsDocument.document.source}} target="_blank" class="form-rows__row__url">{{standardsDocument.document.source}}</a>
            </div>
          </div>
          <div class="form-rows__row">
            <label>ASN Link</label>
            <div class="form-rows__row__values">
              <a href={{standardsDocument.documentMeta.attributionURL}} target="_blank" class="form-rows__row__url">{{standardsDocument.documentMeta.attributionURL}}</a>
            </div>
          </div>
          <div class="form-rows__row">
            <label>Standard Set Queries</label>
            <div class="form-rows__row__values">
              <ul class="label-list">
                {{#each standardsDocument.standardSetQueries as |query|}}
                  <li class="label-list__item" {{action "viewstandardSet" query}}>
                    {{{query.title}}}
                  </li>
                {{/each}}
              </ul>
            </div>
          </div>
          {{#if standardSetQuery}}
          <div class="form-rows__row">
            {{json-pretty obj=standardSetQuery}}
          </div>
          {{/if}}
        </div>
      </div>
    </div>
    {{/if}}

    <div class="grid__column grid__column--standard-set">
      <div class="grid__column__scroller">
        {{#if standards}}
          <h4>
            <button class="button button-primary u-pull-right" {{action "importStandards" standardSetQuery}}>Import</button>
            {{standardSet.title}}
          </h4>
          <div class="importable-standards">
          {{#each standards as |standard|}}
            <importable-standard standard={{standard}} class="standard depth-{{standard.depth}}"/>
          {{/each}}
          </div>
        {{/if}}
      </div>
    </div>
  </div>
  `,
})
