import EmberRouter from "@ember/routing/router"
import config from "./config/environment"

const Router = EmberRouter.extend({
  location: config.locationType,
})

Router.map(function() {
  this.route("home", { path: "/" })
  this.route("search")
  this.route("developers")
  this.route("document-importer")
  this.route("edit", function() {
    this.route("pull-requests", { path: "/pull-requests/:id" })
  })
  this.route("commits")
})

export default Router
