import Ember from "ember"
import rpc from "../lib/rpc"
import hbs from "htmlbars-inline-precompile"
import { storageFor } from "ember-local-storage"

export default Ember.Component.extend({
  authenticate: Ember.inject.service(),
  session: storageFor("persistedSession"),

  isAuthenticated: Ember.computed("session.authenticatedAt", function() {
    console.log("session.authenticatedAt", Ember.get(this, "session.authenticatedAt"))
    return Date.now() - this.get("session.authenticatedAt") < 3100000
  }),

  addHighlighting: Ember.on("didInsertElement", function() {
    $("pre").each(function(i, block) {
      hljs.highlightBlock(block)
    })
  }),

  actions: {
    signIn() {
      analytics.track("Developers - Sign In")
      this.get("authenticate").show()
    },
    showReset() {
      analytics.track("Developers - Sign Out")
      this.get("authenticate").logout()
    },
    updateOrigins() {
      analytics.track("Developers - Update Origins")
      rpc["user:updateAllowedOrigins"](
        this.get("session.id"),
        this.get("session.allowedOrigins"),
        function(data) {
          this.set("originSuccess", true)
          Ember.run.later(
            this,
            function() {
              this.set("originSuccess", false)
            },
            2000
          )
        }.bind(this)
      )
    },
  },

  layout: hbs`
  {{partial "navbar"}}

  <div class="developers-grid">
    <div class="developers-grid__sidebar">
      <div class="sidebar-list">
        <div class="sidebar-list__heading">API Overview</div>
        {{#skip-link anchor="#why" class="sidebar-list__section --code"}}Why?{{/skip-link}}
        {{#skip-link anchor="#who" class="sidebar-list__section --code"}}Who is behind this?{{/skip-link}}
        {{#skip-link anchor="#using" class="sidebar-list__section --code"}}Using the API{{/skip-link}}
        {{#skip-link anchor="#authentication" class="sidebar-list__section --code"}}Authentication{{/skip-link}}

        <div class="sidebar-list__heading">Endpoints</div>
        {{#skip-link anchor="#jurisdictions-index" class="sidebar-list__section --code"}}jurisdictions{{/skip-link}}
        {{#skip-link anchor="#jurisdictions-id" class="sidebar-list__section --code"}}jurisdictions/:id{{/skip-link}}
        {{#skip-link anchor="#standard-sets-id" class="sidebar-list__section --code"}}standard_sets/:id{{/skip-link}}

        <div class="sidebar-list__heading">Search</div>
        {{#skip-link anchor="#search" class="sidebar-list__section --code"}}Search{{/skip-link}}

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
{{#if session.algoliaApiKey}} {{session.algoliaApiKey}} {{else}} Contact us for a free search key. {{/if}}</pre>
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
      <h1>Welcome!</h1>
      <p>
        Standards are hard and we're here to help. There are 50 states (and even more organizations) who produce standards. If you're like us, your customers will start asking to add their own standards. Creating an infrastructure to screen scrape 50 state websites and then updating them is overwhelming. Some companies charge and arm and a leg for standards in formats that don't conform to conventional JSON or are organized in bizarre, teacher unfriendly ways. Further, you need to update the standards as the states update them. And, of course, let's not forget search. What's a developer to do?
      </p>
      <p>
        Use the Common Standards Project, of course! Here, you can learn more about use our API and how to integrate instant standards search into your website. Reach out to me at scott (at) commoncurriculum dot com if you need more help!
      </p>

      <h1>API Overview</h1>
      <h2 id="why">Why does edtech need a standards API?</h2>
      <p>
        If edtech companies are going to reach their potential to change teaching practices and dramatically improve student outcomes, their products need to interop. Standards are a common denominator across vast swaths of the edtech landscape, yet their exists no
      </p>
      <ul>
        <li>common data format for standards</li>
        <li>shared set of IDs to uniquely identify each standard</li>
        <li>central database of standards from all 50 states, organizations, and countries</li>
        <li>an ability to publish new standards unique to districts, charter networks or organizations</li>
      </ul>
      <p>
        This project aims to solve these barriers to edtech interoperability. Each standard follows a consistent convention, has a unique GUID, and is accessible through this API or through a database dump. New standards can be added through the web interface.
      </p>

      <p>
        This project wouldn't be possible without the work of the Achivement Standards Network (ASN) and it's parent company, Desire2Learn. They convert standards and release them on their website under a Creative Commons attribution license. This project builds on their work by adding GUIDs to each standards, converting the standards into a simple JSON structure, and grouping the standards into sets that teachers are familiar with and the standard writers published them in. For instance, ASN releases standards tagged with grade levels (e.g. 1st - 12th grade). We group those standards into groups such as "Grade 1 Math", "High School -- Algebra", "High School - Functions"
      </p>


      <h2 id="who">Who is behind this?</h2>
      <p>
        The Common Standards Project is produced by <a href="http://commoncurriculum.com" target="_blank">Common Curriculum</a>, a collaborative lesson planner transforming how schools develop and align instruction for their students. This API is in production at Common Curriculum.
      </p>

      <h2 id="using">Using these standards</h2>
      <p>
        Click "Register or Sign In" on the left to get your API key. Currently, there is not a limit placed on API requests. If limits are added in the future, they'll only be enacted to better share costs among the users of the API.
      </p>

      <h2 id="authentication">Authentication</h2>
      <ul>
        <li>All requests need an <code>api-key</code> query parameter or an <code>Api-Key</code> header. Your api key can be found in the sidebar.</li>
        <li>
          All requests need to originate from one of the allowed origins. You can update origins on the sidebar.
        </li>
      </ul>

      <h1>Endpoints</h1>
      <blockquote>Try out a live version at <a href="http://api.commonstandardsproject.com" target="_blank">http://api.commonstandardsproject.com</a></blockquote>
      <h2 id="jurisdictions-index">Jurisdictions/</h2>
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

      <h2 id="jurisdictions-id">jurisdictions/:id</h2>
      <p>
        Select a particular jurisdiction
      </p>

      <h3>Url</h3>
      <pre><code class="nohighlight">
http://commonstandardsproject.com/api/v1/jurisdictions/:id
      </code></pre>

      <h3>Example Response:</h3>
      <pre class="code-sample"><code class="json">{
  {
    "data": {
      "id": "49FCDFBD2CF04033A9C347BFA0584DF0",
      "title": "Maryland",
      "type": "state",
      "standardSets": [
        {
          "id": "49FCDFBD2CF04033A9C347BFA0584DF0_D1000265_grades-09-10-11-12",
          "title": "Grades 9, 10, 11, 12",
          "subject": "Science Core Learning Goals (2002)",
          "educationLevels": [
            "09",
            "10",
            "11",
            "12"
          ],
          "document": {
            "id": "D1000265",
            "valid": "2002",
            "title": "Maryland Science Core Learning Goals",
            "sourceURL": "http:\/\/mdk12.org\/instruction\/curriculum\/science\/clg_toolkit.html",
            "asnIdentifier": "D1000265",
            "publicationStatus": "Published"
          }
        },
        {
          "id": "49FCDFBD2CF04033A9C347BFA0584DF0_D10002D0_grade-01",
          "title": "Grade 1",
          "subject": "Social Studies",
          "educationLevels": [
            "01"
          ],
          "document": {
            "id": "D10002D0",
            "valid": "2006",
            "title": "Voluntary State Curriculum - Social Studies",
            "sourceURL": null,
            "asnIdentifier": "D10002D0",
            "publicationStatus": "Published"
          }
        }
      ]
    }
  }</code></pre>

      <h2 id="standard-sets-id">standard_sets/:id</h2>
      <p>
        Select a group of standards
      </p>

      <h3>Url</h3>
      <pre><code class="nohighlight">
http://commonstandardsproject.com/api/v1/standard_sets/:id
      </code></pre>

      <h3>Example Response:</h3>
      <pre class="code-sample"><code class="json">{
  "data": {
     "id": "49FCDFBD2CF04033A9C347BFA0584DF0_D2604890_grade-01",
     "title": "Grade 1",
     "subject": "Mathematics",
     "educationLevels": [
       "01"
     ],
     "license": {
       "title": "CC BY 3.0 US",
       "URL": "http:\/\/creativecommons.org\/licenses\/by\/3.0\/us\/",
       "rightsHolder": "Desire2Learn Incorporated"
     },
     "rightsHolder": null,
     "document": {
       "id": "D2604890",
       "valid": "2011",
       "title": "Maryland College and Career-Ready Standards - Mathematics (PK-8)",
       "sourceURL": "http:\/\/mdk12.org\/instruction\/curriculum\/mathematics\/index.html",
       "asnIdentifier": "D2604890",
       "publicationStatus": "Published"
     },
     "jurisdiction": {
       "id": "49FCDFBD2CF04033A9C347BFA0584DF0",
       "title": "Maryland"
     },
     "standards": {
       "10C032C40D33415EA1AD242D40481A4F": {
         "id": "10C032C40D33415EA1AD242D40481A4F",
         "asnIdentifier": "S2604891",
         "position": 1000,
         "depth": 0,
         "description": "Standards for Mathematical Practice"
       },
       "97253D2D6F384ADF8001A3512A4107AE": {
         "id": "97253D2D6F384ADF8001A3512A4107AE",
         "asnIdentifier": "S2604892",
         "position": 2000,
         "depth": 1,
         "statementLabel": "Standard",
         "listId": "1.",
         "description": "Make sense of problems and persevere in solving them."
       },
       "486874A7CEC04817BCD93180E5C47CB7": {
         "id": "486874A7CEC04817BCD93180E5C47CB7",
         "asnIdentifier": "S2604893",
         "position": 3000,
         "depth": 1,
         "statementLabel": "Standard",
         "listId": "2.",
         "description": "Reason abstractly and quantitatively."
       },
       "32790706FBF043B4AE53539534337DB9": {
         "id": "32790706FBF043B4AE53539534337DB9",
         "asnIdentifier": "S2604894",
         "position": 4000,
         "depth": 1,
         "statementLabel": "Standard",
         "listId": "3.",
         "description": "Construct viable arguments and critique the reasoning of others."
       }
    ]
  }
}</code></pre>


      <h2 id="search">Search</h2>
      <p>
        We use <a href="http://algolia.com">Algolia</a> for our search service. While the API is free to use, the standards search has a limit of 100 requests per IP per hour due to the costs of hosting search. If you need to go above that, send us an email to become a sponsor of the Common Curriculum Project and we'll raise it for you.
      </p>
      <p>
        To get started with Algolia, go to <a href="https://github.com/algolia/algoliasearch-client-js#quick-start" target="_blank">Algolia's js library</a>. (They have clients for other languages, too). Your Algolia API Key and application id is in the left sidebar.
      </p>

      <pre class="code-sample"><code>// jQuery example (they have )
&lt;script src="//cdn.jsdelivr.net/algoliasearch/3/algoliasearch.jquery.min.js">&lt;/script>
&lt;script&lt;
  var client = algoliaClient('O7L4OQENOZ', '{{session.algoliaApiKey}}');
  var index = client.initIndex('common-standards-project');
  index.search('something', function searchDone(err, content) {
    console.log(err, content)
  });
&lt;/script></code></pre>

      <p>
        A few things to note:
      </p>
      <ul>
        <li>Algolia will highlight the places where the search term is found.</li>
        <li>There are facets for <code>standardSet.title</code>, <code>subject</code>, <code>normalizedSubject</code>, and <code>jurisdiction.title</code></li>
        <li>The standards are ordered by the <code>position</code></li>
        <li>All the standards include an array of their ancestor's descriptions so a word found in an ancestor will show the standard</li>
      </ul>

      <h3>Format of standard in response from Algolia</h3>
      <pre class="code-sample"><code>{
  "id": "0AD25973CF4E4DC892561BEEF05C6BB4",
  "asnIdentifier": "S2604988",
  "position": 33000,
  "depth": 2,
  "statementNotation": "1.NBT.4",
  "statementLabel": "Standard",
  "description": "Add within 100, including adding a two-digit number and a one-digit number, and adding a two-digit number and a multiple of 10, using concrete models or drawings and strategies based on place value, properties of operations, and/or the relationship between addition and subtraction; relate the strategy to a written method and explain the reasoning used. Understand that in adding two-digit numbers, one adds tens and tens, ones and ones, and sometimes it is necessary to compose a ten.",
  "ancestorDescriptions": [
    "Use place value understanding and properties of operations to add and subtract.",
    "Number and Operations (Base Ten)"
  ],
  "educationLevels": [
    "01"
  ],
  "subject": "Mathematics",
  "normalizedSubject": "Math",
  "standardSet": {
    "title": "Grade 1",
    "id": "49FCDFBD2CF04033A9C347BFA0584DF0_D2604890_grade-01"
  },
  "jurisdiction": {
    "id": "49FCDFBD2CF04033A9C347BFA0584DF0",
    "title": "Maryland"
  },
  "_tags": [
    "E5B209C180E24242B7D337302A19D69B",
    "3993CD0C80874BE0B5CE62758D97F64A",
    "49FCDFBD2CF04033A9C347BFA0584DF0_D2604890_grade-01",
    "49FCDFBD2CF04033A9C347BFA0584DF0",
    "01"
  ],
  "objectID": "0AD25973CF4E4DC892561BEEF05C6BB4"
}</code></pre>



    </div>

  </div>
  `,
})
