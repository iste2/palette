import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { type PolychromosColor } from "@/app/data/polychromos-colors";

interface ColorPaletteProps {
  colors: Array<{
    id: string;
    original: { r: number; g: number; b: number };
    matched: PolychromosColor;
  }>;
  onRemoveColor: (id: string) => void;
}

export function ColorPalette({ colors, onRemoveColor }: ColorPaletteProps) {
  if (colors.length === 0) {
    return (
      <Card className="p-4">
        <p className="text-sm text-muted-foreground text-center">
          Add colors to your palette by clicking the sample button
        </p>
      </Card>
    );
  }

  return (
    <ScrollArea className="h-[600px] w-full">
      <div className="grid gap-4 p-4">
        {colors.map((color) => (
          <Card key={color.id} className="p-3">
            <div className="flex items-start gap-3">
              <div className="flex-1 space-y-3">
                <div className="flex gap-2">
                  <div
                    className="w-12 h-12 rounded border"
                    style={{
                      backgroundColor: `rgb(${color.original.r},${color.original.g},${color.original.b})`,
                    }}
                  />
                  <div
                    className="w-12 h-12 rounded border"
                    style={{
                      backgroundColor: `rgb(${color.matched.rgb.join(",")})`,
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    #{color.matched.number} - {color.matched.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    RGB: {color.matched.rgb.join(", ")}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveColor(color.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
} 