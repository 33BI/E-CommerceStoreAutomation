describe("Swag Labs - Checkout Flow Tests", () => {
  beforeEach(() => {
    // Step 1: Login before each test
    cy.readFile('cypress/fixtures/credentials.json').then((user) => {
     cy.login(user.validUser.username, user.validUser.password);

    // Assertion: Ensure we are on inventory page
    cy.url().should("include", "/inventory.html");
    cy.get(".title").should("contain.text", "Products");
}) });

  it("should not allow checkout with an empty cart", () => {
    cy.get(".shopping_cart_link").click();
    cy.url().should("include", "/cart.html");

    // Try to checkout
    cy.get("[data-test='checkout']").click();

    // Assert: User redirected to checkout info page but with no items
    cy.get(".cart_item").should("not.exist");
  });

  it("should require mandatory information in checkout form", () => {
    // Add item to cart
    cy.get("[data-test='add-to-cart-sauce-labs-backpack']").click();
    cy.get(".shopping_cart_link").click();
    cy.get("[data-test='checkout']").click();

    // Try to continue without filling form
    cy.get("[data-test='continue']").click();
    cy.get("[data-test='error']").should(
      "contain.text",
      "Error: First Name is required"
    );

    // Fill only first name
    cy.get("[data-test='firstName']").type("Moiz");
    cy.get("[data-test='continue']").click();
    cy.get("[data-test='error']").should(
      "contain.text",
      "Error: Last Name is required"
    );
  });

  it("should complete checkout successfully with valid info", () => {
    // Add multiple products
    cy.get("[data-test='add-to-cart-sauce-labs-backpack']").click();
    cy.get("[data-test='add-to-cart-sauce-labs-bike-light']").click();

    // Go to cart
    cy.get(".shopping_cart_link").click();
    cy.get("[data-test='checkout']").click();

    // Fill in checkout info
    cy.get("[data-test='firstName']").type("Moiz");
    cy.get("[data-test='lastName']").type("Ahmad");
    cy.get("[data-test='postalCode']").type("12345");
    cy.get("[data-test='continue']").click();

    // Assert: Verify items in checkout overview
    cy.get(".cart_item").should("have.length", 2);
    cy.contains("Sauce Labs Backpack").should("be.visible");
    cy.contains("Sauce Labs Bike Light").should("be.visible");

    // Finish checkout
    cy.get("[data-test='finish']").click();

    // Assert: Verify order confirmation
    cy.url().should("include", "/checkout-complete.html");
    cy.contains("Thank you").should("be.visible");
  });

  it("should allow user to cancel checkout and return to cart", () => {
    cy.get("[data-test='add-to-cart-sauce-labs-bolt-t-shirt']").click();
    cy.get(".shopping_cart_link").click();
    cy.get("[data-test='checkout']").click();

    // Fill in partial info
    cy.get("[data-test='firstName']").type("Test");
    cy.get("[data-test='lastName']").type("User");
    cy.get("[data-test='postalCode']").type("40000");

    // Cancel
    cy.get("[data-test='cancel']").click();

    // Assert: Should go back to cart page
    cy.url().should("include", "/cart.html");
    cy.contains("Your Cart").should("be.visible");
  });
});
