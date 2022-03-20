import "./commands"
import "@cypress/code-coverage/support"

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * Checks if the current url matches the given path
       */
      checkUrl(expected: string): Chainable<void>
    }
  }
}
