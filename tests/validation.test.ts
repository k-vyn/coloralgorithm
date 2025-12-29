/**
 * Tests for input validation
 * Ensures invalid inputs throw helpful ColorAlgorithmError exceptions
 */

import { describe, it, expect } from 'vitest';
import { generate, ColorAlgorithmError, ErrorCodes } from '../src/index';
import { ColorProps } from '../src/types';

describe('Input Validation', () => {
  // Valid baseline props for modification in tests
  const validProps: ColorProps = {
    steps: 5,
    hue: { start: 200, end: 240, curve: 'linear' },
    saturation: { start: 0.3, end: 1, rate: 1, curve: 'linear' },
    brightness: { start: 1, end: 0.2, curve: 'linear' },
  };

  describe('Missing Props', () => {
    it('throws when props is null', () => {
      expect(() => generate(null as unknown as ColorProps))
        .toThrow(ColorAlgorithmError);
    });

    it('throws when props is undefined', () => {
      expect(() => generate(undefined as unknown as ColorProps))
        .toThrow(ColorAlgorithmError);
    });
  });

  describe('Steps Validation', () => {
    it('throws when steps is less than 2', () => {
      const props = { ...validProps, steps: 1 };
      expect(() => generate(props)).toThrow(ColorAlgorithmError);
      expect(() => generate(props)).toThrow(/steps must be an integer >= 2/);
    });

    it('throws when steps is not an integer', () => {
      const props = { ...validProps, steps: 2.5 };
      expect(() => generate(props)).toThrow(ColorAlgorithmError);
    });

    it('throws when steps is negative', () => {
      const props = { ...validProps, steps: -5 };
      expect(() => generate(props)).toThrow(ColorAlgorithmError);
    });

    it('includes error code INVALID_STEPS', () => {
      const props = { ...validProps, steps: 1 };
      try {
        generate(props);
      } catch (e) {
        expect(e).toBeInstanceOf(ColorAlgorithmError);
        expect((e as ColorAlgorithmError).code).toBe(ErrorCodes.INVALID_STEPS);
      }
    });
  });

  describe('Hue Validation', () => {
    it('throws when hue.start is out of range', () => {
      const props = {
        ...validProps,
        hue: { ...validProps.hue, start: 400 },
      };
      expect(() => generate(props)).toThrow(/hue.start must be a number between 0-360/);
    });

    it('throws when hue.end is negative', () => {
      const props = {
        ...validProps,
        hue: { ...validProps.hue, end: -10 },
      };
      expect(() => generate(props)).toThrow(/hue.end must be a number between 0-360/);
    });

    it('throws when hue is missing', () => {
      const props = { ...validProps, hue: undefined } as unknown as ColorProps;
      expect(() => generate(props)).toThrow(/hue configuration is required/);
    });
  });

  describe('Saturation Validation', () => {
    it('throws when saturation.start is greater than 1', () => {
      const props = {
        ...validProps,
        saturation: { ...validProps.saturation, start: 1.5 },
      };
      expect(() => generate(props)).toThrow(/saturation.start must be a number between 0-1/);
    });

    it('throws when saturation.end is negative', () => {
      const props = {
        ...validProps,
        saturation: { ...validProps.saturation, end: -0.1 },
      };
      expect(() => generate(props)).toThrow(/saturation.end must be a number between 0-1/);
    });

    it('throws when saturation.rate is zero', () => {
      const props = {
        ...validProps,
        saturation: { ...validProps.saturation, rate: 0 },
      };
      expect(() => generate(props)).toThrow(/saturation.rate must be a positive number/);
    });

    it('throws when saturation.rate is negative', () => {
      const props = {
        ...validProps,
        saturation: { ...validProps.saturation, rate: -1 },
      };
      expect(() => generate(props)).toThrow(/saturation.rate must be a positive number/);
    });
  });

  describe('Brightness Validation', () => {
    it('throws when brightness.start is greater than 1', () => {
      const props = {
        ...validProps,
        brightness: { ...validProps.brightness, start: 2 },
      };
      expect(() => generate(props)).toThrow(/brightness.start must be a number between 0-1/);
    });

    it('throws when brightness.end is negative', () => {
      const props = {
        ...validProps,
        brightness: { ...validProps.brightness, end: -0.5 },
      };
      expect(() => generate(props)).toThrow(/brightness.end must be a number between 0-1/);
    });
  });

  describe('Curve Validation', () => {
    it('throws for unknown curve name', () => {
      const props = {
        ...validProps,
        hue: { ...validProps.hue, curve: 'unknownCurve' },
      };
      expect(() => generate(props)).toThrow(/unknown curve "unknownCurve"/);
    });

    it('lists valid curves in error message', () => {
      const props = {
        ...validProps,
        hue: { ...validProps.hue, curve: 'badCurve' },
      };
      expect(() => generate(props)).toThrow(/Valid curves:/);
      expect(() => generate(props)).toThrow(/linear/);
      expect(() => generate(props)).toThrow(/easeInQuad/);
    });

    it('throws when curve array has wrong length', () => {
      const props = {
        ...validProps,
        hue: { ...validProps.hue, curve: [0.5, 0.5, 0.5] as unknown as number[] },
      };
      expect(() => generate(props)).toThrow(/curve array must have exactly 4 numbers/);
    });

    it('throws when curve array contains NaN', () => {
      const props = {
        ...validProps,
        hue: { ...validProps.hue, curve: [0.5, NaN, 0.5, 0.5] },
      };
      expect(() => generate(props)).toThrow(/curve array must contain only valid numbers/);
    });

    it('accepts valid custom curve array', () => {
      const props = {
        ...validProps,
        hue: { ...validProps.hue, curve: [0.25, 0.1, 0.25, 1] },
      };
      expect(() => generate(props)).not.toThrow();
    });
  });

  describe('Options Validation', () => {
    it('throws for invalid lockHex format', () => {
      expect(() => generate(validProps, { lockHex: 'red' }))
        .toThrow(/invalid hex color "red"/);
    });

    it('throws for lockHex without hash', () => {
      expect(() => generate(validProps, { lockHex: '336699' }))
        .toThrow(/invalid hex color/);
    });

    it('accepts valid 6-digit hex', () => {
      expect(() => generate(validProps, { lockHex: '#336699' }))
        .not.toThrow();
    });

    it('accepts valid 3-digit hex', () => {
      expect(() => generate(validProps, { lockHex: '#369' }))
        .not.toThrow();
    });

    it('throws for invalid lockHexInverted', () => {
      expect(() => generate(validProps, { lockHexInverted: 'invalid', provideInverted: true }))
        .toThrow(/invalid hex color/);
    });

    it('throws when minorSteps is not an array', () => {
      expect(() => generate(validProps, { minorSteps: 'invalid' as unknown as number[] }))
        .toThrow(/minorSteps must be an array/);
    });

    it('throws when minorSteps contains non-numbers', () => {
      expect(() => generate(validProps, { minorSteps: [0, 'a', 2] as unknown as number[] }))
        .toThrow(/minorSteps must contain only valid numbers/);
    });
  });

  describe('Error Structure', () => {
    it('error has name ColorAlgorithmError', () => {
      try {
        generate({ ...validProps, steps: 0 });
      } catch (e) {
        expect((e as Error).name).toBe('ColorAlgorithmError');
      }
    });

    it('error has code property', () => {
      try {
        generate({ ...validProps, steps: 0 });
      } catch (e) {
        expect((e as ColorAlgorithmError).code).toBeDefined();
        expect(typeof (e as ColorAlgorithmError).code).toBe('string');
      }
    });

    it('error is instanceof Error', () => {
      try {
        generate({ ...validProps, steps: 0 });
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e).toBeInstanceOf(ColorAlgorithmError);
      }
    });
  });
});
