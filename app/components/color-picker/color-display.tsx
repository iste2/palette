import { findClosestPolychromosColor } from "../../utils/color-matcher";
import { Card } from "@/components/ui/card";

interface ColorDisplayProps {
  color: {
    r: number;
    g: number;
    b: number;
  };
}

export function ColorDisplay({ color }: ColorDisplayProps) {
  const colorString = `rgb(${color.r}, ${color.g}, ${color.b})`;
  const matchedColor = findClosestPolychromosColor(color.r, color.g, color.b);
  
  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-2">
        <div 
          className="w-full h-20 rounded-md border"
          style={{ backgroundColor: colorString }}
        />
        <p className="text-sm font-medium">Selected Color: {colorString}</p>
      </div>
      
      <div className="space-y-2">
        <div 
          className="w-full h-20 rounded-md border"
          style={{ backgroundColor: `rgb(${matchedColor.rgb.join(',')})` }}
        />
        <div className="text-sm space-y-1">
          <p className="font-medium">Closest Polychromos Pencil:</p>
          <p>#{matchedColor.number} - {matchedColor.name}</p>
        </div>
      </div>
    </Card>
  );
} 