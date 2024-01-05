import { Request, Response } from 'express';

import {
  Browser, Builder, By, Key, until,
} from 'selenium-webdriver';
import Jimp from 'jimp';
import { getFullPageScreenshot } from '../../../services/getFullPageScreenshot';
import { getDriver } from '../../../services/getDriver';
import { ITestCaseResult } from '../../../types/ITestCaseResult';

const testCase1 = `
  async (driver, Browser, Builder, By, Key, until) => {};
`;

const testCases = [testCase1];

export const test2 = async (req: Request, res: Response) => {
  const refSolutionDriver = await getDriver();
  const attemptDriver = await getDriver();

  const THRESHOLD = req.body.threshold ?? 0.2;

  const result: ITestCaseResult[] = [];

  for (let testCaseIdx = 0; testCaseIdx < testCases.length; testCaseIdx += 1) {
    const testCase = testCases[testCaseIdx];

    try {
      // await driver.get('http://reference-solution:8080/');
      await refSolutionDriver.get('https://test-2-reference-solution-eyh.pages.dev/');
      await attemptDriver.get('https://test-2-attempt-1.pages.dev/');

      const cb = eval(testCase);
      await cb(refSolutionDriver, Browser, Builder, By, Key, until);

      const { jimp: refSolutionScreenshotJimp } = await getFullPageScreenshot(refSolutionDriver);
      const { jimp: attemptScreenshotJimp } = await getFullPageScreenshot(attemptDriver);

      const diffReturn = Jimp.diff(
        refSolutionScreenshotJimp,
        attemptScreenshotJimp,
        THRESHOLD,
      );

      refSolutionScreenshotJimp.write('ref2.png');
      attemptScreenshotJimp.write('attempt2.png');
      diffReturn.image.write('diff2.png');

      const distance = Jimp.distance(refSolutionScreenshotJimp, attemptScreenshotJimp);

      // diffReturn.image.write('jimp.png');

      // const diff = new PNG({ width, height });
      //
      // const mismatchedPixels = pixelmatch(
      //   refSolutionScreenshotBuffer,
      //   attemptScreenshotBuffer,
      //   diff.data,
      //   width,
      //   height,
      //   {
      //     threshold: THRESHOLD,
      //   },
      // );

      // const sum = diff.data.reduce((prev, cur) => prev + cur, 0);
      // const totalSum = diff.data.length * 255;
      // console.log('diff = ', sum / totalSum);
      // const diffedPixelsPercent = diffedPixels.map((rgb) => rgb / 255); // [0, 1]
      //
      // console.log('max = ', Math.max(...diffedPixels));

      // fs.writeFileSync('diff1.png', PNG.sync.write(diff));

      result.push({
        testCaseNumber: testCaseIdx + 1,
        status: 'OK',
        differenceRatio: diffReturn.percent,
        distance,
        thresholdUsed: THRESHOLD,
      });
    } catch (e: any) {
      result.push({
        testCaseNumber: testCaseIdx + 1,
        status: 'ERROR',
        thresholdUsed: THRESHOLD,
        reason: e.toString(),
      });
    }
  }

  await refSolutionDriver.quit();
  await attemptDriver.quit();

  res.status(200).send({ result });
};
