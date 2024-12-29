interface ColorDisplayProps {
  color: {
    r: number;
    g: number;
    b: number;
  };
}

export function ColorDisplay({ color }: ColorDisplayProps) {
  const colorString = `rgb(${color.r}, ${color.g}, ${color.b})`;
  const hexColor = `#${color.r.toString(16).padStart(2, '0')}${color.g.toString(16).padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}`;

  return (
    <div className="flex items-center gap-4">
      <div
        className="w-16 h-16 rounded-md shadow-md"
        style={{ backgroundColor: colorString }}
      />
      <div className="space-y-1">
        <p className="text-sm font-medium">
          RGB: {color.r}, {color.g}, {color.b}
        </p>
        <p className="text-sm font-medium">
          HEX: {hexColor.toUpperCase()}
        </p>
      </div>
    </div>
  );
} 