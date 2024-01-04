import { Request, Response } from 'express';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

import fs from 'fs';
import {
  Browser, Builder, By, Key, until,
} from 'selenium-webdriver';
import { getFullScreenBuffer } from '../../../services/getFullScreenBuffer';
import { getDriver } from '../../../services/getDriver';
import { ITestCaseResult } from '../../../types/ITestCaseResult';

const testCase1 = `
  async (driver, Browser, Builder, By, Key, until) => {
    await driver.findElement(By.xpath('//div[contains(text(),\\'Personal Cards\\')]'));
  };
`;

const testCases = [testCase1];

export const test = async (req: Request, res: Response) => {
  const refSolutionDriver = await getDriver();
  const attemptDriver = await getDriver();

  const THRESHOLD = req.body.threshold ?? 0.2;

  const result: ITestCaseResult[] = [];

  for (let testCaseIdx = 0; testCaseIdx < testCases.length; testCaseIdx += 1) {
    const testCase = testCases[testCaseIdx];

    try {
      // await driver.get('http://reference-solution:8080/');
      await refSolutionDriver.get('https://test-2-reference-solution.pages.dev/');
      await attemptDriver.get('https://test-1-attempt-1.pages.dev/');

      const cb = eval(testCase);
      await cb(refSolutionDriver, Browser, Builder, By, Key, until);

      const {
        buffer: refSolutionScreenshotBuffer,
        width: refSolutionWidth,
        height: refSolutionHeight,
      } = await getFullScreenBuffer(refSolutionDriver);

      const {
        buffer: attemptScreenshotBuffer,
        width: attemptWidth,
        height: attemptHeight,
      } = await getFullScreenBuffer(attemptDriver, refSolutionHeight);

      const width = Math.max(refSolutionWidth, attemptWidth);
      const height = Math.max(refSolutionHeight, attemptHeight);

      const diff = new PNG({ width, height });

      const mismatchedPixels = pixelmatch(
        refSolutionScreenshotBuffer,
        attemptScreenshotBuffer,
        diff.data,
        width,
        height,
        {
          threshold: THRESHOLD,
        },
      );

      // const sum = diff.data.reduce((prev, cur) => prev + cur, 0);
      // const totalSum = diff.data.length * 255;
      // console.log('diff = ', sum / totalSum);
      // const diffedPixelsPercent = diffedPixels.map((rgb) => rgb / 255); // [0, 1]
      //
      // console.log('max = ', Math.max(...diffedPixels));

      fs.writeFileSync('diff4.png', PNG.sync.write(diff));

      result.push({
        testCaseNumber: testCaseIdx + 1,
        status: 'OK',
        mismatchedPixels,
        pixelsTotal: diff.data.length,
        differenceRatio: mismatchedPixels / diff.data.length,
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
