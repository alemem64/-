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

  constructor(text: string, patterns: string) {
    super("aho-corasick", text, ""); // Patterns are not stored in a single string
    this.root = new TrieNode();
    this.currentNode = this.root;
    this.currentIndex = 0;

    const patternList = patterns.split(";");
    this.buildTrie(patternList);
    this.buildFailureLinks();
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
      node.outputs.push(pattern); // Add the pattern to the output of the last character
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

  // Run the algorithm to find all matches
  runFullAlgorithm() {
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

  // Step-by-step execution of the algorithm
  // Step-by-step execution of the algorithm
  step() {
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
    this.currentNode = this.root;
  }
}