import { MyAlgorithm } from "./MyAlgorithm";

type AlHighlight = { start: number; end: number; color: string };
type AlgorithmItem = {
  id: number;
  algorithm: MyAlgorithm | null;
  isRunning: boolean;
}