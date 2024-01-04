export interface ITestCaseResult {
  testCaseNumber: number;
  status: string;
  thresholdUsed: number;
  mismatchedPixels?: number;
  pixelsTotal?: number;
  differenceRatio?: number;
  reason?: string;
}
