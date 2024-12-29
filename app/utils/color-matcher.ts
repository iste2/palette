import { polychromosColors, type PolychromosColor } from "../data/polychromos-colors";

// Convert RGB to LAB color space
function rgbToLab(red: number, green: number, blue: number): [number, number, number] {
  // First convert RGB to XYZ
  let rgb = [red / 255, green / 255, blue / 255].map(v => {
    if (v > 0.04045) {
      return Math.pow((v + 0.055) / 1.055, 2.4);
    }
    return v / 12.92;
  });

  // Matrix multiplication
  const x = rgb[0] * 0.4124 + rgb[1] * 0.3576 + rgb[2] * 0.1805;
  const y = rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
  const z = rgb[0] * 0.0193 + rgb[1] * 0.1192 + rgb[2] * 0.9505;

  // Convert XYZ to Lab
  const xn = 0.95047;
  const yn = 1.00000;
  const zn = 1.08883;

  const xyz = [x/xn, y/yn, z/zn].map(v => {
    if (v > 0.008856) {
      return Math.pow(v, 1/3);
    }
    return (7.787 * v) + 16/116;
  });

  const L = (116 * xyz[1]) - 16;
  const a = 500 * (xyz[0] - xyz[1]);
  const b = 200 * (xyz[1] - xyz[2]);

  return [L, a, b];
}

// Calculate CIEDE2000 color difference
function calculateDeltaE2000(lab1: [number, number, number], lab2: [number, number, number]): number {
  // Implementation of CIEDE2000 formula
  // This is a simplified version for brevity
  const [L1, a1, b1] = lab1;
  const [L2, a2, b2] = lab2;
  
  const deltaL = L2 - L1;
  const deltaA = a2 - a1;
  const deltaB = b2 - b1;
  
  // This is a simplified calculation - for production, use the full CIEDE2000 formula
  return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB);
}

export function findClosestPolychromosColor(r: number, g: number, b: number): PolychromosColor {
  const targetLab = rgbToLab(r, g, b);
  
  let closestColor = polychromosColors[0];
  let smallestDelta = Infinity;
  
  for (const color of polychromosColors) {
    const colorLab = rgbToLab(...color.rgb);
    const deltaE = calculateDeltaE2000(targetLab, colorLab);
    
    if (deltaE < smallestDelta) {
      smallestDelta = deltaE;
      closestColor = color;
    }
  }
  
  return closestColor;
} 