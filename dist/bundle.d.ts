type CurveType = number[] | string;
type HueType = {
    start: number;
    end: number;
    curve: CurveType;
};
type SaturationType = {
    start: number;
    end: number;
    curve: CurveType;
    rate: number;
};
type BrightnessType = {
    start: number;
    end: number;
    curve: CurveType;
};
interface ColorOptions {
    lockHex?: string;
    lockHexInverted?: string;
    provideInverted?: boolean;
    minorSteps?: number[];
    rotation?: 'clockwise' | 'counterclockwise' | 'cw' | 'ccw';
    name?: string;
}
interface ColorProps {
    steps: number;
    hue: HueType;
    saturation: SaturationType;
    brightness: BrightnessType;
}
type ConvertedColor = {
    step: number;
    hue: number;
    saturation: number;
    brightness: number;
    isMajor: boolean;
    isLocked: boolean;
    hex: string;
    hsl: number[];
    hsv: number[];
    lab: number[];
    rgbString: string;
    rgbArray: number[];
    rgbaString: string;
    rgbaArray: number[];
};
type ColorResults = {
    inverted: boolean;
    name: string | undefined;
    colors: ConvertedColor[];
}[];

/**
 * Custom error class for coloralgorithm validation and runtime errors.
 * Provides error codes for programmatic error handling.
 */
declare class ColorAlgorithmError extends Error {
    code: string;
    constructor(message: string, code: string);
}
declare const ErrorCodes: {
    readonly INVALID_STEPS: "INVALID_STEPS";
    readonly INVALID_HUE: "INVALID_HUE";
    readonly INVALID_SATURATION: "INVALID_SATURATION";
    readonly INVALID_BRIGHTNESS: "INVALID_BRIGHTNESS";
    readonly INVALID_RATE: "INVALID_RATE";
    readonly INVALID_CURVE: "INVALID_CURVE";
    readonly INVALID_HEX: "INVALID_HEX";
    readonly INVALID_MINOR_STEPS: "INVALID_MINOR_STEPS";
    readonly MISSING_PROPS: "MISSING_PROPS";
};

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
declare function generate(props: ColorProps, options?: ColorOptions): ColorResults;

export { ColorAlgorithmError, type ColorOptions, type ColorProps, type ColorResults, type ConvertedColor, ErrorCodes, generate };
