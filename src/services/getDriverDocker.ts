import { Builder, Capabilities } from 'selenium-webdriver';

// TODO: not sure whether setting resolution works or not (haven't tested it yet)
export const getDriverDocker = async () => {
  const capabilities = Capabilities.chrome();

  const chromeOptions = {
    args: ['window-size=1920,1080'],
  };
  capabilities.set('chromeOptions', chromeOptions);

  const driver = new Builder()
    .usingServer('http://selenium-hub:4444/wd/hub')
    .withCapabilities(capabilities)
    .build();

  await driver.manage().window().setRect({ width: 1920, height: 1080 });

  return driver;
};
