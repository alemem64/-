import { MyAlgorithm } from "./MyAlgorithm";

class TrieNode {
  children: Map<string, TrieNode>;
  failureLink: TrieNode | null;
  outputs: string[];

  constructor() {
    this.children = new Map();
    this.failureLink = null;
    this.outputs = [];
  }
}

export class AhoCorasickAlgorithm extends MyAlgorithm {
  private root: TrieNode;
  private currentNode: TrieNode;
  private currentIndex: number;

  // New: track whether we've built the trie + failure links
  private isBuilt: boolean;

  constructor(text: string, patterns: string) {
    super("aho-corasick", text, ""); // Patterns are not stored in a single string
    this.root = new TrieNode();
    this.currentNode = this.root;
    this.currentIndex = 0;

    // Initially, the trie is not built
    this.isBuilt = false;

    // Automatically build if patterns is not empty
    if (patterns && patterns.trim() !== "") {
      this.initializePatterns(patterns);
    }
  }

  /**
   * Build the trie & failure links from the semicolon-separated pattern string.
   * Call this if you want to rebuild or build after the constructor.
   */
  public initializePatterns(patterns: string) {
    // Clear out old root if you want to support re-initialization
    this.root = new TrieNode();
    this.currentNode = this.root;
    this.currentIndex = 0;
    this.isBuilt = false;

    const patternList = patterns.split(";").map(p => p.trim());
    this.buildTrie(patternList);
    this.buildFailureLinks();

    // Mark as built
    this.isBuilt = true;
  }

  // Build the trie from the patterns
  private buildTrie(patterns: string[]) {
    for (const pattern of patterns) {
      if (!pattern) continue; // Skip empty patterns
      let node = this.root;
      for (const char of pattern) {
        if (!node.children.has(char)) {
          node.children.set(char, new TrieNode());
        }
        node = node.children.get(char)!;
      }
      // Add the pattern to the output of the last character
      node.outputs.push(pattern);
    }
  }

  // Build failure links for the trie
  private buildFailureLinks() {
    const queue: TrieNode[] = [];

    // Set failure links for root's children
    for (const [char, child] of this.root.children.entries()) {
      child.failureLink = this.root;
      queue.push(child);
    }

    while (queue.length > 0) {
      const node = queue.shift()!;
      for (const [char, child] of node.children.entries()) {
        // Find failure link for the child
        let fallback = node.failureLink;
        while (fallback && !fallback.children.has(char)) {
          fallback = fallback.failureLink;
        }
        child.failureLink = fallback ? fallback.children.get(char)! : this.root;

        // Merge outputs from the failure link
        if (child.failureLink) {
          child.outputs.push(...child.failureLink.outputs);
        }
        queue.push(child);
      }
    }
  }

  // Run the algorithm to find all matches at once
  runFullAlgorithm() {
    if (!this.isBuilt) {
      console.warn("Aho-Corasick trie is not built yet. Aborting runFullAlgorithm().");
      return;
    }

    this.resetHighlights();
    let node = this.root;

    for (let i = 0; i < this.text.length; i++) {
      const char = this.text[i];

      // Follow failure links on mismatch
      while (node && !node.children.has(char)) {
        node = node.failureLink!;
      }

      if (node) {
        node = node.children.get(char)!;

        // Check for matches in the current state
        for (const pattern of node.outputs) {
          this.highlights.push({
            start: i - pattern.length + 1,
            end: i + 1,
            color: "blue",
          });
        }
      } else {
        node = this.root; // Fallback to root on mismatch
      }
    }
  }

  public setPattern(patterns: string): void {
    // 1) Store it in `this.pattern` for debugging or any base-class usage
    super.setPattern(patterns);

    // 2) Actually rebuild the trie 
    //    (split on semicolon if user will type "ANA;BANANA", etc.)
    if (patterns.trim() !== "") {
      this.initializePatterns(patterns);
    } else {
      // If user clears the pattern input, maybe reset the trie
      this.root = new TrieNode();
      this.currentNode = this.root;
      this.currentIndex = 0;
      this.isBuilt = false;
    }
  }

  // Step-by-step execution of the algorithm
  step() {
    // Guard: Check if the trie is built
    if (!this.isBuilt) {
      console.warn("Aho-Corasick trie is not built yet. Aborting step().");
      return;
    }

    if (this.currentIndex >= this.text.length) {
      console.warn("No more steps; reached the end of the text.");
      return;
    }

    const char = this.text[this.currentIndex];

    // Follow failure links on mismatch
    while (this.currentNode && !this.currentNode.children.has(char)) {
      console.log(`Mismatch at index ${this.currentIndex}, following failure link.`);
      this.currentNode = this.currentNode.failureLink!;
    }

    if (this.currentNode) {
      // Move to the next node in the trie
      this.currentNode = this.currentNode.children.get(char)!;
      console.log(`Match for '${char}' at index ${this.currentIndex}, moving in trie.`);

      // Check for matches at the current node
      for (const pattern of this.currentNode.outputs) {
        const start = this.currentIndex - pattern.length + 1;
        const end = this.currentIndex + 1;
        console.log(`Pattern '${pattern}' found from index ${start} to ${end}.`);
        this.highlights.push({ start, end, color: "blue" });
      }
    } else {
      // Reset to root if no match is found
      console.log(`No match, resetting to root at index ${this.currentIndex}.`);
      this.currentNode = this.root;
    }

    // Update the current index
    this.currentIndices[0] = this.currentIndex;
    this.currentIndex++;
  }

  resetState() {
    super.resetState();
    // Reset the traversal node & index
    this.currentNode = this.root;
    this.currentIndex = 0;
  }

  // If text or pattern are empty, we consider it "complete" or trivially done
  isComplete(): boolean {
    if (!this.text) return true;
    return this.currentIndex >= this.text.length;
  }
}