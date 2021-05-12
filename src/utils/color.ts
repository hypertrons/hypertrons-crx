function clampCssByte(i: number): number {  // Clamp to integer 0 .. 255.
  i = Math.round(i);  // Seems to be what Chrome does (vs truncation).
  return i < 0 ? 0 : i > 255 ? 255 : i;
}

function clampCssFloat(f: number): number {  // Clamp to float 0.0 .. 1.0.
  return f < 0 ? 0 : f > 1 ? 1 : f;
}

function lerpNumber(a: number, b: number, p: number): number {
  return a + (b - a) * p;
}

/**
 * Map value to color. Faster than lerp methods because color is represented by rgba array.
 * @param normalizedValue A float between 0 and 1.
 * @param colors List of rgba color array
 * @param out Mapped gba color array
 * @return will be null/undefined if input illegal.
 */
export function fastLerp(
  normalizedValue: number,
  colors: number[][],
  out?: number[]
): number[] {
  if (!(colors && colors.length)
    || !(normalizedValue >= 0 && normalizedValue <= 1)
  ) {
    return [];
  }

  out = out || [];

  const value = normalizedValue * (colors.length - 1);
  const leftIndex = Math.floor(value);
  const rightIndex = Math.ceil(value);
  const leftColor = colors[leftIndex];
  const rightColor = colors[rightIndex];
  const dv = value - leftIndex;
  out[0] = clampCssByte(lerpNumber(leftColor[0], rightColor[0], dv));
  out[1] = clampCssByte(lerpNumber(leftColor[1], rightColor[1], dv));
  out[2] = clampCssByte(lerpNumber(leftColor[2], rightColor[2], dv));
  out[3] = clampCssFloat(lerpNumber(leftColor[3], rightColor[3], dv));

  return out;
}

/**
 * @param arrColor like [12,33,44,0.4]
 * @param type 'rgba', 'hsva', ...
 * @return Result color. (If input illegal, return undefined).
 */
export function stringify(arrColor: number[], type: string): string {
  if (!arrColor || !arrColor.length) {
    return '';
  }
  let colorStr = arrColor[0] + ',' + arrColor[1] + ',' + arrColor[2];
  if (type === 'rgba' || type === 'hsva' || type === 'hsla') {
    colorStr += ',' + arrColor[3];
  }
  return type + '(' + colorStr + ')';
} 