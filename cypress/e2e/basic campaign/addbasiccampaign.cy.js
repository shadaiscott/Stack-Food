import Login from "../../pages/login-page"
import { faker } from '@faker-js/faker';

Cypress.on('uncaught:exception', (err, runnable) => {
        return false
        });

describe('New Basic Campaign', () => {
  it('create a new basic campaign', () => {

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

//Add New Campaign
cy.get('.col-sm-auto > .btn', { timeout: 10000 }).should('exist').should('be.visible').click()
cy.url().should('include','/add-new')

//Data for Campaign 

const startDate = faker.date.future()
const endDate = faker.date.future({ refDate: startDate });


  // Helper function to format time as HH:MM
const formatTime = (date) => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};
//Images for Upload
 const testImages = [
      'cypress/fixtures/images/testimageone.jpg',
      'cypress/fixtures/images/testimagetwo.jpg',
      'cypress/fixtures/images/testimagethree.jpg',
      'cypress/fixtures/images/testimagefour.jpg',
      'cypress/fixtures/images/testimagefive.jpg'  
    ];

  const selectedImage = testImages[Math.floor(Math.random() * testImages.length)]

const campaignData = {
  title:faker.food.ethnicCategory() + ' Campaign',
  description:faker.food.description(),
  startDate: startDate.toISOString().split('T')[0],
  endDate: endDate.toISOString().split('T')[0], 
  dailyStartTime:formatTime(faker.date.between({ 
    from: new Date().setHours(6, 0, 0, 0), 
    to: new Date().setHours(12, 0, 0, 0) 
    })), // Random time between 6 AM - 12 PM

  dailyEndTime:  formatTime(faker.date.between({ 
    from: new Date().setHours(18, 0, 0, 0), 
    to: new Date().setHours(23, 59, 0, 0) 
    })), // Random time between 6 PM - 11:59 PM
}
  
// Campaign Title 

 cy.get('#default_title', { timeout: 10000 } ).should('exist').should('be.visible').type(campaignData.title)

 //Campaign Description
 cy.get('#default-form > .mb-0 > .form-control',{ timeout: 10000 }).should('exist').should('be.visible').
 type(campaignData.description)

 //Start Date
cy.get('#date_from').should('exist').should('be.visible').type(campaignData.startDate);

 //End Date
cy.get('#date_to').should('exist').should('be.visible').type(campaignData.endDate);

//Start Time
cy.get('#start_time').should('exist').should('be.visible').type(campaignData.dailyStartTime);

//End time
cy.get('#end_time').should('exist').should('be.visible').type(campaignData.dailyEndTime)

//Upload Image
cy.get('.image-box > .d-flex').should('exist').should('be.visible').selectFile(selectedImage)
//Submit Btn

cy.get('#campaign-form > .btn--container > .btn--primary').should('exist').should('be.visible').click()

  // Success Message
cy.get('.toast-message').should('exist').should('contain', 'Campaign created successfully')

//Url Confirmation 
cy.url().should('include','/list')

  })


})