import { Browser, Builder, Capabilities } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import { IDriverParams } from '../types/IDriverParams';

const DEFAULT_WINDOW_WIDTH = 1920;
const DEFAULT_WINDOW_HEIGHT = 1080;

const BROWSER_APP_BAR_DOCKER = 118;
const BROWSER_APP_BAR_WINDOWS = 122;

const BROWSER_WINDOW_BORDER_DOCKER = 8;
const BROWSER_WINDOW_BORDER_WINDOWS = 16;

// await driver.manage().window().setRect({ width: 800, height: 800 });

export const getDriver = async (params?: IDriverParams) => {
  const { width = DEFAULT_WINDOW_WIDTH, height = DEFAULT_WINDOW_HEIGHT } = params ?? {};

  const adjustedWidth = width + BROWSER_WINDOW_BORDER_WINDOWS;
  const adjustedHeight = height + BROWSER_APP_BAR_WINDOWS + BROWSER_WINDOW_BORDER_WINDOWS;

  const driver = await new Builder()
    .setChromeOptions(new Options().windowSize({ width: adjustedWidth, height: adjustedHeight }))
    .forBrowser(Browser.CHROME)
    .build();

  await driver.manage().window().setRect({ width: adjustedWidth, height: adjustedHeight });

  return driver;
};

export const getDriverDocker = async (params?: IDriverParams) => {
  const { width = DEFAULT_WINDOW_WIDTH, height = DEFAULT_WINDOW_HEIGHT } = params ?? {};

  const adjustedWidth = width + BROWSER_WINDOW_BORDER_DOCKER;
  const adjustedHeight = height + BROWSER_APP_BAR_DOCKER + BROWSER_WINDOW_BORDER_DOCKER;

  const capabilities = Capabilities.chrome();

  const chromeOptions = {
    args: ['--disable-gpu', '--headless', `window-size=${adjustedWidth},${adjustedHeight}`],
  };
  capabilities.set('chromeOptions', chromeOptions);

  const driver = await new Builder()
    .usingServer('http://selenium-hub:4444/wd/hub')
    .withCapabilities(capabilities)
    .build();

  await driver.manage().window().setRect({ width: adjustedWidth, height: adjustedHeight });

  return driver;
};
