import Login from "../../pages/login-page"

Cypress.on('uncaught:exception', (err, runnable) => {
        return false
        });

describe('Update Basic Campaign Status', () => {
  it('update basic campaign status', () => {

    cy.visit('https://stackfood-admin.6amtech.com/login/admin')
//Login
    cy.fixture('login_data').then((data) => {
      const login = new Login();
      login.set_email(data.email_login);
      login.set_password(data.password); 
      login.click_login();
      login.verify_login(); 
    })

//Home Page
cy.get('[data-original-title="Collapse"]', { timeout: 10000 }).eq(0).should('exist').invoke('show').click()
cy.get(':nth-child(17) > .js-navbar-vertical-aside-menu-link > .navbar-vertical-aside-mini-mode-hidden-elements', { timeout: 10000 }).
should('exist').scrollIntoView().click()

//Basic Campaign
cy.get('[title="Basic campaign"]', { timeout: 10000 }).should('exist').invoke('show').click()
cy.url().should ('include', '/basic');

//Toggle 

cy.get('label.toggle-switch').then($toggles => {
  const randomIndex = Math.floor(Math.random() * $toggles.length)
  cy.wrap($toggles).eq(randomIndex).click()
})

//Confirm success message

cy.get('.toast-message').should('exist').should('contain', 'updated')

  })

})