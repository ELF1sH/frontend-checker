import { Request, Response } from 'express';
import {
  Browser, Builder, By, Capabilities, Key, until,
} from 'selenium-webdriver';

// TESTING LOGIN USE CASE
const testCase1 = `
  async (driver, Browser, Builder, By, Key, until) => {
    await driver.findElement(By.id('username')).sendKeys('admin', Key.TAB);
    await driver.findElement(By.id('password')).sendKeys('admin', Key.TAB, Key.ENTER);
    
    await driver.wait(until.elementLocated(By.xpath('//h2[contains(text(),\\'Классы\\')]')), 3000);
  };
`;

// TESTING LOGIN + TESTING SIDEBAR LINK BY OPENING A PAGE WITH CHECKERS LIST
const testCase2 = `
  async (driver, Browser, Builder, By, Key, until) => {
    await driver.findElement(By.id('username')).sendKeys('admin', Key.TAB);
    await driver.findElement(By.id('password')).sendKeys('admin', Key.TAB, Key.ENTER);
    await driver.wait(until.elementLocated(By.xpath('//h2[contains(text(),\\'Классы\\')]')), 3000);

    const checkersLink = await driver.wait(until.elementLocated(By.xpath('//*[contains(text(),\\'Чекеры\\')]')), 3000);
    await checkersLink.click();
    await driver.wait(until.elementLocated(By.xpath('//*[contains(text(),\\'some-checher-name-10\\')]')), 3000);
  };
`;

// JUST CHECKING THE TITLE OF A TAB
const testCase3 = `
  async (driver, Browser, Builder, By, Key, until) => {
    await driver.wait(until.titleIs('React App'), 3000);
  };
`;

const testCases = [testCase1, testCase2, testCase3];

export const testTaskBank = async (req: Request, res: Response) => {
  // const driver = await new Builder().forBrowser(Browser.CHROME).build();

  const capabilities = Capabilities.chrome();

  const driver = new Builder()
    .usingServer('http://selenium-hub:4444/wd/hub')
    .withCapabilities(capabilities)
    .build();

  for (const testCase of testCases) {
    try {
      await driver.get('http://project-to-test:8080/');

      const cb = eval(testCase);
      await cb(driver, Browser, Builder, By, Key, until);
    } catch (e) {
      console.log(e);

      await driver.quit();
      return res.status(500).send(e);
    }
  }

  await driver.quit();
  return res.status(200).send({ message: 'OK' });
};
