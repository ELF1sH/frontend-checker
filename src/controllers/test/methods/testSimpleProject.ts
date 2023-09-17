import { Request, Response } from 'express';
import { Builder, Capabilities, until } from 'selenium-webdriver';

export const testSimpleProject = async (req: Request, res: Response) => {
  // const driver = await new Builder().forBrowser(Browser.CHROME).build();

  const capabilities = Capabilities.chrome();
  const driver = new Builder()
    .usingServer('http://selenium-hub:4444/wd/hub')
    .withCapabilities(capabilities)
    .build();

  try {
    await driver.get('http://project-to-test:8080/');
    await driver.wait(until.titleIs('Document'), 10000);

    return res.status(200).send({ message: 'OK' });
  } catch (e) {
    console.log(e);

    return res.status(500).send(e);
  } finally {
    await driver.quit();
  }
};
