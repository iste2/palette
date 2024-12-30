"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ColorDisplay } from "@/app/components/color-picker/color-display";

interface ColorPickerProps {
  className?: string;
}

interface ColorPoint {
  x: number;
  y: number;
  color: { r: number; g: number; b: number };
}

export function ColorPicker({ className }: ColorPickerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedPoint, setSelectedPoint] = useState<ColorPoint | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  // Rest of the canvas initialization and color picking logic remains the same
  useEffect(() => {
    if (!imageUrl) return;
    
    const image = new Image();
    image.src = imageUrl;
    image.crossOrigin = "anonymous";
    
    image.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
      }
    };
  }, [imageUrl]);

  const getPixelColor = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    
    if (ctx) {
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      return {
        r: pixel[0],
        g: pixel[1],
        b: pixel[2],
      };
    }
    return null;
  }, []);

  const handleImageClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    const image = imageRef.current;
    const canvas = canvasRef.current;
    
    if (!container || !image || !canvas) return;

    const rect = image.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    // Calculate the ratio between displayed image and canvas
    const scaleX = canvas.width / image.width;
    const scaleY = canvas.height / image.height;

    // Map click coordinates to canvas coordinates
    const x = Math.floor(offsetX * scaleX);
    const y = Math.floor(offsetY * scaleY);

    const color = getPixelColor(x, y);
    if (color) {
      setSelectedPoint({ x, y, color });
    }
  }, [getPixelColor]);

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="block w-full text-sm text-slate-500 mb-4
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100"
      />
      
      {imageUrl ? (
        <div
          ref={containerRef}
          className="relative cursor-crosshair"
          onClick={handleImageClick}
        >
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Color picker image"
            className={className}
          />
          
          <canvas
            ref={canvasRef}
            className="hidden"
          />
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-500">Upload an image to start picking colors</p>
        </div>
      )}

      {selectedPoint && (
        <ColorDisplay color={selectedPoint.color} />
      )}
    </div>
  );
} 