import { Minus, Pause, Play, Timer } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { AlgorithmItem } from "@/types/type";

const algorithmTypes = ["naive", "kmp", "boyer-moore", "aho-corasick"];

export default function AlgorithmControls({
  algo,
  updateAlgorithm,
  toggleAlgorithm,
  removeAlgorithm,
  handleAlgorithmChange,
  algorithms,
}: {
  algo: AlgorithmItem;
  updateAlgorithm: (id: number, updates: Partial<AlgorithmItem>) => void;
  toggleAlgorithm: (id: number) => void;
  removeAlgorithm: (id: number) => void;
  handleAlgorithmChange: (id: number, value: string) => void;
  algorithms: AlgorithmItem[];
}) {
  const algorithmName = algo.algorithm ? algo.algorithm.name : "";

  const measureRuntime = () => {
    if (!algo.algorithm) {
      console.warn("No algorithm selected. Cannot measure runtime.");
      return;
    }
    if (!algo.algorithm.pattern || !algo.algorithm.text) {
      console.warn("No text or pattern set. Cannot measure runtime.");
      return;
    }
    const start = performance.now();
    algo.algorithm.runFullAlgorithm();
    const end = performance.now();
    console.log(`Runtime for ${algo.algorithm.name}: ${end - start} ms`);
  };

  return (
    <div className="flex items-center space-x-2">
      <Select
        value={algorithmName}
        onValueChange={(value) => handleAlgorithmChange(algo.id, value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select algorithm" />
        </SelectTrigger>
        <SelectContent>
          {algorithmTypes.map((algoType) => (
            <SelectItem key={algoType} value={algoType}>
              {algoType.charAt(0).toUpperCase() + algoType.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        placeholder="Search pattern"
        value={algo.algorithm ? algo.algorithm.pattern : ""}
        onChange={(e) => {
          if (algo.algorithm) {
            algo.algorithm.setPattern(e.target.value);
            updateAlgorithm(algo.id, { algorithm: algo.algorithm });
          }
        }}
        className="w-[180px]"
      />
      <Button
        variant="outline"
        size="icon"
        onClick={() => toggleAlgorithm(algo.id)}
        disabled={!algo.algorithm}>
        {algo.isRunning ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => removeAlgorithm(algo.id)}
        disabled={algorithms.length === 1}>
        <Minus className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={measureRuntime}
        disabled={!algo.algorithm}>
        <Timer className="h-4 w-4" />
      </Button>
    </div>
  );
}
