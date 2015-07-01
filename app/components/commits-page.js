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
      rpc["commit:approve"](commit.id, function(){
        Ember.set(commit, 'approved', true)
        Fetcher.find('commit', 'index', true)
      })
    }
  },

  layout: hbs`
    <h1>Commits</h1>
    <div class="commit-list">
    {{#each commits.list as |commit|}}
      <div class="commit-list__item">
        <table class="table">
          <tbody>
            <tr>
              <td>ID</td><td>{{commit.id}}</td>
            </tr><tr>
              <td>Created On</td><td>{{commit.createdOn}}</td>
            </tr><tr>
              <td>Jurisdiction</td><td>{{commit.jurisdictionTitle}}</td>
            </tr><tr>
              <td>Standards Set</td><td>{{commit.standardsSetTitle}}</td>
            </tr><tr>
              <td>Submitted By:</td><td>{{commit.committerName}}</td>
            </tr><tr>
              <td>Submitted By Email:</td><td>{{commit.committerEmail}}</td>
            </tr><tr>
              <td>Summary</td><td>{{commit.commitSummary}}</td>
            </tr><tr>
              <td>Diff</td><td>{{json-pretty obj=commit.diff}}</td>
            </tr><tr>
              <td>Actions</td>
              <td>
                <div class="btn btn-default" {{action "approveCommit" commit}}>Approve</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    {{/each}}
    </div>

  `

})
