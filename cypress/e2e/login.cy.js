import testData from "../fixtures/credentials.json";

describe("Login Functionality", () => {
  it("Should login with valid credentials", () => {
    cy.login(testData.validUser.username, testData.validUser.password);
   cy.get(".title").should("contain.text", "Products");


  });

       it("Should fail with invalid credentials", () => {
    cy.login(testData.invalidUser.username, testData.invalidUser.password);
  cy.contains("Epic sadface: Username and password do not match any user in this service").should("be.visible");
  });


});