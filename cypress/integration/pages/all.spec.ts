import pages from "../../fixtures/all-pages.json"

pages.urls.forEach((value: string) => {
  describe(`All pages - ${value}`, () => {
    before(() => {})
    beforeEach(() => {
      cy.visit(value)
    })

    describe("Navigation", () => {
      it("Home icon", () => {
        cy.get("header").within(() => {
          cy.get("[class*='logo_link']").click()
        })
        cy.checkUrl("/")
      })
    })
  })
})
