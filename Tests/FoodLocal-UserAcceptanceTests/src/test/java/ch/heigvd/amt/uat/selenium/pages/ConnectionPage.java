package ch.heigvd.amt.uat.selenium.pages;

import org.openqa.selenium.WebDriver;


public class ConnectionPage extends Page {

    public ConnectionPage(WebDriver driver) {
        super(driver);

        // Check that we're on the right page.
        if (!"Connection".equals(driver.getTitle())) {
            throw new IllegalStateException("ConnectionPage");
        }
    }
}
