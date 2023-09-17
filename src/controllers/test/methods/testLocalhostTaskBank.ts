import { Request, Response } from 'express';
import {
  Browser, Builder, By, Key, until,
} from 'selenium-webdriver';

export const testLocalhostTaskBank = async (req: Request, res: Response) => {
  const driver = await new Builder().forBrowser(Browser.CHROME).build();

  try {
    let headerText = '';

    await driver.get('project-to-test:8080');

    await driver.findElement(By.id('username')).sendKeys('admin', Key.TAB);
    await driver.findElement(By.id('password')).sendKeys('admin', Key.TAB, Key.ENTER);

    // const h = await driver.wait(until.elementLocated(By.css('h2.ant-typography[innerText=\'Классы\']')), 3000);
    const h = await driver.wait(until.elementLocated(By.xpath('//h2[contains(text(),\'Классы\')]')), 3000);
    headerText = await h.getText();

    return res.status(200).send({ message: headerText });
  } catch (e) {
    console.log(e);

    return res.status(500).send(e);
  } finally {
    await driver.quit();
  }
};
