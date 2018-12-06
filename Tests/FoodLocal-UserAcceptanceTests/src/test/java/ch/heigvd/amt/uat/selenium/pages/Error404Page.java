package ch.heigvd.amt.uat.selenium.pages;

import org.openqa.selenium.WebDriver;


public class Error404Page extends Page {

    public Error404Page(WebDriver driver) {
        super(driver);

        // Check that we're on the right page.
        if (!"Error 404".equals(driver.getTitle())) {
            throw new IllegalStateException("Error404Page");
        }
    }
}
