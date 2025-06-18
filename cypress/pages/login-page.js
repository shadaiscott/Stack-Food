class Login{
     email_login = "#signinSrEmail";
     password = "input[name='password']";
     login_btn = "#signInBtn";
     login_assertion_url = '/admin'; 

set_email(email_login) {
    cy.get(this.email_login).type(email_login)
}

set_password(password){
        cy.get (this.password).type(password);
    }
click_login(){
        cy.get (this.login_btn).click();
    }
verify_login(){
        cy.url().should ('include', '/admin');
    }
}

export default Login