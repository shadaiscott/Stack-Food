import Login from "../../pages/login-page"
import { faker } from '@faker-js/faker';

Cypress.on('uncaught:exception', (err, runnable) => {
        return false
        });

describe('Edit Basic Campaign Status', () => {
  it('edit basic campaign status', () => {

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
cy.get('[title="Campaigns"]', { timeout: 10000 }).
should('exist').scrollIntoView().click()

//Basic Campaign
cy.get('[title="Basic campaign"]', { timeout: 10000 }).should('exist').invoke('show').click()
cy.url().should ('include', '/basic');

//Edit Campaign

cy.get('[title="Edit campaign"]', { timeout: 10000 }).should('exist').then($edits => {
  const randomIndex = Math.floor(Math.random() * $edits.length)
  cy.wrap($edits).eq(randomIndex).click()
})
cy.url().should('include', '/edit')

 //Data to be used
const today = new Date();

const startDate = faker.date.soon({ days: 3, refDate: today }); // within 3 days from today
const endDate = faker.date.soon({ days: 7, refDate: startDate }); // within 7 days after startDate

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



const campaignData = {
  'title[]':faker.food.ethnicCategory() + ' Updated Campaign',
  'description[]':faker.food.description() + '[EDITED]',
  start_date: startDate.toISOString().split('T')[0],
  end_date: endDate.toISOString().split('T')[0], 
  start_time:formatTime(faker.date.between({ 
    from: new Date().setHours(6, 0, 0, 0), 
    to: new Date().setHours(12, 0, 0, 0) 
    })), // Random time between 6 AM - 12 PM

  end_time:  formatTime(faker.date.between({ 
    from: new Date().setHours(18, 0, 0, 0), 
    to: new Date().setHours(23, 59, 0, 0) 
    })), // Random time between 6 PM - 11:59 PM

}

const fields = {
  /*
  { name: 'title[]', type: 'text' },
  { name: 'description[]', type: 'text' },
  { name: 'start_date', type: 'date' },
  { name: 'end_date', type: 'date' },
  { name: 'start_time', type: 'time' },
  { name: 'end_time', type: 'time' },
  { name: 'image', type: 'file' } */

  'title[]': ['title[]'],
  'description[]': ['description[]'],
  'start_date': ['start_date', 'end_date'],  // update both if one is selected
  'start_time': ['start_time', 'end_time'],
  'image': ['image']
  };

const getFormElement = (name) => {
  return cy.get(`input[name="${name}"], textarea[name="${name}"]`);
};

const groupKeys = Object.keys(fields);
const randomKey = groupKeys[Math.floor(Math.random() * groupKeys.length)];
const fieldsToUpdate = fields[randomKey];

fieldsToUpdate.forEach((fieldName) => {
  const value = campaignData[fieldName];

  if (fieldName === 'image') {
    const selectedImage = testImages[Math.floor(Math.random() * testImages.length)];
    cy.get(`input[name="${fieldName}"]`)
      .should('exist')
      .selectFile(selectedImage, { force: true })
      .then(() => cy.log(`📸 Uploaded image: ${selectedImage}`));
  } else if (value === undefined) {
    cy.log(`⚠️ No value found for field ${fieldName}`);
  } else if(fieldName === 'title[]')
   {cy.get('input[name="title[]"]').
    first().scrollIntoView().clear({ force: true }).
    type(campaignData['title[]'], { force: true })
   }else if (fieldName ==='description[]') {
     cy.get('textarea[name="description[]"]').first().scrollIntoView().clear({ force: true }).type(campaignData['description[]'], { force: true })
   }
  else {
    const element = getFormElement(fieldName);
    element
      .should('exist')
      .scrollIntoView()
      .clear({ force: true })
      .type(value.toString(), { force: true });
  }
});


// Submit the form


cy.get('#campaign-form > .btn--container > .btn--primary').should('exist')
.should('be.visible').click()

//Validation

cy.get('.toast-message').should('exist').should('contain', 'updated')
cy.url().should('include','/list')

})

})

