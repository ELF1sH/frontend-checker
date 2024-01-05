import { WebDriver } from 'selenium-webdriver';
import { Buffer } from 'buffer';
import Jimp from 'jimp';

interface FullScreenBuffer {
  jimp: Jimp;
  width: number;
  height: number;
}

export const getFullPageScreenshot = async (driver: WebDriver): Promise<FullScreenBuffer> => {
  const totalHeight = await driver.executeScript('return document.documentElement.scrollHeight') as number;
  const windowHeight = await driver.executeScript('return window.innerHeight') as number;
  const windowWidth = await driver.executeScript('return window.innerWidth') as number;

  // console.log('--------------');
  // console.log(totalHeight);
  // console.log(windowHeight);
  // console.log(windowWidth);
  // console.log('--------------');

  if (totalHeight <= windowHeight) {
    const image = await driver.takeScreenshot();
    const buffer = Buffer.from(image, 'base64');

    return {
      jimp: await Jimp.read(buffer),
      width: windowWidth,
      height: totalHeight,
    };
  }

  let currentScroll = 0;
  const images: Jimp[] = [];

  while (currentScroll < totalHeight) {
    const image = await driver.takeScreenshot();
    const buffer = Buffer.from(image, 'base64');

    images.push(await Jimp.read(buffer));
    currentScroll += windowHeight;

    await driver.executeScript(`window.scrollTo(0, ${currentScroll})`);
  }

  const croppedJimp = images.at(-1)!.crop(
    0,
    windowHeight - (totalHeight % windowHeight),
    windowWidth,
    totalHeight % windowHeight,
  );
  images.splice(-1, 1, croppedJimp);

  const fullPageScreenshot = new Jimp(windowWidth, totalHeight);

  for (let i = 0; i < images.length; i += 1) {
    fullPageScreenshot.composite(images[i], 0, i * windowHeight);
  }

  return {
    jimp: fullPageScreenshot,
    width: windowWidth,
    height: totalHeight,
  };
};
