import { Request, Response } from 'express';
import {
  Browser, Builder, By, Key, until,
} from 'selenium-webdriver';

// TESTING LOGIN USE CASE
const testCase1 = `
  async (driver, Browser, Builder, By, Key, until) => {
    await driver.findElement(By.id('username')).sendKeys('admin', Key.TAB);
    await driver.findElement(By.id('password')).sendKeys('admin', Key.TAB, Key.ENTER);
    
    await driver.sleep(1000);

    await driver.findElement(By.xpath('//h2[contains(text(),\\'Классы\\')]'));
  };
`;

// TESTING LOGIN + TESTING SIDEBAR LINK BY OPENING A PAGE WITH CHECKERS LIST
const testCase2 = `
  async (driver, Browser, Builder, By, Key, until) => {
    await driver.findElement(By.id('username')).sendKeys('admin', Key.TAB);
    await driver.findElement(By.id('password')).sendKeys('admin', Key.TAB, Key.ENTER);

    await driver.sleep(1000);
    await driver.findElement(By.xpath('//h2[contains(text(),\\'Классы\\')]'));
    
    const checkersLink = await driver.findElement(By.xpath('//*[contains(text(),\\'Чекеры\\')]'));
    await checkersLink.click();
    await driver.sleep(1000);
    await driver.findElement(By.xpath('//*[contains(text(),\\'some-checher-name-10\\')]'));
  };
`;

// JUST CHECKING THE TITLE OF A TAB
const testCase3 = `
  async (driver, Browser, Builder, By, Key, until) => {
    await driver.wait(until.titleIs('React App'), 3000);
  };
`;

const testCases = [testCase1, testCase2, testCase3];

// PARALLEL TESTING
export const testTaskBank = async (req: Request, res: Response) => {
  const promises = testCases.map((testCase, idx) => new Promise<void>((resolve, reject) => {
    // const capabilities = Capabilities.chrome();
    //
    // const driver = new Builder()
    //   .usingServer('http://selenium-hub:4444/wd/hub')
    //   .withCapabilities(capabilities)
    //   .build();

    new Builder().forBrowser(Browser.CHROME).build().then((driver) => {
    // new Promise<void>((r) => { r(); }).then(() => {
      // driver.get('http://localhost:3000/').then(() => {
      driver.get('http://project-to-test:8080/').then(() => {
        const cb = eval(testCase);

        cb(driver, Browser, Builder, By, Key, until)
          .then(() => {
            resolve();
            driver.quit();
          })
          .catch((e: Record<string, any>) => {
            e.testCase = idx + 1;

            reject(e);
            driver.quit();
          });
      });
    });
  }));

  const results = await Promise.allSettled(promises);
  results.forEach((result) => {
    if (result.status === 'rejected') {
      return res.status(500).send(result.reason);
    }
  });

  res.status(200).send({ message: 'OK' });
};

// SEQUENTIAL TESTING
// export const testTaskBank = async (req: Request, res: Response) => {
//   // const capabilities = Capabilities.chrome();
//   // const driver = new Builder()
//   //   .usingServer('http://selenium-hub:4444/wd/hub')
//   //   .withCapabilities(capabilities)
//   //   .build();
//
//   const driver = await new Builder().forBrowser(Browser.CHROME).build();
//
//   for (let i = 0; i < testCases.length; i += 1) {
//     const testCase = testCases[i];
//
//     try {
//       // await driver.get('http://project-to-test:8080/');
//       await driver.get('http://localhost:3000/');
//
//       const cb = eval(testCase);
//       await cb(driver, Browser, Builder, By, Key, until);
//     } catch (e: any) {
//       e.testCase = i + 1;
//
//       await driver.quit();
//       return res.status(500).send(e);
//     }
//   }
//
//   await driver.quit();
//
//   res.status(200).send({ message: 'OK' });
// };
