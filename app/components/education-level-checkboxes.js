import Ember from "ember";
import hbs from 'htmlbars-inline-precompile';
import MultiselectCheckboxesComponent from 'ember-multiselect-checkboxes/components/multiselect-checkboxes';

export default Ember.Component.extend({

  educationLevelOptions: [
    {value: "Pre-K", title: "Pre-K"},
    {value: "K", title: "K"},
    {value: "01", title: "1st"},
    {value: "02", title: "2nd"},
    {value: "03", title: "3rd"},
    {value: "04", title: "4th"},
    {value: "05", title: "5th"},
    {value: "06", title: "6th"},
    {value: "07", title: "7th"},
    {value: "08", title: "8th"},
    {value: "09", title: "9th"},
    {value: "10", title: "10th"},
    {value: "11", title: "11th"},
    {value: "12", title: "12th"},
    {value: "VocationalTraining", title: "Vocational Training"},
    {value: "ProfessionalEducation-Development", title: "Professional Education & Further Development"},
    {value: "HigherEducation", title: "Higher Education"},
    {value: "Undergraduate-UpperDivision", title: "Four Year College"},
    {value: "Undergraduate-LowerDivision", title: "Two Year College"},
    {value: "LifeLongLearning", title: "Life-long Learning"},
  ],

  layout: hbs`
    {{multi-checks options=educationLevelOptions labelProperty="title" valueProperty="value" selection=value}}
  `

})
