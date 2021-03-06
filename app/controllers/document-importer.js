import Ember from "ember"
import config from "../config/environment"
import _ from "npm:lodash"

export default Ember.Controller.extend({
  queryParams: ["jurisdictionId", "standardsDocumentId"],

  _getJurisdictions: function() {
    $.ajax({
      url: config.APP.apiBaseUrl + "jurisdictions",
      method: "GET",
      success: function(data) {
        this.set("jurisdictions", data.data)
      }.bind(this),
    })
  }.on("init"),

  _jurisdiction: Ember.observer("jurisdictionId", function() {
    $.ajax({
      url: config.APP.apiBaseUrl + "jurisdictions/" + this.get("jurisdictionId"),
      method: "GET",
      success: function(data) {
        this.set("jurisdiction", data.data)
      }.bind(this),
    })
  }),

  _fetchStandardsDocument: Ember.observer("standardsDocumentId", function() {
    $.ajax({
      url: config.APP.apiBaseUrl + "standards_document/" + this.get("standardsDocumentId"),
      success: function(data) {
        var queries = _.map(data.standardSetQueries, q => Ember.Object.create(q))
        this.set("standardsDocument", data)
      }.bind(this),
    })
  }),

  _fetchstandardSet: Ember.observer("standardSetQuery", function() {
    var data = {
      query: this.get("standardSetQuery"),
      standardsDocumentId: this.get("standardsDocument.id"),
    }
    if (_.isEmpty(_.keys(data.query))) return
    if (this.isFetching) return
    this.isFetching = true
    $.ajax({
      url: config.APP.apiBaseUrl + "standard_set",
      data: data,
      dataType: "json",
      type: "POST",
      success: function(data) {
        this.isFetching = false
        this.set("standardSet", data)
      }.bind(this),
    })
  }),

  standards: Ember.computed("standardSet", function() {
    var standardsHash = this.get("standardSet.standards")
    if (Ember.isNone(standardsHash)) return []
    var rootStandard = _.find(standardsHash, (value, key) => value.firstStandard === true)

    function fetchNext(acc, standards, standardId) {
      acc.push(standards[standardId])
      if (acc.length < _.keys(standards).length) fetchNext(acc, standards, standards[standardId].nextStandard)
      return acc
    }

    console.log(standardsHash, rootStandard)

    return fetchNext([], standardsHash, rootStandard.id)
  }),

  actions: {
    viewJurisdiction(id) {
      this.set("jurisdictionId", id)
    },
    viewStandardsDocument(id) {
      this.set("standardsDocumentId", id)
    },
    viewstandardSet(query) {
      this.set("standardSetQuery", query)
    },
    importStandards(query) {
      var data = {
        query: query,
        standardsDocumentId: this.get("standardsDocument.id"),
      }
      $.ajax({
        url: config.APP.apiBaseUrl + "standard_set_import/",
        data: data,
        dataType: "json",
        method: "POST",
        success: function(data) {
          window.alert("Success!")
        }.bind(this),
        error: function(data) {
          window.alert(JSON.stringify(data))
        }.bind(this),
      })
    },
  },
})
