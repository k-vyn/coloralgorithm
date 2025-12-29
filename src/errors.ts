/**
 * Custom error class for coloralgorithm validation and runtime errors.
 * Provides error codes for programmatic error handling.
 */
export class ColorAlgorithmError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'ColorAlgorithmError';
    // Maintains proper stack trace for where error was thrown (V8 engines)
    const ErrorWithCapture = Error as typeof Error & {
      captureStackTrace?: (target: object, constructor: NewableFunction) => void;
    };
    if (ErrorWithCapture.captureStackTrace) {
      ErrorWithCapture.captureStackTrace(this, ColorAlgorithmError);
    }
  }
}

// Error codes for programmatic handling
export const ErrorCodes = {
  INVALID_STEPS: 'INVALID_STEPS',
  INVALID_HUE: 'INVALID_HUE',
  INVALID_SATURATION: 'INVALID_SATURATION',
  INVALID_BRIGHTNESS: 'INVALID_BRIGHTNESS',
  INVALID_RATE: 'INVALID_RATE',
  INVALID_CURVE: 'INVALID_CURVE',
  INVALID_HEX: 'INVALID_HEX',
  INVALID_MINOR_STEPS: 'INVALID_MINOR_STEPS',
  MISSING_PROPS: 'MISSING_PROPS',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];
