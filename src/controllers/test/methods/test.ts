import { Request, Response } from 'express';

import {
  Browser, Builder, By, Key, until,
} from 'selenium-webdriver';
import Jimp from 'jimp';
import { getFullPageScreenshot } from '../../../services/getFullPageScreenshot';
import { getDriver } from '../../../services/getDriver';
import { ITestCaseResult } from '../../../types/ITestCaseResult';

const testCase1 = `
  async (driver, Browser, Builder, By, Key, until) => {
    await driver.findElement(By.xpath('//div[contains(text(),\\'Personal Cards\\')]'));
  };
`;

const testCases = [testCase1];

export const test = async (req: Request, res: Response) => {
  const THRESHOLD = req.body.threshold ?? 0.2;
  const { windowWidth, windowHeight } = req.body;

  const refSolutionDriver = await getDriver({ width: windowWidth, height: windowHeight });
  const attemptDriver = await getDriver({ width: windowWidth, height: windowHeight });

  const result: ITestCaseResult[] = [];

  for (let testCaseIdx = 0; testCaseIdx < testCases.length; testCaseIdx += 1) {
    const testCase = testCases[testCaseIdx];

    try {
      // await driver.get('http://reference-solution:8080/');
      await refSolutionDriver.get('https://test-2-reference-solution.pages.dev/');
      // await attemptDriver.get('https://test-1-attempt-1.pages.dev/');
      await attemptDriver.get('https://test-1-attempt-2.pages.dev/');

      const cb = eval(testCase);
      await cb(refSolutionDriver, Browser, Builder, By, Key, until);
      await cb(attemptDriver, Browser, Builder, By, Key, until);

      const { jimp: refSolutionScreenshotJimp } = await getFullPageScreenshot(refSolutionDriver);
      const { jimp: attemptScreenshotJimp } = await getFullPageScreenshot(attemptDriver);

      const diffReturn = Jimp.diff(
        refSolutionScreenshotJimp,
        attemptScreenshotJimp,
        THRESHOLD,
      );

      refSolutionScreenshotJimp.write('ref1.png');
      attemptScreenshotJimp.write('attempt1.png');
      diffReturn.image.write('diff1.png');

      const distance = Jimp.distance(refSolutionScreenshotJimp, attemptScreenshotJimp);

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
