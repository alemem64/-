import { AlHighlight } from "@/types/type";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function HighlightControls({
  algoId,
  index,
  highlight,
  updateHighlight,
}: {
  algoId: number;
  index: number;
  highlight: AlHighlight;
  updateHighlight: (
    algoId: number,
    index: number,
    start: number,
    end: number
  ) => void;
}) {
  return (
    <div className="flex items-center space-x-2">
      <Label className="text-xs">Start:</Label>
      <Input
        type="number"
        value={highlight.start}
        onChange={(e: any) =>
          updateHighlight(
            algoId,
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
        onChange={(e: any) =>
          updateHighlight(
            algoId,
            index,
            highlight.start,
            parseInt(e.target.value)
          )
        }
        className="w-16"
      />
    </div>
  );
}
