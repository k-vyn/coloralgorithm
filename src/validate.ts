import { ColorAlgorithmError, ErrorCodes } from './errors';
import { ColorProps, ColorOptions, CurveType } from './types';
import defaultCurves from './default-curves';

/**
 * Validates all props and options before color generation.
 * Throws ColorAlgorithmError with specific error codes for invalid inputs.
 */
export function validateProps(props: ColorProps, options?: ColorOptions): void {
  if (!props) {
    throw new ColorAlgorithmError(
      'props is required',
      ErrorCodes.MISSING_PROPS
    );
  }

  validateSteps(props.steps);
  validateHue(props.hue);
  validateSaturation(props.saturation);
  validateBrightness(props.brightness);

  if (options) {
    validateOptions(options);
  }
}

function validateSteps(steps: number): void {
  if (typeof steps !== 'number' || steps < 2 || !Number.isInteger(steps)) {
    throw new ColorAlgorithmError(
      `steps must be an integer >= 2, got: ${steps}`,
      ErrorCodes.INVALID_STEPS
    );
  }
}

function validateHue(hue: ColorProps['hue']): void {
  if (!hue) {
    throw new ColorAlgorithmError(
      'hue configuration is required',
      ErrorCodes.INVALID_HUE
    );
  }

  if (typeof hue.start !== 'number' || hue.start < 0 || hue.start > 360) {
    throw new ColorAlgorithmError(
      `hue.start must be a number between 0-360, got: ${hue.start}`,
      ErrorCodes.INVALID_HUE
    );
  }

  if (typeof hue.end !== 'number' || hue.end < 0 || hue.end > 360) {
    throw new ColorAlgorithmError(
      `hue.end must be a number between 0-360, got: ${hue.end}`,
      ErrorCodes.INVALID_HUE
    );
  }

  validateCurve(hue.curve, 'hue.curve');
}

function validateSaturation(saturation: ColorProps['saturation']): void {
  if (!saturation) {
    throw new ColorAlgorithmError(
      'saturation configuration is required',
      ErrorCodes.INVALID_SATURATION
    );
  }

  if (typeof saturation.start !== 'number' || saturation.start < 0 || saturation.start > 1) {
    throw new ColorAlgorithmError(
      `saturation.start must be a number between 0-1, got: ${saturation.start}`,
      ErrorCodes.INVALID_SATURATION
    );
  }

  if (typeof saturation.end !== 'number' || saturation.end < 0 || saturation.end > 1) {
    throw new ColorAlgorithmError(
      `saturation.end must be a number between 0-1, got: ${saturation.end}`,
      ErrorCodes.INVALID_SATURATION
    );
  }

  if (typeof saturation.rate !== 'number' || saturation.rate <= 0) {
    throw new ColorAlgorithmError(
      `saturation.rate must be a positive number, got: ${saturation.rate}`,
      ErrorCodes.INVALID_RATE
    );
  }

  validateCurve(saturation.curve, 'saturation.curve');
}

function validateBrightness(brightness: ColorProps['brightness']): void {
  if (!brightness) {
    throw new ColorAlgorithmError(
      'brightness configuration is required',
      ErrorCodes.INVALID_BRIGHTNESS
    );
  }

  if (typeof brightness.start !== 'number' || brightness.start < 0 || brightness.start > 1) {
    throw new ColorAlgorithmError(
      `brightness.start must be a number between 0-1, got: ${brightness.start}`,
      ErrorCodes.INVALID_BRIGHTNESS
    );
  }

  if (typeof brightness.end !== 'number' || brightness.end < 0 || brightness.end > 1) {
    throw new ColorAlgorithmError(
      `brightness.end must be a number between 0-1, got: ${brightness.end}`,
      ErrorCodes.INVALID_BRIGHTNESS
    );
  }

  validateCurve(brightness.curve, 'brightness.curve');
}

function validateCurve(curve: CurveType, field: string): void {
  if (typeof curve === 'string') {
    const validCurves = Object.keys(defaultCurves);
    if (!validCurves.includes(curve)) {
      throw new ColorAlgorithmError(
        `${field}: unknown curve "${curve}". Valid curves: ${validCurves.join(', ')}`,
        ErrorCodes.INVALID_CURVE
      );
    }
  } else if (Array.isArray(curve)) {
    if (curve.length !== 4) {
      throw new ColorAlgorithmError(
        `${field}: curve array must have exactly 4 numbers, got ${curve.length}`,
        ErrorCodes.INVALID_CURVE
      );
    }
    if (curve.some(v => typeof v !== 'number' || isNaN(v))) {
      throw new ColorAlgorithmError(
        `${field}: curve array must contain only valid numbers`,
        ErrorCodes.INVALID_CURVE
      );
    }
  } else {
    throw new ColorAlgorithmError(
      `${field}: curve must be a string or array of 4 numbers`,
      ErrorCodes.INVALID_CURVE
    );
  }
}

function validateOptions(options: ColorOptions): void {
  if (options.lockHex !== undefined) {
    validateHex(options.lockHex, 'lockHex');
  }

  if (options.lockHexInverted !== undefined) {
    validateHex(options.lockHexInverted, 'lockHexInverted');
  }

  if (options.minorSteps !== undefined) {
    if (!Array.isArray(options.minorSteps)) {
      throw new ColorAlgorithmError(
        'minorSteps must be an array of numbers',
        ErrorCodes.INVALID_MINOR_STEPS
      );
    }
    if (options.minorSteps.some(v => typeof v !== 'number' || isNaN(v))) {
      throw new ColorAlgorithmError(
        'minorSteps must contain only valid numbers',
        ErrorCodes.INVALID_MINOR_STEPS
      );
    }
  }
}

function validateHex(hex: string, field: string): void {
  const hexRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  if (!hexRegex.test(hex)) {
    throw new ColorAlgorithmError(
      `${field}: invalid hex color "${hex}". Expected format: #RGB or #RRGGBB`,
      ErrorCodes.INVALID_HEX
    );
  }
}
