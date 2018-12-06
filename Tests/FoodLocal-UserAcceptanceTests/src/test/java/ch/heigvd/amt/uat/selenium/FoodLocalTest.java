package ch.heigvd.amt.uat.selenium;

import ch.heigvd.amt.uat.selenium.pages.*;
import io.probedock.client.annotations.ProbeTest;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

import java.nio.file.FileSystems;
import java.nio.file.Path;

/**
 * @author Team FoodLocal
 */
public class FoodLocalTest {

    private String baseUrl = "http://localhost:3000/";
    private WebDriver driver;

    @Before
    public void openBrowser() {
        //driver = new FirefoxDriver();

        Path p = FileSystems.getDefault().getPath("chromeDrivers");
        // ------------------------------- Ne décommentez que le driver approprié --------------------------------------------------------------
        System.setProperty("webdriver.chrome.driver", p.toAbsolutePath() + "/chromedriverWin32.exe"); // driver Windows
        // System.setProperty("webdriver.chrome.driver", p.toAbsolutePath() + "/chromedriverLinux64"); // driver Linux
        //System.setProperty("webdriver.chrome.driver", p.toAbsolutePath() + "/chromedriverMacos64"); // driver Macos
        driver = new ChromeDriver();
    }

    @Test
    @ProbeTest(tags = "WebUI")
    public void itShouldNotBePossibleToGoToTheMainPage() {
        driver.get(baseUrl);
        AccueilPage accueilPage = new AccueilPage(driver);
    }

    @Test
    @ProbeTest(tags = "WebUI")
    public void itShouldNotBePossibleToGoToTheMapPage() {
        driver.get(baseUrl + "map/");
        MapPage mapPage = new MapPage(driver);
    }

    @Test
    @ProbeTest(tags = "WebUI")
    public void itShouldNotBePossibleToGoToTheAboutPage() {
        driver.get(baseUrl + "about/");
        AboutPage aboutPage = new AboutPage(driver);
    }

    @Test
    @ProbeTest(tags = "WebUI")
    public void aUserWhoWantToRegisterMustEnterAValidEmail() {
        RegisterInformationPage registerInformationPage = tryToRegister("Not A correct email", "Hey", "Hello", "1234", "1234");
        registerInformationPage = (RegisterInformationPage) registerInformationPage.submitForm(RegisterInformationPage.class);
    }

    @Test
    @ProbeTest(tags = "WebUI")
    public void aUserWhoWantToRegisterMustEnterAnLastName() {
        RegisterInformationPage registerInformationPage = tryToRegister("a@a.com", "", "Hello", "1234", "1234");
        registerInformationPage = (RegisterInformationPage) registerInformationPage.submitForm(RegisterInformationPage.class);
    }

    @Test
    @ProbeTest(tags = "WebUI")
    public void aUserWhoWantToRegisterMustEnterAFirstName() {
        RegisterInformationPage registerInformationPage = tryToRegister("a@a.com", "Hey", "", "1234", "1234");
        registerInformationPage = (RegisterInformationPage) registerInformationPage.submitForm(RegisterInformationPage.class);
    }

    @Test
    @ProbeTest(tags = "WebUI")
    public void aUserWhoWantToRegisterMustEnterAPassword() {
        RegisterInformationPage registerInformationPage = tryToRegister("a@a.com", "Hey", "Hello", "", "1234");
        registerInformationPage = (RegisterInformationPage) registerInformationPage.submitForm(RegisterInformationPage.class);
    }

    @Test
    @ProbeTest(tags = "WebUI")
    public void aUserWhoWantToRegisterMustEnterAPasswordConfirmation() {
        RegisterInformationPage registerInformationPage = tryToRegister("a@a.com", "Hey", "Hello", "1234", "");
        registerInformationPage = (RegisterInformationPage) registerInformationPage.submitForm(RegisterInformationPage.class);
    }

    @Test
    @ProbeTest(tags = "WebUI")
    public void aUserWhoWantToRegisterMustEnterTheSamePasswordAndPasswordConfirmation() {
        RegisterInformationPage registerInformationPage = tryToRegister("a@a.com", "Hey", "Hello", "1234", "5678");
        registerInformationPage = (RegisterInformationPage) registerInformationPage.submitForm(RegisterInformationPage.class);
    }

    @Test
    @ProbeTest(tags = "WebUI")
    public void aUserWhoWantToRegisterMustEnterAnEmail() {
        RegisterInformationPage registerInformationPage = tryToRegister("test@test.com", "Bonjour", "Je m'inscris", "1234", "1234");
        RegisterStatusPage registerStatusPage = (RegisterStatusPage) registerInformationPage.submitForm(RegisterStatusPage.class);
    }
    
    @After
    public void closeBrowser() {
        driver.close();
    }

    public RegisterInformationPage tryToRegister(String email, String firstName, String lastName, String password, String passwordConfirmation) {
        driver.get(baseUrl);

        AccueilPage accueilPage = new AccueilPage(driver);

        RegisterInformationPage registerInformationPage = (RegisterInformationPage) accueilPage.submitForm(RegisterInformationPage.class);

        registerInformationPage.typeEmailAddress(email);
        registerInformationPage.typeLastName(lastName);
        registerInformationPage.typeFirstName(firstName);
        registerInformationPage.typePassword(password);
        registerInformationPage.typePasswordConf(passwordConfirmation);
        return registerInformationPage;
    }
}
