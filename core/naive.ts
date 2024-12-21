import { MyAlgorithm } from "./MyAlgorithm";

export class NaiveAlgorithm extends MyAlgorithm {
  private currentIndex: number;

  constructor(text: string, pattern: string) {
    super("naive", text, pattern);
    this.currentIndex = 0;
  }

  step() {
    // Clear previous current indices
    this.currentIndices = [];

    if (this.pattern === "") {
      // No pattern to search
      return;
    }

    if (this.currentIndex + this.pattern.length > this.text.length) {
      // Reached the end of the text
      return;
    }

    // Update current indices to show the range being checked
    for (let i = 0; i < this.pattern.length; i++) {
      this.currentIndices.push(this.currentIndex + i);
    }

    const substring = this.text.substring(this.currentIndex, this.currentIndex + this.pattern.length);
    if (substring === this.pattern) {
      // Match found; add highlight
      this.highlights.push({
        start: this.currentIndex,
        end: this.currentIndex + this.pattern.length,
        color: "yellow", // Or use a color from your highlightColors array
      });
    }

    this.currentIndex += 1;
    console.log("Current Index: ", this.currentIndex);
  }

  runFullAlgorithm() {
    const n = this.text.length;
    const m = this.pattern.length;

    this.resetHighlights();
    for (let i = 0; i <= n - m; i++) {
      let match = true;
      for (let j = 0; j < m; j++) {
        if (this.text[i + j] !== this.pattern[j]) {
          match = false;
          break;
        }
      }
      if (match) {
        this.highlights.push({
          start: i,
          end: i + m,
          color: "yellow",
        });
      }
    }
  }

  resetState() {
    super.resetState();
    this.currentIndex = 0;
  }

  isComplete(): boolean {
    // 패턴이 비어있거나 텍스트가 비어있으면 완료로 간주
    if (!this.pattern || !this.text) return true;
    
    // 현재 인덱스가 가능한 마지막 위치를 넘어섰으면 완료
    return this.currentIndex > this.text.length - this.pattern.length;
  }
}