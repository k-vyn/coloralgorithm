import { AlgorithmResult, ColorProps, ColorOptions, ColorResults } from "./types";
import generateColors from "./generate-colors";
import convertToColors from "./convert-to-colors";
import generateColorsWithLock from "./generate-colors-with-lock";
import { validateProps } from "./validate";

// Re-export types for consumers
export type { ColorProps, ColorOptions, ColorResults, ConvertedColor } from "./types";
export { ColorAlgorithmError, ErrorCodes } from "./errors";

/**
 * Generates a cohesive color palette based on HSB (Hue, Saturation, Brightness) curves.
 *
 * @param props - Color generation parameters
 * @param props.steps - Number of color steps to generate (minimum 2)
 * @param props.hue - Hue configuration (start: 0-360, end: 0-360, curve)
 * @param props.saturation - Saturation configuration (start: 0-1, end: 0-1, rate, curve)
 * @param props.brightness - Brightness configuration (start: 0-1, end: 0-1, curve)
 * @param options - Optional settings
 * @param options.lockHex - Lock a specific hex color in the palette
 * @param options.lockHexInverted - Lock a specific hex in the inverted palette
 * @param options.provideInverted - Generate an inverted color set
 * @param options.minorSteps - Add intermediate steps between major steps
 * @param options.rotation - Hue rotation direction ('clockwise' | 'counterclockwise')
 * @param options.name - Name to include in the result
 * @returns Array of color sets with multiple format outputs (hex, rgb, hsl, hsv, lab)
 * @throws {ColorAlgorithmError} If props or options are invalid
 *
 * @example
 * ```typescript
 * import { generate } from '@k-vyn/coloralgorithm';
 *
 * const palette = generate({
 *   steps: 11,
 *   hue: { start: 220, end: 240, curve: 'easeOutQuad' },
 *   saturation: { start: 0.08, end: 1, rate: 1, curve: 'easeOutQuad' },
 *   brightness: { start: 1, end: 0.2, curve: 'easeInQuart' },
 * }, {
 *   name: 'Blue',
 * });
 * ```
 */
export function generate(props: ColorProps, options?: ColorOptions): ColorResults {
  // Validate inputs before processing
  validateProps(props, options);

  if (options === undefined) {
    options = {};
  }
  const { lockHex, lockHexInverted, provideInverted } = options;
  const algorithmResult: AlgorithmResult = [];
  const generated = generateColors(props, options);
  if (lockHex) {
    algorithmResult.push(generateColorsWithLock(props, options, generated));
  } else {
    algorithmResult.push(generated);
  }

  if (provideInverted) {
    const generatedInverted = generateColors(props, options, true);
    if (lockHexInverted === undefined) {
      algorithmResult.push(generatedInverted);
    } else {
      algorithmResult.push(
        generateColorsWithLock(props, options, generatedInverted)
      );
    }
  }
  return convertToColors(props, options, algorithmResult);
}
