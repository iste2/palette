import { findClosestPolychromosColor } from "@/app/utils/color-matcher";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface ColorDisplayProps {
  color: {
    r: number;
    g: number;
    b: number;
  };
  onAddToPalette?: (color: {
    original: { r: number; g: number; b: number };
    matched: ReturnType<typeof findClosestPolychromosColor>;
  }) => void;
}

export function ColorDisplay({ color, onAddToPalette }: ColorDisplayProps) {
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

      {onAddToPalette && (
        <Button
          onClick={() => onAddToPalette({ original: color, matched: matchedColor })}
          className="w-full"
          variant="secondary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add to Palette
        </Button>
      )}
    </Card>
  );
} 