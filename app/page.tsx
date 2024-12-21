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
import { KMPAlgorithm } from "@/core/KMP";
import { Card } from "@/components/ui/card";

export default function TextSearchSimulator() {
  const [text, setText] = useState("");
  const [speed, setSpeed] = useState(500); // Increased speed for better visualization
  const [algorithms, setAlgorithms] = useState<AlgorithmItem[]>([
    {
      id: 1,
      algorithm: null,
      isRunning: false,
      startTime: null,
      elapsedTime: 0,
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
        startTime: null,
        elapsedTime: 0,
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
      prevAlgorithms.map((algo) => {
        if (algo.id === id) {
          // 알고리즘이 완료된 상태에서는 시작하지 않음
          if (!algo.isRunning && algo.algorithm?.isComplete()) {
            return algo;
          }
          
          const now = Date.now();
          return {
            ...algo,
            isRunning: !algo.isRunning,
            startTime: !algo.isRunning ? now : null,
            elapsedTime: algo.isRunning && algo.startTime 
              ? algo.elapsedTime + (now - algo.startTime)
              : algo.elapsedTime
          };
        }
        return algo;
      })
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
      case "kmp":
        newAlgorithm = new KMPAlgorithm(text, "");
        break;
      default:
        newAlgorithm = null;
    }

    updateAlgorithm(id, { 
      algorithm: newAlgorithm,
      startTime: null,
      elapsedTime: 0 
    });
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

  // 타이머 업데이트를 위한 useEffect 수정
  useEffect(() => {
    const timerInterval = setInterval(() => {
      const now = Date.now();
      setAlgorithms((prevAlgorithms) =>
        prevAlgorithms.map((algo) => {
          if (algo.isRunning && algo.startTime) {
            // 알고리즘이 완료되었는지 확인
            if (algo.algorithm?.isComplete()) {
              return {
                ...algo,
                isRunning: false,
                elapsedTime: algo.elapsedTime, // 현재 누적된 시간 유지
                startTime: null,
              };
            }
            // 시작 시간부터 현재까지의 경과 시간만 계산
            return {
              ...algo,
              elapsedTime: algo.elapsedTime + (now - algo.startTime),
              startTime: now, // 시작 시간 갱신
            };
          }
          return algo;
        })
      );
    }, 10); // 더 정확한 측정을 위해 10ms로 변경

    return () => clearInterval(timerInterval);
  }, []);

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

  // 텍스트 크기를 계산하는 함수
  const calculateSize = (text: string) => {
    const bytes = new TextEncoder().encode(text).length;
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Card className="p-2 mb-2 inline-block">
        <span className="text-sm font-medium">
          Size: {calculateSize(text)}
        </span>
      </Card>
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
