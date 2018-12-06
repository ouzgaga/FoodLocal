package ch.heigvd.amt.uat.selenium.pages;

import org.openqa.selenium.WebDriver;

import java.util.logging.Level;
import java.util.logging.Logger;


public class AboutPage extends Page {

    public AboutPage(WebDriver driver) {
        super(driver);

        // Check that we're on the right page.
        if (!"A propos".equals(driver.getTitle())) {
            throw new IllegalStateException("AboutPage");
        }
    }


}
