import { Request, Response } from 'express';
import { Builder, Capabilities, until } from 'selenium-webdriver';

export const testGoogle = async (req: Request, res: Response) => {
  // remote web driver https://www.selenium.dev/documentation/webdriver/drivers/remote_webdriver/

  // const driver = await new Builder().forBrowser(Browser.CHROME).build();

  const capabilities = Capabilities.chrome();

  const driver = new Builder()
    // .usingServer('http://localhost:4444/wd/hub')
    .usingServer('http://selenium-hub:4444/wd/hub')
    // .usingServer('http://localhost:4444/')
    .withCapabilities(capabilities)
    .build();

  try {
    // await driver.get('http://host.docker.internal:8080/');
    // await driver.get('https://www.google.com/');
    await driver.get('http://project-to-test:8080/');
    // await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
    await driver.wait(until.titleIs('Document'), 10000);

    return res.status(200).send({ message: 'OK' });
  } catch (e) {
    console.log(e);

    return res.status(500).send(e);
  } finally {
    await driver.quit();
  }
};
