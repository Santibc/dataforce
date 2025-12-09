export function hexToRgb(hex: string) {
  // Remove the hash if it exists
  hex = hex.replace(/^#/, '');

  // Parse the hex values
  const bigint = parseInt(hex, 16);

  // Extract the RGB components
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  // Return the RGB values as an array
  return [r, g, b] as [number, number, number];
}

export function rgbToRgbaString(rgbArray: [number, number, number], a: number): string {
  const [r, g, b] = rgbArray;
  return `rgba(${r},${g},${b},${a})`;
}
