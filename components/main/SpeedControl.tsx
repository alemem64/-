import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function SpeedControl({
  speed,
  setSpeed,
}: {
  speed: number;
  setSpeed: (speed: number) => void;
}) {
  return (
    <div className="mb-4">
      <Label className="text-sm font-medium">Algorithm Speed (ms):</Label>
      <Input
        type="number"
        value={speed}
        onChange={(e: any) => setSpeed(Math.max(10, parseInt(e.target.value)))}
        className="w-[100px] mt-2"
      />
    </div>
  );
}
