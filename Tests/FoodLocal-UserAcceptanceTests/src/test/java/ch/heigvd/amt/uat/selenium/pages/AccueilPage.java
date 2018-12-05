package ch.heigvd.amt.uat.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

import java.util.logging.Level;
import java.util.logging.Logger;


public class AccueilPage extends Page {

    private By bRegisterLocator = By.id("registerButton");


    public AccueilPage(WebDriver driver) {
        super(driver);

        // Check that we're on the right page.
        if (!"Accueil".equals(driver.getTitle())) {
            throw new IllegalStateException("Accueil");
        }
    }


    public Page submitForm(Class<? extends Page> expectedPageClass) {
        driver.findElement(bRegisterLocator).click();

        Page targetPage = null;
        try {
            targetPage = expectedPageClass.getConstructor(WebDriver.class).newInstance(driver);
        } catch (Exception ex) {
            Logger.getLogger(AccueilPage.class.getName()).log(Level.SEVERE, null, ex);
            throw new RuntimeException("Exception when using reflection: " + ex.getMessage());
        }
        return targetPage;
    }
}
