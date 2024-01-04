import { Browser, Builder } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';

export const getDriver = async () => {
  const driver = await new Builder().setChromeOptions(new Options().windowSize({
    width: 1920,
    height: 1080,
  })).forBrowser(Browser.CHROME).build();

  await driver.manage().window().setRect({ width: 1920, height: 1080 });

  return driver;
};
