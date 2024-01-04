import { WebDriver } from 'selenium-webdriver';
import sharp from 'sharp';
import joinImages from 'join-images';
import { Buffer } from 'buffer';

export const getFullScreenBuffer = async (driver: WebDriver, desiredHeight?: number) => {
  const totalHeight = await driver.executeScript('return document.documentElement.scrollHeight') as number;
  const windowHeight = await driver.executeScript('return window.innerHeight') as number;
  const windowWidth = await driver.executeScript('return window.innerWidth') as number;

  // console.log('--------------');
  // console.log(totalHeight);
  // console.log(windowHeight);
  // console.log(windowWidth);
  // console.log('--------------');

  let currentScroll = 0;
  const images: (Buffer)[] = [];

  while (currentScroll < totalHeight) {
    const image = await driver.takeScreenshot();

    images.push(Buffer.from(image, 'base64'));
    currentScroll += windowHeight;

    await driver.executeScript(`window.scrollTo(0, ${currentScroll})`);
  }

  const croppedBuffer = await sharp(images.at(-1))
    .extract({
      width: windowWidth,
      height: totalHeight % windowHeight,
      top: windowHeight - (totalHeight % windowHeight),
      left: 0,
    })
    .toBuffer();

  images.splice(-1, 1, croppedBuffer);

  let fullPageScreenshot = await joinImages(images);

  if (desiredHeight && desiredHeight !== totalHeight) {
    fullPageScreenshot = fullPageScreenshot
      .resize(windowWidth, desiredHeight, {
        fit: 'contain',
        position: 'left top',
      });
  }

  return {
    buffer: await fullPageScreenshot.toBuffer(),
    width: windowWidth,
    height: totalHeight,
  };
};
