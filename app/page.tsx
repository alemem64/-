"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Minus, Play, Pause } from "lucide-react";

type Algorithm = "naive" | "kmp" | "boyer-moore";
type AlgorithmItem = {
  id: number;
  algorithm: Algorithm;
  pattern: string;
  isRunning: boolean;
  highlights: { start: number; end: number; color: string }[];
};

const algorithmTypes: Algorithm[] = ["naive", "kmp", "boyer-moore"];
const highlightColors = ["yellow", "lime", "cyan", "magenta", "orange"];

export default function TextSearchSimulator() {
  const [text, setText] = useState("");
  const [algorithms, setAlgorithms] = useState<AlgorithmItem[]>([
    {
      id: 1,
      algorithm: "naive",
      pattern: "",
      isRunning: false,
      highlights: [],
    },
  ]);

  const addAlgorithm = () => {
    const newId = Math.max(...algorithms.map((a) => a.id), 0) + 1;
    setAlgorithms([
      ...algorithms,
      {
        id: newId,
        algorithm: "naive",
        pattern: "",
        isRunning: false,
        highlights: [],
      },
    ]);
  };

  const removeAlgorithm = (id: number) => {
    if (algorithms.length > 1) {
      setAlgorithms(algorithms.filter((algo) => algo.id !== id));
    }
  };

  const updateAlgorithm = (id: number, updates: Partial<AlgorithmItem>) => {
    setAlgorithms(
      algorithms.map((algo) =>
        algo.id === id ? { ...algo, ...updates } : algo
      )
    );
  };

  const toggleAlgorithm = (id: number) => {
    setAlgorithms(
      algorithms.map((algo) =>
        algo.id === id ? { ...algo, isRunning: !algo.isRunning } : algo
      )
    );
  };

  const addHighlight = (id: number) => {
    const algo = algorithms.find((a) => a.id === id);
    if (algo) {
      const color =
        highlightColors[algo.highlights.length % highlightColors.length];
      const newHighlight = { start: 0, end: Math.min(10, text.length), color };
      updateAlgorithm(id, { highlights: [...algo.highlights, newHighlight] });
    }
  };

  const updateHighlight = (
    algoId: number,
    index: number,
    start: number,
    end: number
  ) => {
    setAlgorithms(
      algorithms.map((algo) =>
        algo.id === algoId
          ? {
              ...algo,
              highlights: algo.highlights.map((h, i) =>
                i === index ? { ...h, start, end } : h
              ),
            }
          : algo
      )
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setAlgorithms((prevAlgorithms) =>
        prevAlgorithms.map((algo) => {
          if (algo.isRunning && algo.pattern) {
            // Simulate search progress
            const newHighlights = [...algo.highlights];
            const lastHighlight = newHighlights[newHighlights.length - 1];
            if (lastHighlight && lastHighlight.end < text.length) {
              lastHighlight.end = Math.min(lastHighlight.end + 5, text.length);
            }
            return { ...algo, highlights: newHighlights };
          }
          return algo;
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Textarea
        className="mb-4"
        placeholder="Enter text to search..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
      />
      <div className="mb-4 p-4 border rounded-lg bg-gray-50 min-h-[200px] relative">
        {text.split("").map((char, index) => {
          const highlights = algorithms.flatMap((algo) =>
            algo.highlights.filter((h) => index >= h.start && index < h.end)
          );
          const style =
            highlights.length > 0
              ? { backgroundColor: highlights[0].color }
              : {};
          return (
            <span key={index} style={style}>
              {char}
            </span>
          );
        })}
      </div>
      <div className="space-y-4">
        {algorithms.map((algo) => (
          <div key={algo.id} className="flex items-center space-x-2">
            <Select
              value={algo.algorithm}
              onValueChange={(value: Algorithm) =>
                updateAlgorithm(algo.id, { algorithm: value })
              }
            >
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
              value={algo.pattern}
              onChange={(e) =>
                updateAlgorithm(algo.id, { pattern: e.target.value })
              }
              className="w-[180px]"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => toggleAlgorithm(algo.id)}
            >
              {algo.isRunning ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => addHighlight(algo.id)}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => removeAlgorithm(algo.id)}
              disabled={algorithms.length === 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            {algo.highlights.map((highlight, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Label className="text-xs">Start:</Label>
                <Input
                  type="number"
                  value={highlight.start}
                  onChange={(e) =>
                    updateHighlight(
                      algo.id,
                      index,
                      parseInt(e.target.value),
                      highlight.end
                    )
                  }
                  className="w-16"
                />
                <Label className="text-xs">End:</Label>
                <Input
                  type="number"
                  value={highlight.end}
                  onChange={(e) =>
                    updateHighlight(
                      algo.id,
                      index,
                      highlight.start,
                      parseInt(e.target.value)
                    )
                  }
                  className="w-16"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      <Button className="mt-4" onClick={addAlgorithm}>
        <Plus className="mr-2 h-4 w-4" /> Add Algorithm
      </Button>
    </div>
  );
}
