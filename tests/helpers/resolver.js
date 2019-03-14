import Resolver from "../../resolver"
import config from "../../config/environment"

const resolver = Resolver.create()

resolver.namespace = {
  modulePrefix: config.modulePrefix,
}

export default resolver
