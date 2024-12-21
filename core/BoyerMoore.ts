import { MyAlgorithm } from "./MyAlgorithm";

export class BoyerMooreAlgorithm extends MyAlgorithm {
  private currentIndex: number;
  private badCharTable: Map<string, number>;

  constructor(text: string, pattern: string) {
    super("boyer-moore", text, pattern);
    this.currentIndex = pattern.length - 1;
    this.badCharTable = new Map();
    this.buildBadCharTable();
  }

  private buildBadCharTable() {
    // Build bad character table
    // For each character in pattern, store its rightmost occurrence
    for (let i = 0; i < this.pattern.length; i++) {
      this.badCharTable.set(this.pattern[i], i);
    }
  }

  step() {
    this.currentIndices = [];

    if (this.pattern === "") {
      return;
    }

    if (this.currentIndex >= this.text.length) {
      return;
    }

    // Add current window to currentIndices for visualization
    for (let i = 0; i < this.pattern.length; i++) {
      this.currentIndices.push(this.currentIndex - this.pattern.length + 1 + i);
    }

    let j = this.pattern.length - 1;
    const startPos = this.currentIndex - this.pattern.length + 1;

    // Check if current window matches
    let isMatch = true;
    for (let i = this.pattern.length - 1; i >= 0; i--) {
      if (this.text[startPos + i] !== this.pattern[i]) {
        isMatch = false;
        break;
      }
    }

    if (isMatch) {
      // Pattern found, add highlight
      this.highlights.push({
        start: startPos,
        end: startPos + this.pattern.length,
        color: "green",
      });
    }

    // Calculate shift
    const badChar = this.text[this.currentIndex];
    const shift = this.getShift(badChar, j);
    
    this.currentIndex += shift;
  }

  private getShift(badChar: string, j: number): number {
    // If character exists in pattern, shift to align with rightmost occurrence
    // Otherwise shift whole pattern length
    const lastOccurrence = this.badCharTable.get(badChar);
    
    if (lastOccurrence === undefined) {
      return 1; // Character not in pattern, shift by 1 for step-by-step visualization
    }

    const shift = j - lastOccurrence;
    return Math.max(1, shift); // Ensure we move at least 1 position for visualization
  }

  runFullAlgorithm() {
    this.resetHighlights();
    const n = this.text.length;
    const m = this.pattern.length;

    if (m === 0) return;

    let i = m - 1;
    while (i < n) {
      let j = m - 1;
      let k = i;
      
      // Check current window for match
      while (j >= 0 && this.text[k] === this.pattern[j]) {
        k--;
        j--;
      }

      if (j === -1) {
        // Pattern found
        this.highlights.push({
          start: k + 1,
          end: k + 1 + m,
          color: "green",
        });
        i += m; // Move to next position after match
      } else {
        // Calculate shift using bad character rule
        const badChar = this.text[k];
        const shift = this.getShift(badChar, j);
        i += shift;
      }
    }
  }

  resetState() {
    super.resetState();
    this.currentIndex = this.pattern.length - 1;
    this.buildBadCharTable();
  }
} 