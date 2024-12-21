import { MyAlgorithm } from "./MyAlgorithm";

type AlHighlight = { start: number; end: number; color: string };
export interface AlgorithmItem {
  id: number;
  algorithm: MyAlgorithm | null;
  isRunning: boolean;
  startTime: number | null;
  elapsedTime: number;
}