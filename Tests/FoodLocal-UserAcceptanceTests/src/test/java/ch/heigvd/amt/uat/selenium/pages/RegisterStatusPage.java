package ch.heigvd.amt.uat.selenium.pages;

import org.openqa.selenium.WebDriver;


public class RegisterStatusPage extends Page {

    public RegisterStatusPage(WebDriver driver) {
        super(driver);

        // Check that we're on the right page.
        if (!"Nouveau Compte - Status".equals(driver.getTitle())) {
            throw new IllegalStateException("RegisterStatusPage");
        }
    }
}
