import { AlgorithmItem } from "@/types/type";

export default function TextDisplay({
  text,
  algorithms,
}: {
  text: string;
  algorithms: AlgorithmItem[];
}) {
  return (
    <div className="mb-4 p-4 border rounded-lg bg-gray-50 min-h-[200px] relative font-mono">
      {text.split("").map((char, index) => {
        // Collect highlights and current indices
        const highlightStyles: { backgroundColor: any }[] = [];
        const markerStyles: { borderBottom: string }[] = [];

        algorithms.forEach((algo) => {
          if (algo.algorithm) {
            // Check for highlights (matches found)
            algo.algorithm.highlights.forEach(
              (h: { start: number; end: number; color: any }) => {
                if (index >= h.start && index < h.end) {
                  highlightStyles.push({ backgroundColor: h.color });
                }
              }
            );

            // Check if this index is currently being checked
            if (algo.algorithm.currentIndices.includes(index)) {
              markerStyles.push({ borderBottom: `2px solid red` });
            }
          }
        });

        // Merge styles
        const style = Object.assign({}, ...highlightStyles, ...markerStyles);

        return (
          <span key={index} style={style}>
            {char}
          </span>
        );
      })}
    </div>
  );
}
