import Ember from "ember";
import hbs from 'htmlbars-inline-precompile';
import Fetcher from "../lib/fetcher2";
import rpc from "../lib/rpc";

export default Ember.Component.extend({

  commits: Ember.computed(function(){
    return Fetcher.find('commit', 'index')
  }),

  actions: {
    approveCommit(commit){
      console.log('commit.id', commit)
      rpc["commit:approve"](commit.id, function(){
        commit.set('approved', true)
      })
    }
  },

  layout: hbs`
    <h1>Commits</h1>
    <div>
    {{#each commits.list as |commit|}}
      <div>
        {{commit.id}}
        Approved?: {{commmit.approved}}
        {{commit.committerName}}
        {{commit.committerEmail}}
        {{commit.commitSummary}}
        {{json-pretty obj=commit.diff}}
        <div class="btn btn-default" {{action "approveCommit" commit}}>Approve</div>
      </div>
    {{/each}}
    </div>

  `

})
