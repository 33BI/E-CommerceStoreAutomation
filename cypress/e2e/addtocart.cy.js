describe("Swag Labs - Add to Cart Tests", () => {
  beforeEach(() => {
    // Visit login page
   cy.readFile('cypress/fixtures/credentials.json').then((user) => {
     cy.login(user.validUser.username, user.validUser.password);

    // Assertion: Ensure we are on inventory page
    cy.url().should("include", "/inventory.html");
    cy.get(".title").should("contain.text", "Products");
  })});

  it("should add a single product to the cart", () => {
    cy.get("[data-test='add-to-cart-sauce-labs-backpack']").click();

    // Assertion: Cart badge shows 1
    cy.get(".shopping_cart_badge").should("contain", "1");
  });

  it("should add multiple products to the cart", () => {
    cy.get("[data-test='add-to-cart-sauce-labs-backpack']").click();
    cy.get("[data-test='add-to-cart-sauce-labs-bike-light']").click();
    cy.get("[data-test='add-to-cart-sauce-labs-bolt-t-shirt']").click();

    // Assertion: Cart badge shows 3
    cy.get(".shopping_cart_badge").should("contain", "3");
  });

  it("should remove a product from the cart", () => {
    cy.get("[data-test='add-to-cart-sauce-labs-backpack']").click();
    cy.get("[data-test='remove-sauce-labs-backpack']").click();

    // Assertion: Cart badge should not exist
    cy.get(".shopping_cart_badge").should("not.exist");
  });

  it("should navigate to cart page and verify added items", () => {
    cy.get("[data-test='add-to-cart-sauce-labs-backpack']").click();
    cy.get("[data-test='add-to-cart-sauce-labs-bike-light']").click();

    // Go to cart page
    cy.get(".shopping_cart_link").click();
    cy.url().should("include", "/cart.html");

    // Assertions: Ensure items exist in cart
    cy.get(".cart_item").should("have.length", 2);
    cy.contains("Sauce Labs Backpack").should("be.visible");
    cy.contains("Sauce Labs Bike Light").should("be.visible");
  });

  it("should keep cart items after page reload", () => {
    cy.get("[data-test='add-to-cart-sauce-labs-backpack']").click();

    // Reload page
    cy.reload();

    // Cart badge should still show 1
    cy.get(".shopping_cart_badge").should("contain", "1");
  });
});
