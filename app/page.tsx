import { ColorPicker } from "./components/color-picker/color-picker";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Image Color Picker</h1>
      <ColorPicker className="max-w-2xl w-full rounded-lg shadow-lg" />
    </main>
  );
} 