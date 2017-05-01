package websiteTest;

import java.util.ArrayList;
import java.util.concurrent.TimeUnit;

import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

public class WebsiteSearchTest {
	private static ChromeDriver driver;
	WebElement element;

	@BeforeMethod
	public void openBrowser(){
		System.setProperty("webdriver.chrome.driver","C:\\Program Files (x86)\\Selenium-3.3.1\\chromedriver.exe");
		driver = new ChromeDriver();
		driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
		String baseUrl = "https://sites.google.com/site/usmlunch/home";
		driver.get(baseUrl);
	} 

	@Test
	public void testNameYieldsCorrectOutput(){
		System.out.println("Starting test " + new Object(){}.getClass().getEnclosingMethod().getName());
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		WebElement nameBox = driver.findElement(By.id("Name"));
		nameBox.click();
		nameBox.sendKeys("Frederick Lange");
		WebElement submitButton = driver.findElement(By.id("student"));
		submitButton.click();

		WebElement table = driver.findElement(By.id("schedDiv"));
		ArrayList<WebElement> trs = (ArrayList<WebElement>) table.findElements(By.tagName("tr"));
		ArrayList<WebElement> ths = (ArrayList<WebElement>) trs.get(0).findElements(By.tagName("th"));
		int name = getElementByText(ths, "Name");
		int count = trs.size();
		for(int i = 1; i < count; i++){
			ArrayList<WebElement> tds = (ArrayList<WebElement>) trs.get(i).findElements(By.tagName("td"));
			Assert.assertEquals("Frederick Lange", tds.get(name).getText());
		}
		System.out.println("Ending test " + new Object(){}.getClass().getEnclosingMethod().getName());
	}
	
	@Test
	public void testNameWithWhiteSpaceYieldsCorrectOutput(){
		System.out.println("Starting test " + new Object(){}.getClass().getEnclosingMethod().getName());
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		WebElement nameBox = driver.findElement(By.id("Name"));
		nameBox.click();
		nameBox.sendKeys(" Frederick  Lange ");
		WebElement submitButton = driver.findElement(By.id("student"));
		submitButton.click();

		WebElement table = driver.findElement(By.id("schedDiv"));
		ArrayList<WebElement> trs = (ArrayList<WebElement>) table.findElements(By.tagName("tr"));
		ArrayList<WebElement> ths = (ArrayList<WebElement>) trs.get(0).findElements(By.tagName("th"));
		int name = getElementByText(ths, "Name");
		int count = trs.size();
		for(int i = 1; i < count; i++){
			ArrayList<WebElement> tds = (ArrayList<WebElement>) trs.get(i).findElements(By.tagName("td"));
			Assert.assertEquals("Frederick Lange", tds.get(name).getText());
		}
		System.out.println("Ending test " + new Object(){}.getClass().getEnclosingMethod().getName());
	}
	
	@Test
	public void testLedgerYieldsCorrectOutput(){
		System.out.println("Starting test " + new Object(){}.getClass().getEnclosingMethod().getName());
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.findElement(By.id("tableToggle")).click();
		WebElement ledgerCheck = driver.findElement(By.cssSelector("#searchTable > tbody > tr:nth-child(1) > td:nth-child(2) > input[type=\"checkbox\"]:nth-child(4)"));
		ledgerCheck.click();
		WebElement submitButton = driver.findElement(By.id("student"));
		submitButton.click();

		WebElement table = driver.findElement(By.id("schedDiv"));
		ArrayList<WebElement> trs = (ArrayList<WebElement>) table.findElements(By.tagName("tr"));
		ArrayList<WebElement> ths = (ArrayList<WebElement>) trs.get(0).findElements(By.tagName("th"));
		int house = getElementByText(ths, "House");
		int count = trs.size();
		for(int i = 1; i < count; i++){
			ArrayList<WebElement> tds = (ArrayList<WebElement>) trs.get(i).findElements(By.tagName("td"));
			Assert.assertEquals("Ledger", tds.get(house).getText());
		}
		System.out.println("Ending test " + new Object(){}.getClass().getEnclosingMethod().getName());
	}
	
	@Test
	public void testArrowYieldsCorrectOutput(){
		System.out.println("Starting test " + new Object(){}.getClass().getEnclosingMethod().getName());
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.findElement(By.id("tableToggle")).click();
		WebElement arrowCheck = driver.findElement(By.cssSelector("#searchTable > tbody > tr:nth-child(1) > td:nth-child(2) > input[type=\"checkbox\"]:nth-child(2)"));
		arrowCheck.click();
		WebElement submitButton = driver.findElement(By.id("student"));
		submitButton.click();

		WebElement table = driver.findElement(By.id("schedDiv"));
		ArrayList<WebElement> trs = (ArrayList<WebElement>) table.findElements(By.tagName("tr"));
		ArrayList<WebElement> ths = (ArrayList<WebElement>) trs.get(0).findElements(By.tagName("th"));
		int house = getElementByText(ths, "House");
		int count = trs.size();
		for(int i = 1; i < count; i++){
			ArrayList<WebElement> tds = (ArrayList<WebElement>) trs.get(i).findElements(By.tagName("td"));
			Assert.assertEquals("Arrow", tds.get(house).getText());
		}
		System.out.println("Ending test " + new Object(){}.getClass().getEnclosingMethod().getName());
	}
	
	@Test
	public void testAcademyYieldsCorrectOutput(){
		System.out.println("Starting test " + new Object(){}.getClass().getEnclosingMethod().getName());
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.findElement(By.id("tableToggle")).click();
		WebElement academyCheck = driver.findElement(By.cssSelector("#searchTable > tbody > tr:nth-child(1) > td:nth-child(2) > input[type=\"checkbox\"]:nth-child(1)"));
		academyCheck.click();
		WebElement submitButton = driver.findElement(By.id("student"));
		submitButton.click();

		WebElement table = driver.findElement(By.id("schedDiv"));
		ArrayList<WebElement> trs = (ArrayList<WebElement>) table.findElements(By.tagName("tr"));
		ArrayList<WebElement> ths = (ArrayList<WebElement>) trs.get(0).findElements(By.tagName("th"));
		int house = getElementByText(ths, "House");
		int count = trs.size();
		for(int i = 1; i < count; i++){
			ArrayList<WebElement> tds = (ArrayList<WebElement>) trs.get(i).findElements(By.tagName("td"));
			Assert.assertEquals("Academy", tds.get(house).getText());
		}
		System.out.println("Ending test " + new Object(){}.getClass().getEnclosingMethod().getName());
	}
	
	@Test
	public void testCrestYieldsCorrectOutput(){
		System.out.println("Starting test " + new Object(){}.getClass().getEnclosingMethod().getName());
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.findElement(By.id("tableToggle")).click();
		WebElement crestCheck = driver.findElement(By.cssSelector("#searchTable > tbody > tr:nth-child(1) > td:nth-child(2) > input[type=\"checkbox\"]:nth-child(3)"));
		crestCheck.click();
		WebElement submitButton = driver.findElement(By.id("student"));
		submitButton.click();

		WebElement table = driver.findElement(By.id("schedDiv"));
		ArrayList<WebElement> trs = (ArrayList<WebElement>) table.findElements(By.tagName("tr"));
		ArrayList<WebElement> ths = (ArrayList<WebElement>) trs.get(0).findElements(By.tagName("th"));
		int house = getElementByText(ths, "House");
		int count = trs.size();
		for(int i = 1; i < count; i++){
			ArrayList<WebElement> tds = (ArrayList<WebElement>) trs.get(i).findElements(By.tagName("td"));
			Assert.assertEquals("Crest", tds.get(house).getText());
		}
		System.out.println("Ending test " + new Object(){}.getClass().getEnclosingMethod().getName());
	}
	
	@Test
	public void testMultipleHousesYieldCorrectOutput(){
		System.out.println("Starting test " + new Object(){}.getClass().getEnclosingMethod().getName());
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.findElement(By.id("tableToggle")).click();
		WebElement ledgerCheck = driver.findElement(By.cssSelector("#searchTable > tbody > tr:nth-child(1) > td:nth-child(2) > input[type=\"checkbox\"]:nth-child(4)"));
		ledgerCheck.click();
		WebElement arrowCheck = driver.findElement(By.cssSelector("#searchTable > tbody > tr:nth-child(1) > td:nth-child(2) > input[type=\"checkbox\"]:nth-child(2)"));
		arrowCheck.click();
		WebElement submitButton = driver.findElement(By.id("student"));
		submitButton.click();

		WebElement table = driver.findElement(By.id("schedDiv"));
		ArrayList<WebElement> trs = (ArrayList<WebElement>) table.findElements(By.tagName("tr"));
		ArrayList<WebElement> ths = (ArrayList<WebElement>) trs.get(0).findElements(By.tagName("th"));
		int house = getElementByText(ths, "House");
		int count = trs.size();
		for(int i = 1; i < count; i++){
			ArrayList<WebElement> tds = (ArrayList<WebElement>) trs.get(i).findElements(By.tagName("td"));
			Assert.assertTrue(tds.get(house).getText().equals("Ledger") || tds.get(house).getText().equals("Arrow"));
		}
		System.out.println("Ending test " + new Object(){}.getClass().getEnclosingMethod().getName());
	}
	
	@Test
	public void testTableNumberYieldsCorrectOutput(){
		System.out.println("Starting test " + new Object(){}.getClass().getEnclosingMethod().getName());
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.findElement(By.id("tableToggle")).click();
		WebElement tableBox = driver.findElement(By.id("Table"));
		tableBox.click();
		tableBox.sendKeys("17");
		WebElement submitButton = driver.findElement(By.id("student"));
		submitButton.click();

		WebElement table = driver.findElement(By.id("schedDiv"));
		ArrayList<WebElement> trs = (ArrayList<WebElement>) table.findElements(By.tagName("tr"));
		ArrayList<WebElement> ths = (ArrayList<WebElement>) trs.get(0).findElements(By.tagName("th"));
		int tableCol = getElementByText(ths, "Table");
		int count = trs.size();
		for(int i = 1; i < count; i++){
			ArrayList<WebElement> tds = (ArrayList<WebElement>) trs.get(i).findElements(By.tagName("td"));
			Assert.assertEquals("17", tds.get(tableCol).getText());
		}
		System.out.println("Ending test " + new Object(){}.getClass().getEnclosingMethod().getName());
	}
	
	@Test
	public void testTableHouseYieldsCorrectOutput(){
		System.out.println("Starting test " + new Object(){}.getClass().getEnclosingMethod().getName());
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.findElement(By.id("tableToggle")).click();
		WebElement tableBox = driver.findElement(By.id("Table"));
		tableBox.click();
		tableBox.sendKeys("Ledger");
		WebElement submitButton = driver.findElement(By.id("student"));
		submitButton.click();

		WebElement table = driver.findElement(By.id("schedDiv"));
		ArrayList<WebElement> trs = (ArrayList<WebElement>) table.findElements(By.tagName("tr"));
		ArrayList<WebElement> ths = (ArrayList<WebElement>) trs.get(0).findElements(By.tagName("th"));
		int tableCol = getElementByText(ths, "Table");
		int count = trs.size();
		for(int i = 1; i < count; i++){
			ArrayList<WebElement> tds = (ArrayList<WebElement>) trs.get(i).findElements(By.tagName("td"));
			Assert.assertEquals("Ledger", tds.get(tableCol).getText());
		}
		System.out.println("Ending test " + new Object(){}.getClass().getEnclosingMethod().getName());
	}
	
	@Test
	public void testADayYieldsCorrectOutput(){
		System.out.println("Starting test " + new Object(){}.getClass().getEnclosingMethod().getName());
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.findElement(By.id("tableToggle")).click();
		WebElement dayCheck = driver.findElement(By.cssSelector("#searchTable > tbody > tr:nth-child(3) > td:nth-child(2) > form > input[type=\"checkbox\"]:nth-child(1)"));
		dayCheck.click();
		WebElement submitButton = driver.findElement(By.id("student"));
		submitButton.click();

		WebElement table = driver.findElement(By.id("schedDiv"));
		ArrayList<WebElement> trs = (ArrayList<WebElement>) table.findElements(By.tagName("tr"));
		ArrayList<WebElement> ths = (ArrayList<WebElement>) trs.get(0).findElements(By.tagName("th"));
		int day = getElementByText(ths, "Day");
		int count = trs.size();
		for(int i = 1; i < count; i++){
			ArrayList<WebElement> tds = (ArrayList<WebElement>) trs.get(i).findElements(By.tagName("td"));
			Assert.assertEquals("A", tds.get(day).getText());
		}
		System.out.println("Ending test " + new Object(){}.getClass().getEnclosingMethod().getName());
	}
	
	@Test
	public void testBDayYieldsCorrectOutput(){
		System.out.println("Starting test " + new Object(){}.getClass().getEnclosingMethod().getName());
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.findElement(By.id("tableToggle")).click();
		WebElement dayCheck = driver.findElement(By.cssSelector("#searchTable > tbody > tr:nth-child(3) > td:nth-child(2) > form > input[type=\"checkbox\"]:nth-child(2)"));
		dayCheck.click();
		WebElement submitButton = driver.findElement(By.id("student"));
		submitButton.click();

		WebElement table = driver.findElement(By.id("schedDiv"));
		ArrayList<WebElement> trs = (ArrayList<WebElement>) table.findElements(By.tagName("tr"));
		ArrayList<WebElement> ths = (ArrayList<WebElement>) trs.get(0).findElements(By.tagName("th"));
		int day = getElementByText(ths, "Day");
		int count = trs.size();
		for(int i = 1; i < count; i++){
			ArrayList<WebElement> tds = (ArrayList<WebElement>) trs.get(i).findElements(By.tagName("td"));
			Assert.assertEquals("B", tds.get(day).getText());
		}
		System.out.println("Ending test " + new Object(){}.getClass().getEnclosingMethod().getName());
	}
	
	@Test
	public void testCDayYieldsCorrectOutput(){
		System.out.println("Starting test " + new Object(){}.getClass().getEnclosingMethod().getName());
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.findElement(By.id("tableToggle")).click();
		WebElement dayCheck = driver.findElement(By.cssSelector("#searchTable > tbody > tr:nth-child(3) > td:nth-child(2) > form > input[type=\"checkbox\"]:nth-child(3)"));
		dayCheck.click();
		WebElement submitButton = driver.findElement(By.id("student"));
		submitButton.click();

		WebElement table = driver.findElement(By.id("schedDiv"));
		ArrayList<WebElement> trs = (ArrayList<WebElement>) table.findElements(By.tagName("tr"));
		ArrayList<WebElement> ths = (ArrayList<WebElement>) trs.get(0).findElements(By.tagName("th"));
		int day = getElementByText(ths, "Day");
		int count = trs.size();
		for(int i = 1; i < count; i++){
			ArrayList<WebElement> tds = (ArrayList<WebElement>) trs.get(i).findElements(By.tagName("td"));
			Assert.assertEquals("C", tds.get(day).getText());
		}
		System.out.println("Ending test " + new Object(){}.getClass().getEnclosingMethod().getName());
	}
	
	@Test
	public void testDDayYieldsCorrectOutput(){
		System.out.println("Starting test " + new Object(){}.getClass().getEnclosingMethod().getName());
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.findElement(By.id("tableToggle")).click();
		WebElement dayCheck = driver.findElement(By.cssSelector("#searchTable > tbody > tr:nth-child(3) > td:nth-child(2) > form > input[type=\"checkbox\"]:nth-child(4)"));
		dayCheck.click();
		WebElement submitButton = driver.findElement(By.id("student"));
		submitButton.click();

		WebElement table = driver.findElement(By.id("schedDiv"));
		ArrayList<WebElement> trs = (ArrayList<WebElement>) table.findElements(By.tagName("tr"));
		ArrayList<WebElement> ths = (ArrayList<WebElement>) trs.get(0).findElements(By.tagName("th"));
		int day = getElementByText(ths, "Day");
		int count = trs.size();
		for(int i = 1; i < count; i++){
			ArrayList<WebElement> tds = (ArrayList<WebElement>) trs.get(i).findElements(By.tagName("td"));
			Assert.assertEquals("D", tds.get(day).getText());
		}
		System.out.println("Ending test " + new Object(){}.getClass().getEnclosingMethod().getName());
	}
	
	@Test
	public void testEDayYieldsCorrectOutput(){
		System.out.println("Starting test " + new Object(){}.getClass().getEnclosingMethod().getName());
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.findElement(By.id("tableToggle")).click();
		WebElement dayCheck = driver.findElement(By.cssSelector("#searchTable > tbody > tr:nth-child(3) > td:nth-child(2) > form > input[type=\"checkbox\"]:nth-child(5)"));
		dayCheck.click();
		WebElement submitButton = driver.findElement(By.id("student"));
		submitButton.click();

		WebElement table = driver.findElement(By.id("schedDiv"));
		ArrayList<WebElement> trs = (ArrayList<WebElement>) table.findElements(By.tagName("tr"));
		ArrayList<WebElement> ths = (ArrayList<WebElement>) trs.get(0).findElements(By.tagName("th"));
		int day = getElementByText(ths, "Day");
		int count = trs.size();
		for(int i = 1; i < count; i++){
			ArrayList<WebElement> tds = (ArrayList<WebElement>) trs.get(i).findElements(By.tagName("td"));
			Assert.assertEquals("E", tds.get(day).getText());
		}
		System.out.println("Ending test " + new Object(){}.getClass().getEnclosingMethod().getName());
	}
	
	@Test
	public void testFDayYieldsCorrectOutput(){
		System.out.println("Starting test " + new Object(){}.getClass().getEnclosingMethod().getName());
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.findElement(By.id("tableToggle")).click();
		WebElement dayCheck = driver.findElement(By.cssSelector("#searchTable > tbody > tr:nth-child(3) > td:nth-child(2) > form > input[type=\"checkbox\"]:nth-child(6)"));
		dayCheck.click();
		WebElement submitButton = driver.findElement(By.id("student"));
		submitButton.click();

		WebElement table = driver.findElement(By.id("schedDiv"));
		ArrayList<WebElement> trs = (ArrayList<WebElement>) table.findElements(By.tagName("tr"));
		ArrayList<WebElement> ths = (ArrayList<WebElement>) trs.get(0).findElements(By.tagName("th"));
		int day = getElementByText(ths, "Day");
		int count = trs.size();
		for(int i = 1; i < count; i++){
			ArrayList<WebElement> tds = (ArrayList<WebElement>) trs.get(i).findElements(By.tagName("td"));
			Assert.assertEquals("F", tds.get(day).getText());
		}
		System.out.println("Ending test " + new Object(){}.getClass().getEnclosingMethod().getName());
	}
	
	@Test
	public void testGDayYieldsCorrectOutput(){
		System.out.println("Starting test " + new Object(){}.getClass().getEnclosingMethod().getName());
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.findElement(By.id("tableToggle")).click();
		WebElement dayCheck = driver.findElement(By.cssSelector("#searchTable > tbody > tr:nth-child(3) > td:nth-child(2) > form > input[type=\"checkbox\"]:nth-child(7)"));
		dayCheck.click();
		WebElement submitButton = driver.findElement(By.id("student"));
		submitButton.click();

		WebElement table = driver.findElement(By.id("schedDiv"));
		ArrayList<WebElement> trs = (ArrayList<WebElement>) table.findElements(By.tagName("tr"));
		ArrayList<WebElement> ths = (ArrayList<WebElement>) trs.get(0).findElements(By.tagName("th"));
		int day = getElementByText(ths, "Day");
		int count = trs.size();
		for(int i = 1; i < count; i++){
			ArrayList<WebElement> tds = (ArrayList<WebElement>) trs.get(i).findElements(By.tagName("td"));
			Assert.assertEquals("G", tds.get(day).getText());
		}
		System.out.println("Ending test " + new Object(){}.getClass().getEnclosingMethod().getName());
	}
	
	@Test
	public void testHDayYieldsCorrectOutput(){
		System.out.println("Starting test " + new Object(){}.getClass().getEnclosingMethod().getName());
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.findElement(By.id("tableToggle")).click();
		WebElement dayCheck = driver.findElement(By.cssSelector("#searchTable > tbody > tr:nth-child(3) > td:nth-child(2) > form > input[type=\"checkbox\"]:nth-child(8)"));
		dayCheck.click();
		WebElement submitButton = driver.findElement(By.id("student"));
		submitButton.click();

		WebElement table = driver.findElement(By.id("schedDiv"));
		ArrayList<WebElement> trs = (ArrayList<WebElement>) table.findElements(By.tagName("tr"));
		ArrayList<WebElement> ths = (ArrayList<WebElement>) trs.get(0).findElements(By.tagName("th"));
		int day = getElementByText(ths, "Day");
		int count = trs.size();
		for(int i = 1; i < count; i++){
			ArrayList<WebElement> tds = (ArrayList<WebElement>) trs.get(i).findElements(By.tagName("td"));
			Assert.assertEquals("H", tds.get(day).getText());
		}
		System.out.println("Ending test " + new Object(){}.getClass().getEnclosingMethod().getName());
	}
	
	@Test
	public void testMultipleDaysYieldCorrectOutput(){
		System.out.println("Starting test " + new Object(){}.getClass().getEnclosingMethod().getName());
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.findElement(By.id("tableToggle")).click();
		WebElement aDayCheck = driver.findElement(By.cssSelector("#searchTable > tbody > tr:nth-child(3) > td:nth-child(2) > form > input[type=\"checkbox\"]:nth-child(1)"));
		aDayCheck.click();
		WebElement dDayCheck = driver.findElement(By.cssSelector("#searchTable > tbody > tr:nth-child(3) > td:nth-child(2) > form > input[type=\"checkbox\"]:nth-child(4)"));
		dDayCheck.click();
		WebElement submitButton = driver.findElement(By.id("student"));
		submitButton.click();

		WebElement table = driver.findElement(By.id("schedDiv"));
		ArrayList<WebElement> trs = (ArrayList<WebElement>) table.findElements(By.tagName("tr"));
		ArrayList<WebElement> ths = (ArrayList<WebElement>) trs.get(0).findElements(By.tagName("th"));
		int day = getElementByText(ths, "Day");
		int count = trs.size();
		for(int i = 1; i < count; i++){
			ArrayList<WebElement> tds = (ArrayList<WebElement>) trs.get(i).findElements(By.tagName("td"));
			Assert.assertTrue(tds.get(day).getText().equals("A") || tds.get(day).getText().equals("D"));
		}
		System.out.println("Ending test " + new Object(){}.getClass().getEnclosingMethod().getName());
	}
	
	@Test
	public void testEarlyTimeYieldsCorrectOutput(){
		System.out.println("Starting test " + new Object(){}.getClass().getEnclosingMethod().getName());
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.findElement(By.id("tableToggle")).click();
		WebElement timeCheck = driver.findElement(By.cssSelector("#searchTable > tbody > tr:nth-child(4) > td:nth-child(2) > form > input[type=\"checkbox\"]:nth-child(1)"));
		timeCheck.click();
		WebElement submitButton = driver.findElement(By.id("student"));
		submitButton.click();

		WebElement table = driver.findElement(By.id("schedDiv"));
		ArrayList<WebElement> trs = (ArrayList<WebElement>) table.findElements(By.tagName("tr"));
		ArrayList<WebElement> ths = (ArrayList<WebElement>) trs.get(0).findElements(By.tagName("th"));
		int time = getElementByText(ths, "Lunch Time");
		int count = trs.size();
		for(int i = 1; i < count; i++){
			ArrayList<WebElement> tds = (ArrayList<WebElement>) trs.get(i).findElements(By.tagName("td"));
			Assert.assertEquals("early", tds.get(time).getText());
		}
		System.out.println("Ending test " + new Object(){}.getClass().getEnclosingMethod().getName());
	}
	
	@Test
	public void testMidTimeYieldsCorrectOutput(){
		System.out.println("Starting test " + new Object(){}.getClass().getEnclosingMethod().getName());
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.findElement(By.id("tableToggle")).click();
		WebElement timeCheck = driver.findElement(By.cssSelector("#searchTable > tbody > tr:nth-child(4) > td:nth-child(2) > form > input[type=\"checkbox\"]:nth-child(2)"));
		timeCheck.click();
		WebElement submitButton = driver.findElement(By.id("student"));
		submitButton.click();

		WebElement table = driver.findElement(By.id("schedDiv"));
		ArrayList<WebElement> trs = (ArrayList<WebElement>) table.findElements(By.tagName("tr"));
		ArrayList<WebElement> ths = (ArrayList<WebElement>) trs.get(0).findElements(By.tagName("th"));
		int time = getElementByText(ths, "Lunch Time");
		int count = trs.size();
		for(int i = 1; i < count; i++){
			ArrayList<WebElement> tds = (ArrayList<WebElement>) trs.get(i).findElements(By.tagName("td"));
			Assert.assertEquals("mid", tds.get(time).getText());
		}
		System.out.println("Ending test " + new Object(){}.getClass().getEnclosingMethod().getName());
	}
	
	@Test
	public void testLateTimeYieldsCorrectOutput(){
		System.out.println("Starting test " + new Object(){}.getClass().getEnclosingMethod().getName());
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.findElement(By.id("tableToggle")).click();
		WebElement timeCheck = driver.findElement(By.cssSelector("#searchTable > tbody > tr:nth-child(4) > td:nth-child(2) > form > input[type=\"checkbox\"]:nth-child(3)"));
		timeCheck.click();
		WebElement submitButton = driver.findElement(By.id("student"));
		submitButton.click();

		WebElement table = driver.findElement(By.id("schedDiv"));
		ArrayList<WebElement> trs = (ArrayList<WebElement>) table.findElements(By.tagName("tr"));
		ArrayList<WebElement> ths = (ArrayList<WebElement>) trs.get(0).findElements(By.tagName("th"));
		int time = getElementByText(ths, "Lunch Time");
		int count = trs.size();
		for(int i = 1; i < count; i++){
			ArrayList<WebElement> tds = (ArrayList<WebElement>) trs.get(i).findElements(By.tagName("td"));
			Assert.assertEquals("late", tds.get(time).getText());
		}
		System.out.println("Ending test " + new Object(){}.getClass().getEnclosingMethod().getName());
	}
	
	@Test
	public void testMultipleTimesYieldCorrectOutput(){
		System.out.println("Starting test " + new Object(){}.getClass().getEnclosingMethod().getName());
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.findElement(By.id("tableToggle")).click();
		WebElement earlyCheck = driver.findElement(By.cssSelector("#searchTable > tbody > tr:nth-child(4) > td:nth-child(2) > form > input[type=\"checkbox\"]:nth-child(1)"));
		earlyCheck.click();
		WebElement lateCheck = driver.findElement(By.cssSelector("#searchTable > tbody > tr:nth-child(4) > td:nth-child(2) > form > input[type=\"checkbox\"]:nth-child(3)"));
		lateCheck.click();
		WebElement submitButton = driver.findElement(By.id("student"));
		submitButton.click();

		WebElement table = driver.findElement(By.id("schedDiv"));
		ArrayList<WebElement> trs = (ArrayList<WebElement>) table.findElements(By.tagName("tr"));
		ArrayList<WebElement> ths = (ArrayList<WebElement>) trs.get(0).findElements(By.tagName("th"));
		int time = getElementByText(ths, "Lunch Time");
		int count = trs.size();
		for(int i = 1; i < count; i++){
			ArrayList<WebElement> tds = (ArrayList<WebElement>) trs.get(i).findElements(By.tagName("td"));
			Assert.assertTrue(tds.get(time).getText().equals("early") || tds.get(time).getText().equals("late"));
		}
		System.out.println("Ending test " + new Object(){}.getClass().getEnclosingMethod().getName());
	}
	
	@Test
	public void testNameAndDayYieldsCorrectOutput(){
		System.out.println("Starting test " + new Object(){}.getClass().getEnclosingMethod().getName());
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		WebElement nameBox = driver.findElement(By.id("Name"));
		nameBox.click();
		nameBox.sendKeys("Frederick Lange");
		driver.findElement(By.id("tableToggle")).click();
		WebElement dayCheck = driver.findElement(By.cssSelector("#searchTable > tbody > tr:nth-child(3) > td:nth-child(2) > form > input[type=\"checkbox\"]:nth-child(3)"));
		dayCheck.click();
		WebElement submitButton = driver.findElement(By.id("student"));
		submitButton.click();

		WebElement table = driver.findElement(By.id("schedDiv"));
		ArrayList<WebElement> trs = (ArrayList<WebElement>) table.findElements(By.tagName("tr"));
		ArrayList<WebElement> ths = (ArrayList<WebElement>) trs.get(0).findElements(By.tagName("th"));
		int name = getElementByText(ths, "Name");
		int day = getElementByText(ths, "Day");
		int count = trs.size();
		for(int i = 1; i < count; i++){
			ArrayList<WebElement> tds = (ArrayList<WebElement>) trs.get(i).findElements(By.tagName("td"));
			Assert.assertTrue(tds.get(day).getText().equals("C") && tds.get(name).getText().equals("Frederick Lange"));
		}
		System.out.println("Ending test " + new Object(){}.getClass().getEnclosingMethod().getName());
	}
	
	@Test
	public void testTimeAndDayYieldsCorrectOutput(){
		System.out.println("Starting test " + new Object(){}.getClass().getEnclosingMethod().getName());
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.findElement(By.id("tableToggle")).click();
		WebElement dayCheck = driver.findElement(By.cssSelector("#searchTable > tbody > tr:nth-child(3) > td:nth-child(2) > form > input[type=\"checkbox\"]:nth-child(4)"));
		dayCheck.click();
		WebElement timeCheck = driver.findElement(By.cssSelector("#searchTable > tbody > tr:nth-child(4) > td:nth-child(2) > form > input[type=\"checkbox\"]:nth-child(1)"));
		timeCheck.click();
		WebElement submitButton = driver.findElement(By.id("student"));
		submitButton.click();

		WebElement table = driver.findElement(By.id("schedDiv"));
		ArrayList<WebElement> trs = (ArrayList<WebElement>) table.findElements(By.tagName("tr"));
		ArrayList<WebElement> ths = (ArrayList<WebElement>) trs.get(0).findElements(By.tagName("th"));
		int time = getElementByText(ths, "Lunch Time");
		int day = getElementByText(ths, "Day");
		int count = trs.size();
		for(int i = 1; i < count; i++){
			ArrayList<WebElement> tds = (ArrayList<WebElement>) trs.get(i).findElements(By.tagName("td"));
			Assert.assertTrue(tds.get(day).getText().equals("D") && tds.get(time).getText().equals("early"));
		}
		System.out.println("Ending test " + new Object(){}.getClass().getEnclosingMethod().getName());
	}
	
	@Test
	public void testTableNumberAndDayYieldsCorrectOutput(){
		System.out.println("Starting test " + new Object(){}.getClass().getEnclosingMethod().getName());
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.findElement(By.id("tableToggle")).click();
		WebElement dayCheck = driver.findElement(By.cssSelector("#searchTable > tbody > tr:nth-child(3) > td:nth-child(2) > form > input[type=\"checkbox\"]:nth-child(5)"));
		dayCheck.click();
		WebElement tableBox = driver.findElement(By.id("Table"));
		tableBox.click();
		tableBox.sendKeys("5");
		WebElement submitButton = driver.findElement(By.id("student"));
		submitButton.click();

		WebElement table = driver.findElement(By.id("schedDiv"));
		ArrayList<WebElement> trs = (ArrayList<WebElement>) table.findElements(By.tagName("tr"));
		ArrayList<WebElement> ths = (ArrayList<WebElement>) trs.get(0).findElements(By.tagName("th"));
		int tableCol = getElementByText(ths, "Table");
		int day = getElementByText(ths, "Day");
		int count = trs.size();
		for(int i = 1; i < count; i++){
			ArrayList<WebElement> tds = (ArrayList<WebElement>) trs.get(i).findElements(By.tagName("td"));
			Assert.assertTrue(tds.get(day).getText().equals("E") && tds.get(tableCol).getText().equals("5"));
		}
		System.out.println("Ending test " + new Object(){}.getClass().getEnclosingMethod().getName());
	}
	
	@Test
	public void testTableHouseAndDayYieldsCorrectOutput(){
		System.out.println("Starting test " + new Object(){}.getClass().getEnclosingMethod().getName());
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.findElement(By.id("tableToggle")).click();
		WebElement dayCheck = driver.findElement(By.cssSelector("#searchTable > tbody > tr:nth-child(3) > td:nth-child(2) > form > input[type=\"checkbox\"]:nth-child(5)"));
		dayCheck.click();
		WebElement tableBox = driver.findElement(By.id("Table"));
		tableBox.click();
		tableBox.sendKeys("Arrow");
		WebElement submitButton = driver.findElement(By.id("student"));
		submitButton.click();

		WebElement table = driver.findElement(By.id("schedDiv"));
		ArrayList<WebElement> trs = (ArrayList<WebElement>) table.findElements(By.tagName("tr"));
		ArrayList<WebElement> ths = (ArrayList<WebElement>) trs.get(0).findElements(By.tagName("th"));
		int tableCol = getElementByText(ths, "Table");
		int day = getElementByText(ths, "Day");
		int count = trs.size();
		for(int i = 1; i < count; i++){
			ArrayList<WebElement> tds = (ArrayList<WebElement>) trs.get(i).findElements(By.tagName("td"));
			Assert.assertTrue(tds.get(day).getText().equals("E") && tds.get(tableCol).getText().equals("Arrow"));
		}
		System.out.println("Ending test " + new Object(){}.getClass().getEnclosingMethod().getName());
	}
	
	@Test
	public void testBadNameYieldsNoOutput(){
		System.out.println("Starting test " + new Object(){}.getClass().getEnclosingMethod().getName());
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		WebElement nameBox = driver.findElement(By.id("Name"));
		nameBox.click();
		nameBox.sendKeys("ABCDEFG");
		WebElement submitButton = driver.findElement(By.id("student"));
		submitButton.click();

		WebElement table = driver.findElement(By.id("schedDiv"));
		ArrayList<WebElement> trs = (ArrayList<WebElement>) table.findElements(By.tagName("tr"));
		int count = trs.size();
		Assert.assertTrue(count == 0);
		Assert.assertEquals(table.getText(), "Invalid Search. No Results Found.");
		System.out.println("Ending test " + new Object(){}.getClass().getEnclosingMethod().getName());
	}
	
	@Test
	public void testBadTableYieldsNoOutput(){
		System.out.println("Starting test " + new Object(){}.getClass().getEnclosingMethod().getName());
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.findElement(By.id("tableToggle")).click();
		WebElement tableBox = driver.findElement(By.id("Table"));
		tableBox.click();
		tableBox.sendKeys("ABCDEFG");
		WebElement submitButton = driver.findElement(By.id("student"));
		submitButton.click();

		WebElement table = driver.findElement(By.id("schedDiv"));
		ArrayList<WebElement> trs = (ArrayList<WebElement>) table.findElements(By.tagName("tr"));
		int count = trs.size();
		Assert.assertTrue(count == 0);
		Assert.assertEquals(table.getText(), "Invalid Search. No Results Found.");
		System.out.println("Ending test " + new Object(){}.getClass().getEnclosingMethod().getName());
	}
	
	@Test
	public void testPartialNameInputYieldsAllCorrectOutputs(){
		System.out.println("Starting test " + new Object(){}.getClass().getEnclosingMethod().getName());
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		String partialName = "Mar";
		WebElement nameBox = driver.findElement(By.id("Name"));
		nameBox.click();
		nameBox.sendKeys(partialName);
		WebElement submitButton = driver.findElement(By.id("student"));
		submitButton.click();

		WebElement table = driver.findElement(By.id("schedDiv"));
		ArrayList<WebElement> trs = (ArrayList<WebElement>) table.findElements(By.tagName("tr"));
		ArrayList<WebElement> ths = (ArrayList<WebElement>) trs.get(0).findElements(By.tagName("th"));
		int name = getElementByText(ths, "Name");
		int count = trs.size();
		boolean check = true;
		for(int i = 1; i < count; i++){
			ArrayList<WebElement> tds = (ArrayList<WebElement>) trs.get(i).findElements(By.tagName("td"));
			if(!tds.get(name).getText().toLowerCase().contains(partialName.toLowerCase())){
				check = false;
				i = count;
			}
		}
		Assert.assertTrue(check);
		System.out.println("Ending test " + new Object(){}.getClass().getEnclosingMethod().getName());
	}
	
	@Test
	public void testHTMLYieldsNothing(){
		System.out.println("Starting test " + new Object(){}.getClass().getEnclosingMethod().getName());
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		driver.switchTo().frame(0);
		WebElement nameBox = driver.findElement(By.id("Name"));
		nameBox.click();
		nameBox.sendKeys("<img src=\"http://seprof.sebern.com/sebern1.jpg\">");
		WebElement submitButton = driver.findElement(By.id("student"));
		submitButton.click();

		WebElement table = driver.findElement(By.id("nameDiv"));
		ArrayList<WebElement> h1s = (ArrayList<WebElement>) table.findElements(By.tagName("h1"));
		int count = h1s.size();
		for(int i = 0; i < count; i++){
			Assert.assertEquals("Invalid Name", h1s.get(i).getText());
		}
		System.out.println("Ending test " + new Object(){}.getClass().getEnclosingMethod().getName());
	}
	
	@AfterMethod
	public void closeBrowser(){
		driver.quit();
	}
	
	public int getElementByText(ArrayList<WebElement> list, String text){
		for(int i = 0; i < list.size(); i++){
			if(list.get(i).getText().equals(text)){
				return i;
			}
		}
		return -1;
	}
}