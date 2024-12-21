"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import TextDisplay from "@/components/main/TextDisplay";
import SpeedControl from "@/components/main/SpeedControl";
import AlgorithmControls from "@/components/main/AlgorithmControls";
import { AlgorithmItem } from "@/types/type";
import { MyAlgorithm } from "@/core/MyAlgorithm";
import { NaiveAlgorithm } from "@/core/naive";
import { AhoCorasickAlgorithm } from "@/core/AhoCor";
import { BoyerMooreAlgorithm } from "@/core/BoyerMoore";

export default function TextSearchSimulator() {
  const [text, setText] = useState("");
  const [speed, setSpeed] = useState(500); // Increased speed for better visualization
  const [algorithms, setAlgorithms] = useState<AlgorithmItem[]>([
    {
      id: 1,
      algorithm: null,
      isRunning: false,
    },
  ]);

  const addAlgorithm = () => {
    const newId = Math.max(...algorithms.map((a) => a.id), 0) + 1;
    setAlgorithms([
      ...algorithms,
      {
        id: newId,
        algorithm: null,
        isRunning: false,
      },
    ]);
  };

  const removeAlgorithm = (id: number) => {
    if (algorithms.length > 1) {
      setAlgorithms(algorithms.filter((algo) => algo.id !== id));
    }
  };

  const updateAlgorithm = (id: number, updates: Partial<AlgorithmItem>) => {
    setAlgorithms((prevAlgorithms) =>
      prevAlgorithms.map((algo) =>
        algo.id === id ? { ...algo, ...updates } : algo
      )
    );
  };

  const toggleAlgorithm = (id: number) => {
    setAlgorithms((prevAlgorithms) =>
      prevAlgorithms.map((algo) =>
        algo.id === id ? { ...algo, isRunning: !algo.isRunning } : algo
      )
    );
  };

  const handleAlgorithmChange = (id: number, value: string) => {
    let newAlgorithm: MyAlgorithm | null = null;

    switch (value) {
      case "naive":
        newAlgorithm = new NaiveAlgorithm(text, "");
        break;
      case "boyer-moore":
        newAlgorithm = new BoyerMooreAlgorithm(text, "");
        break;
      case "aho-corasick":
        newAlgorithm = new AhoCorasickAlgorithm(text, "pattern1;pattern2");
        break;
      default:
        newAlgorithm = null;
    }

    updateAlgorithm(id, { algorithm: newAlgorithm });
  };

  // Update text in all algorithms when the text changes
  useEffect(() => {
    setAlgorithms((prevAlgorithms) =>
      prevAlgorithms.map((algo) => {
        if (algo.algorithm) {
          algo.algorithm.setText(text); // Update text in algorithm
        }
        return algo;
      })
    );
  }, [text]);

  // Main loop to step through algorithms
  useEffect(() => {
    const interval = setInterval(() => {
      setAlgorithms((prevAlgorithms) =>
        prevAlgorithms.map((algo) => {
          if (algo.isRunning && algo.algorithm) {
            console.log("Stepping algorithm: ", algo.algorithm.name);
            algo.algorithm.step();
          }
          return { ...algo };
        })
      );
    }, speed);

    return () => clearInterval(interval);
  }, [speed]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Textarea
        className="mb-4"
        placeholder="Enter text to search..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
      />
      <TextDisplay text={text} algorithms={algorithms} />
      <SpeedControl speed={speed} setSpeed={setSpeed} />
      <div className="space-y-4">
        {algorithms.map((algo) => (
          <AlgorithmControls
            key={algo.id}
            algo={algo}
            updateAlgorithm={updateAlgorithm}
            toggleAlgorithm={toggleAlgorithm}
            removeAlgorithm={removeAlgorithm}
            algorithms={algorithms}
            handleAlgorithmChange={handleAlgorithmChange}
          />
        ))}
      </div>
      <Button className="mt-4" onClick={addAlgorithm}>
        <Plus className="mr-2 h-4 w-4" /> Add Algorithm
      </Button>
    </div>
  );
}
