import { Request, Response } from 'express';
import {
  Browser, Builder, By, Capabilities, Key, until,
} from 'selenium-webdriver';

// TESTING LOGIN USE CASE
const testCase1 = `
  async (driver, Browser, Builder, By, Key, until) => {
    await driver.findElement(By.xpath('//h1[contains(text(),\\'Hello world\\')]'));
  };
`;

const testCases = [testCase1];

export const test = async (req: Request, res: Response) => {
  const capabilities = Capabilities.chrome();
  const driver = new Builder()
    .usingServer('http://selenium-hub:4444/wd/hub')
    .withCapabilities(capabilities)
    .build();

  // const driver = await new Builder().forBrowser(Browser.CHROME).build();

  for (let i = 0; i < testCases.length; i += 1) {
    const testCase = testCases[i];

    try {
      // await driver.get('http://reference-solution:8080/');
      await driver.get('https://asdf-64r.pages.dev/');

      const cb = eval(testCase);
      await cb(driver, Browser, Builder, By, Key, until);
    } catch (e: any) {
      e.testCase = i + 1;

      await driver.quit();
      return res.status(500).send(e);
    }
  }

  await driver.quit();

  res.status(200).send({ message: 'OK' });
};
