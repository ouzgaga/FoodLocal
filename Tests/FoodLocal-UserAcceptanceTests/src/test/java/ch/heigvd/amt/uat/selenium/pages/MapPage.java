package ch.heigvd.amt.uat.selenium.pages;

import org.openqa.selenium.WebDriver;


public class MapPage extends Page {

    public MapPage(WebDriver driver) {
        super(driver);

        // Check that we're on the right page.
        if (!"Carte".equals(driver.getTitle())) {
            throw new IllegalStateException("Carte");
        }
    }
}
