import { AlHighlight } from "@/types/type";

export abstract class MyAlgorithm {
  public name: string;
  public text: string;
  public pattern: string;
  public highlights: AlHighlight[];
  public currentIndices: number[]; // Indices currently being checked

  constructor(name: string, text: string, pattern: string) {
    this.name = name;
    this.text = text;
    this.pattern = pattern;
    this.highlights = [];
    this.currentIndices = [];
  }

  // Abstract step method
  abstract step(): void;

  // Abstract method to run the algorithm completely
  abstract runFullAlgorithm(): void;

  setText(text: string) {
    this.text = text;
    this.resetHighlights();
    this.resetState();
  }

  setPattern(pattern: string) {
    this.pattern = pattern;
    this.resetHighlights();
    this.resetState();
  }

  resetHighlights() {
    this.highlights = [];
  }

  resetState() {
    this.currentIndices = [];
  }
}