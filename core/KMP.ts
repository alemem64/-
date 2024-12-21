import { MyAlgorithm } from "./MyAlgorithm";

export class KMPAlgorithm extends MyAlgorithm {
  private currentIndex: number;
  private patternIndex: number;
  private failureTable: number[];

  constructor(text: string, pattern: string) {
    super("kmp", text, pattern);
    this.currentIndex = 0;
    this.patternIndex = 0;
    this.failureTable = this.computeFailureTable(pattern);
  }

  // 실패 함수(failure function) 계산
  private computeFailureTable(pattern: string): number[] {
    const table = new Array(pattern.length).fill(0);
    let prefixEnd = 0;
    let i = 1;

    while (i < pattern.length) {
      if (pattern[i] === pattern[prefixEnd]) {
        prefixEnd++;
        table[i] = prefixEnd;
        i++;
      } else {
        if (prefixEnd !== 0) {
          prefixEnd = table[prefixEnd - 1];
        } else {
          table[i] = 0;
          i++;
        }
      }
    }

    return table;
  }

  // 한 단계씩 실행
  step() {
    if (this.pattern === "") return;
    
    // 검색이 완료되었는지 확인
    if (this.currentIndex >= this.text.length) {
      console.log("검색 완료");
      return;
    }

    // 현재 비교 중인 위치 표시
    this.currentIndices = [this.currentIndex];
    if (this.patternIndex > 0) {
      this.currentIndices.push(this.currentIndex - this.patternIndex);
    }

    // 현재 문자 비교
    if (this.text[this.currentIndex] === this.pattern[this.patternIndex]) {
      // 매칭 성공
      if (this.patternIndex === this.pattern.length - 1) {
        // 패턴 전체 매칭 성공
        const matchStart = this.currentIndex - this.patternIndex;
        this.highlights.push({
          start: matchStart,
          end: matchStart + this.pattern.length,
          color: "green"
        });
        // 다음 매칭을 위해 실패 함수 값으로 이동
        this.patternIndex = this.failureTable[this.patternIndex];
      } else {
        // 부분 매칭 진행
        this.patternIndex++;
      }
      this.currentIndex++;
    } else {
      // 매칭 실패
      if (this.patternIndex !== 0) {
        // 실패 함수를 사용하여 다음 비교 위치로 이동
        this.patternIndex = this.failureTable[this.patternIndex - 1];
      } else {
        // 처음부터 다시 시작
        this.currentIndex++;
      }
    }

    console.log(`현재 인덱스: ${this.currentIndex}, 패턴 인덱스: ${this.patternIndex}`);
  }

  // 전체 알고리즘 실행
  runFullAlgorithm() {
    this.resetHighlights();
    
    if (this.pattern === "") return;

    let textIndex = 0;
    let patternIndex = 0;

    while (textIndex < this.text.length) {
      if (this.text[textIndex] === this.pattern[patternIndex]) {
        if (patternIndex === this.pattern.length - 1) {
          // 패턴 매칭 성공
          const matchStart = textIndex - patternIndex;
          this.highlights.push({
            start: matchStart,
            end: matchStart + this.pattern.length,
            color: "green"
          });
          patternIndex = this.failureTable[patternIndex];
        } else {
          patternIndex++;
        }
        textIndex++;
      } else {
        if (patternIndex !== 0) {
          patternIndex = this.failureTable[patternIndex - 1];
        } else {
          textIndex++;
        }
      }
    }
  }

  // 상태 초기화
  resetState() {
    super.resetState();
    this.currentIndex = 0;
    this.patternIndex = 0;
    this.failureTable = this.computeFailureTable(this.pattern);
  }

  // 패턴 변경 시 실패 함수 재계산
  setPattern(pattern: string) {
    super.setPattern(pattern);
    this.failureTable = this.computeFailureTable(pattern);
  }

  isComplete(): boolean {
    if (!this.pattern || !this.text) return true;
    return this.currentIndex >= this.text.length - this.pattern.length + 1;
  }
}