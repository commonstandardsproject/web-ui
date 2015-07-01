import Ember from 'ember';
import rpc from "../lib/rpc";
import hbs from 'htmlbars-inline-precompile';

export default Ember.Component.extend({

  authenticate: Ember.inject.service(),
  session: Ember.inject.service(),

  isAuthenticated: Ember.computed.alias('session.isAuthenticated'),

  addHighlighting: Ember.on('didInsertElement', function(){
    $('pre').each(function(i, block) {
      hljs.highlightBlock(block);
    });
  }),

  actions: {
    signIn(){
      this.get('authenticate').showSignin()
    },
    showReset(){
      this.get('authenticate').logout()
    },
    updateOrigins(){
      rpc["user:updateAllowedOrigins"](this.get('session.id'), this.get('session.allowedOrigins'), function(data){
        this.set('originSuccess', true)
        Ember.run.later(this, function(){
          this.set('originSuccess', false)
        }, 2000)
      }.bind(this))
    }
  },

  layout: hbs`
  {{partial "navbar"}}

  <div class="developers-grid">
    <div class="developers-grid__sidebar">
      <div class="sidebar-list">
        <div class="sidebar-list__heading">API Overview</div>
        <a class="sidebar-list__section" href="#why">Why?</a>
        <a class="sidebar-list__section" href="#using">Using the API</a>
        <a class="sidebar-list__section" href="#using">Who is behind this?</a>

        <div class="sidebar-list__heading">Endpoints</div>
        <a class="sidebar-list__section --code" href="#jurisdictions-index">jurisdictions</a>
        <a class="sidebar-list__section --code" href="#jurisdictions-id">jurisdictions/:id</a>
        <a class="sidebar-list__section --code" href="#standard-sets-id">standard-sets/:id</a>

        <div class="sidebar-list__heading">Search</div>
        <a class="sidebar-list__section --code" href="#search">Search API</a>

        {{!-- <div class="sidebar-list__heading">Database dump</div>
        <a class="sidebar-list__section --code" href="#database-dump">Database Dump</a> --}}

      </div>

      {{#if isAuthenticated}}
        <div class="api-info">
          <div class="api-info__welcome">
            Welcome, {{session.profile.name}}!
          </div>
<pre class="api-key js">// API KEY:
{{session.apiKey}}
</pre>
<pre class="api-key js">// Algolia Application Id:
O7L4OQENOZ

// Algolia API Key:
{{session.algoliaApiKey}}</pre>
        </div>
        {{#if originSuccess}}
          <div class="alert alert-success">Origins Updated!</div>
        {{/if}}
        <div class="sidebar-list__heading">Allowed Origins</div>
        {{textarea value=session.allowedOrigins class="form-control"}}
        <br>
        <div class="btn btn-default btn-block" {{action "updateOrigins"}}>Update Origins</div>
        <br>
        <div class="btn btn-default btn-block" {{action 'showReset'}}>Sign Out</div>
      {{else}}
        <div class="btn btn-default api-info__sign-in" {{action 'signIn'}}>Sign In/Up to get started!</div>
      {{/if}}
    </div>
    <div class="developers-grid__main">
      <h1>Welcome, developers!</h1>
      <p>
        Standards are hard and we're here to help. There are 50 states (and even more organizations) who produce standards. If you're like us, your customers will start asking to add their own standards. Creating an infrastructure to screen scrape 50 state websites and then updating them is overwhelming. Companies like ASN and Academic Benchmarks charge and arm and a leg for standards in formats that don't conform to conventional JSON or are organized in bizarre, teacher unfriendly ways. Further, you need to update the standards as the states update them. And, of course, let's not forget search. What's a developer to do?
      </p>
      <p>
        Use the Common Standards Project, of course! Here, you can learn more about use our API and how to integrate instant standards search into your website. Reach out to me at scott (at) commoncurriculum dot com if you need more help!
      </p>

      <h1>API Overview</h1>
      <h2>Why does edtech need a standards API?</h2>
      <p>
        If edtech companies are going to reach their potential to change teaching practices and dramatically improve student outcomes, their products need to interop. Standards are a common denominator across vast swaths of the edtech landscape, yet their exists no
        <ul>
          <li>common data format for standards</li>
          <li>shared set of IDs to uniquely identify each standard</li>
          <li>central database of standards from all 50 states, organizations, and countries</li>
          <li>an ability to publish new standards unique to districts, charter networks or organizations</li>
        </ul>
      </p>
      <p>
        This project aims to solve these barriers to edtech interoperability. Each standard follows a consistent convention, has a unique GUID, and is accessible through this API or through a database dump. New standards can be added through the web interface.
      </p>

      <p>
        This project wouldn't be possible without the work of the Achivement Standards Network (ASN) and it's parent company, Desire2Learn. They convert standards and release them on their website under a Creative Commons attribution license. This project builds on their work by adding GUIDs to each standards, converting the standards into a simple JSON structure, and grouping the standards into sets that teachers are familiar with and the standard writers published them in. For instance, ASN releases standards tagged with grade levels (e.g. 1st - 12th grade). We group those standards into groups such as "Grade 1 Math", "High School -- Algebra", "High School - Functions"
      </p>

      <h2>Using these standards</h2>
      <p>
        Click "Register or Sign In" on the left to get your API key. Currently, there is not a limit placed on API requests. If limits are added in the future, they'll only be enacted to better share costs among the users of the API.
      </p>

      <h2>Who is behind this?</h2>
      <p>
        The Common Standards Project is produced by <a href="http://commoncurriculum.com" target="_blank">Common Curriculum</a>, a collaborative lesson planner transforming how schools develop and align instruction for their students. This API is in production at Common Curriculum.
      </p>

      <h1>Authentication</h1>
      <ul>
        <li>All requests need an <code>api-key</code> query parameter or an <code>Api-Key</code> header. Your api key can be found in the sidebar.</li>
        <li>
          All requests need to originate from one of the allowed origins. You can update origins on the sidebar.
        </li>
      </ul>

      <h1>Endpoints</h1>
      <h2 name="jurisdictions-index">Jurisdictions/</h2>
      <p>
        Find a list of all the jurisdictions and organizations in the database
      </p>
      <h3>Url</h3>
      <pre><code class="nohighlight">
http://commonstandardsproject.com/api/v1/jurisdictions/
      </code></pre>
      <h3>Example Response:</h3>
      <pre class="code-sample"><code class="json">{
  "data": [
    {
      "id": "B838B98D043045748F3814B9E43CAC85",
      "title": "Alabama",
    },
    {
      "id": "0DCD3CBE12314408BDBDB97FAF45EEE8",
      "title": "Alaska",
    },
    {
      "id": "9D65E45961BC46218A6FA75732D733EB",
      "title": "American Association for the Advancement of Science",
    },
    {
      "id": "6B4D002505FC4175967211744D11C325",
      "title": "American Association of School Librarians",
    },
    {
      "id": "63CD52A014074BBCACC64A8954A97539",
      "title": "American Psychological Association",
    }
  ]
}
  </code>
  </pre>

      <h2 name="jurisdictions-id">jurisdictions/:id</h2>
      <p>
        Select a particular jurisdiction
      </p>

      <h3>Url</h3>
      <pre><code class="nohighlight">
http://commonstandardsproject.com/api/v1/jurisdictions/:id
      </code></pre>

      <h3>Example Response:</h3>
      <pre class="code-sample"><code class="json">{
    "data": {
      "id": "B1339AB05F0347E79200FCA63240F3B2",
      "title": "California",
      "documents": [
        {
          "id": "D2538854:2014-05-12T14:12:38-04:00",
          "title": "CTE Model Curriculum Standards: Business and Finance"
        },
        {
          "id": "D2513639:2013-09-10T15:37:01-04:00",
          "title": "California Common Core State Standards: Mathematics"
        },
        {
          "id": "D2515047:2013-09-12T14:13:43-04:00",
          "title": "California Common Core State Standards: English Language Arts and Literacy"
        },
        {
          "id": "D2622356:2015-05-05T19:28:08-04:00",
          "title": "Model School Library Standards for California Public Schools, Kindergarten Through Grade Twelve"
        },
      ],
      "standardSets": [
        {
           "id": "B1339AB05F0347E79200FCA63240F3B2_D2541115_grades-08-09-10-11-12",
           "title": "Grades 8, 9, 10, 11, 12",
           "subject": "Engineering and Architecture"
         },
         {
           "id": "B1339AB05F0347E79200FCA63240F3B2_D2538854_grades-08-09-10-11-12",
           "title": "Grades 8, 9, 10, 11, 12",
           "subject": "Business and Finance"
         },
         {
           "id": "B1339AB05F0347E79200FCA63240F3B2_D2513639_grade-k",
           "title": "Grade K",
           "subject": "Mathematics"
         },
         {
           "id": "B1339AB05F0347E79200FCA63240F3B2_D2513639_grade-01",
           "title": "Grade 1",
           "subject": "Mathematics"
         },
      ]
    }
  }</code></pre>

      <h2 name="standards-sets/:id">standards_sets/:id</h2>
      <p>
        Select a group of standards
      </p>

      <h3>Url</h3>
      <pre><code class="nohighlight">
http://commonstandardsproject.com/api/v1/standards_sets/:id
      </code></pre>

      <h3>Example Response:</h3>
      <pre class="code-sample"><code class="json">{
    "data": {
      "id": "B1339AB05F0347E79200FCA63240F3B2_D2513639_grade-01",
      "title": "Grade 1",
      "subject": "Mathematics",
      "educationLevels": [
        "01"
      ],
      "license": "CC BY 3.0 US",
      "licenseURL": "http:\/\/creativecommons.org\/licenses\/by\/3.0\/us\/",
      "attributionURL": "http:\/\/asn.jesandco.org\/resources\/D2513639",
      "rightsHolder": "Desire2Learn Incorporated",
      "documentId": "D2513639:2013-09-10T15:37:01-04:00",
      "documentTitle": "California Common Core State Standards: Mathematics",
      "jurisdictionId": "B1339AB05F0347E79200FCA63240F3B2",
      "jurisdiction": "California",
      "source": null,
      "standards": {
        "BED3BFCB945A4C5290571A4339095DF5": {
          "id": "BED3BFCB945A4C5290571A4339095DF5",
          "asnIdentifier": "S2513640",
          "firstStandard": true,
          "nextStandard": "B6B2267B534748A5BD34F423CFD7E621",
          "depth": 0,
          "description": "Standards for Mathematical Practice"
        },
        "B6B2267B534748A5BD34F423CFD7E621": {
          "id": "B6B2267B534748A5BD34F423CFD7E621",
          "asnIdentifier": "S2513641",
          "nextStandard": "D908C7DEF36B4F9EBDB7D1568246ED31",
          "depth": 1,
          "statementNotation": "MP.1",
          "statementLabel": "Standard",
          "listId": "1",
          "description": "Make sense of problems and persevere in solving them.",
          "comments": [
            "Mathematically proficient ..."
          ],
          "exactMatch": [
            "http:\/\/corestandards.org\/Math\/Practice\/MP1"
          ]
        }
      }</code></pre>


      <h2 name="search">Search</h2>
      <p>
        We use <a href="http://algolia.com">Algolia</a> for our search service. While the API is free to use, the standards search has a limit of 100 requests per IP per hour due to the costs of hosting search. If you need to go above that, send us an email to become a sponsor of the Common Curriculum Project and we'll raise it for you.
      </p>
      <p>
        To get started with Algolia, go to <a href="https://github.com/algolia/algoliasearch-client-js#quick-start" target="_blank">Algolia's js library</a>. (They have clients for other languages, too). Your Algolia API Key and application id is in the left sidebar.
      </p>


    </div>

  </div>
  `

})
