export interface ITestCaseResult {
  testCaseNumber: number;
  status: string;
  thresholdUsed: number;
  distance?: number;
  differenceRatio?: number;
  reason?: string;
}
