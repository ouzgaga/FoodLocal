package ch.heigvd.amt.uat.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

import java.util.logging.Level;
import java.util.logging.Logger;


public class RegisterInformationPage extends Page {

    private By tfEmailLocator = By.id("email");
    private By tfLastNameLocator = By.id("lastNameInput");
    private By tfFirstNameLocator = By.id("firstNameInput");
    private By tfPasswordLocator = By.id("password");
    private By tfPasswordConfLocator = By.id("passwordConf");
    private By bNextStepLocator = By.id("register-button-step");


    public RegisterInformationPage(WebDriver driver) {
        super(driver);

        // Check that we're on the right page.
        if (!"Nouveau Compte - Informations".equals(driver.getTitle())) {
            throw new IllegalStateException("RegisterInformationPage");
        }
    }

    public RegisterInformationPage typeEmailAddress(String email) {
        driver.findElement(tfEmailLocator).sendKeys(email);
        return this;
    }

    public RegisterInformationPage typeLastName(String lastName) {
        driver.findElement(tfLastNameLocator).sendKeys(lastName);
        return this;
    }

    public RegisterInformationPage typeFirstName(String firstName) {
        driver.findElement(tfFirstNameLocator).sendKeys(firstName);
        return this;
    }

    public RegisterInformationPage typePassword(String password) {
        driver.findElement(tfPasswordLocator).sendKeys(password);
        return this;
    }

    public RegisterInformationPage typePasswordConf(String passwordConf) {
        driver.findElement(tfPasswordConfLocator).sendKeys(passwordConf);
        return this;
    }

    public Page submitForm(Class<? extends Page> expectedPageClass) {
        driver.findElement(bNextStepLocator).click();

        Page targetPage = null;
        try {
            targetPage = expectedPageClass.getConstructor(WebDriver.class).newInstance(driver);
        } catch (Exception ex) {
            Logger.getLogger(RegisterInformationPage.class.getName()).log(Level.SEVERE, null, ex);
            throw new RuntimeException("Exception when using reflection: " + ex.getMessage());
        }
        return targetPage;
    }
}
