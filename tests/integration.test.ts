/**
 * Integration tests for coloralgorithm
 * These tests call the actual generate() function without mocks
 * to verify real color output
 */

import { describe, it, expect } from 'vitest';
import { generate } from '../src/index';
import { ColorProps, ColorOptions } from '../src/types';

describe('Integration: Color Generation', () => {
  // Standard test props used across multiple tests
  const basicProps: ColorProps = {
    steps: 5,
    hue: { start: 200, end: 240, curve: 'linear' },
    saturation: { start: 0.3, end: 1, rate: 1, curve: 'linear' },
    brightness: { start: 1, end: 0.2, curve: 'linear' },
  };

  describe('Output Structure', () => {
    it('returns single color set by default', () => {
      const result = generate(basicProps);

      expect(result).toHaveLength(1);
      expect(result[0].inverted).toBe(false);
    });

    it('includes all required color properties', () => {
      const result = generate(basicProps);
      const color = result[0].colors[0];

      expect(color).toHaveProperty('step');
      expect(color).toHaveProperty('hue');
      expect(color).toHaveProperty('saturation');
      expect(color).toHaveProperty('brightness');
      expect(color).toHaveProperty('isMajor');
      expect(color).toHaveProperty('isLocked');
      expect(color).toHaveProperty('hex');
      expect(color).toHaveProperty('hsl');
      expect(color).toHaveProperty('hsv');
      expect(color).toHaveProperty('lab');
      expect(color).toHaveProperty('rgbString');
      expect(color).toHaveProperty('rgbArray');
      expect(color).toHaveProperty('rgbaString');
      expect(color).toHaveProperty('rgbaArray');
    });

    it('generates correct number of steps', () => {
      const result = generate(basicProps);

      expect(result[0].colors).toHaveLength(5);
    });

    it('marks all colors as major by default', () => {
      const result = generate(basicProps);

      result[0].colors.forEach(color => {
        expect(color.isMajor).toBe(true);
      });
    });
  });

  describe('Color Value Validation', () => {
    it('produces valid hex colors', () => {
      const result = generate(basicProps);

      result[0].colors.forEach(color => {
        expect(color.hex).toMatch(/^#[0-9a-f]{6}$/i);
      });
    });

    it('produces valid HSL values', () => {
      const result = generate(basicProps);

      result[0].colors.forEach(color => {
        const [h, s, l] = color.hsl;
        expect(h).toBeGreaterThanOrEqual(0);
        expect(h).toBeLessThanOrEqual(360);
        expect(s).toBeGreaterThanOrEqual(0);
        expect(s).toBeLessThanOrEqual(1);
        expect(l).toBeGreaterThanOrEqual(0);
        expect(l).toBeLessThanOrEqual(1);
      });
    });

    it('produces valid HSV values', () => {
      const result = generate(basicProps);

      result[0].colors.forEach(color => {
        const [h, s, v] = color.hsv;
        expect(h).toBeGreaterThanOrEqual(0);
        expect(h).toBeLessThanOrEqual(360);
        expect(s).toBeGreaterThanOrEqual(0);
        expect(s).toBeLessThanOrEqual(1);
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
      });
    });

    it('produces valid RGB values', () => {
      const result = generate(basicProps);

      result[0].colors.forEach(color => {
        color.rgbArray.forEach(value => {
          expect(value).toBeGreaterThanOrEqual(0);
          expect(value).toBeLessThanOrEqual(255);
          expect(Number.isInteger(value)).toBe(true);
        });
      });
    });
  });

  describe('Algorithm Correctness', () => {
    it('first color approximately matches start values', () => {
      const result = generate(basicProps);
      const firstColor = result[0].colors[0];

      // Allow small tolerance for floating point
      expect(firstColor.hue).toBeCloseTo(basicProps.hue.start, 0);
      expect(firstColor.saturation).toBeCloseTo(basicProps.saturation.start, 1);
      expect(firstColor.brightness).toBeCloseTo(basicProps.brightness.start, 1);
    });

    it('last color approximately matches end values', () => {
      const result = generate(basicProps);
      const colors = result[0].colors;
      const lastColor = colors[colors.length - 1];

      expect(lastColor.hue).toBeCloseTo(basicProps.hue.end, 0);
      expect(lastColor.saturation).toBeCloseTo(basicProps.saturation.end, 1);
      expect(lastColor.brightness).toBeCloseTo(basicProps.brightness.end, 1);
    });

    it('linear curve produces evenly spaced brightness progression', () => {
      const result = generate(basicProps);
      const colors = result[0].colors;

      // Calculate expected step size for brightness
      const brightnessRange = basicProps.brightness.end - basicProps.brightness.start;
      const expectedStep = brightnessRange / (basicProps.steps - 1);

      // Check each step (allowing small tolerance)
      for (let i = 1; i < colors.length; i++) {
        const actualStep = colors[i].brightness - colors[i - 1].brightness;
        expect(actualStep).toBeCloseTo(expectedStep, 1);
      }
    });

    it('different curves produce different midpoint values', () => {
      const easeInProps: ColorProps = {
        ...basicProps,
        brightness: { start: 1, end: 0, curve: 'easeInQuad' },
      };
      const easeOutProps: ColorProps = {
        ...basicProps,
        brightness: { start: 1, end: 0, curve: 'easeOutQuad' },
      };

      const easeInResult = generate(easeInProps);
      const easeOutResult = generate(easeOutProps);

      // Get midpoint brightness values
      const midIndex = Math.floor(basicProps.steps / 2);
      const easeInMid = easeInResult[0].colors[midIndex].brightness;
      const easeOutMid = easeOutResult[0].colors[midIndex].brightness;

      // easeIn should have higher midpoint (slower start)
      // easeOut should have lower midpoint (faster start)
      expect(easeInMid).toBeGreaterThan(easeOutMid);
    });
  });

  describe('Options', () => {
    it('provideInverted returns two color sets', () => {
      const options: ColorOptions = { provideInverted: true };
      const result = generate(basicProps, options);

      expect(result).toHaveLength(2);
      expect(result[0].inverted).toBe(false);
      expect(result[1].inverted).toBe(true);
    });

    it('lockHex includes specified color in output', () => {
      const targetHex = '#3366cc';
      const options: ColorOptions = { lockHex: targetHex };
      const result = generate(basicProps, options);

      const hasLockedColor = result[0].colors.some(
        color => color.hex.toLowerCase() === targetHex.toLowerCase()
      );
      const lockedColor = result[0].colors.find(color => color.isLocked);

      expect(hasLockedColor).toBe(true);
      expect(lockedColor).toBeDefined();
    });

    it('name appears in result', () => {
      const options: ColorOptions = { name: 'Ocean Blue' };
      const result = generate(basicProps, options);

      expect(result[0].name).toBe('Ocean Blue');
    });

    it('minorSteps adds intermediate colors', () => {
      const options: ColorOptions = { minorSteps: [0, 1, 2] };
      const result = generate(basicProps, options);

      // minorSteps adds colors between major steps
      // With 5 steps and minorSteps at [0, 1, 2], we get additional intermediate colors
      expect(result[0].colors.length).toBeGreaterThan(5);

      // Check that some colors are marked as not major
      const hasMinorColors = result[0].colors.some(color => !color.isMajor);
      expect(hasMinorColors).toBe(true);
    });

    it('counterclockwise rotation reverses hue direction', () => {
      const cwOptions: ColorOptions = { rotation: 'clockwise' };
      const ccwOptions: ColorOptions = { rotation: 'counterclockwise' };

      // Props where direction matters: hue going from low to high
      const hueProps: ColorProps = {
        steps: 5,
        hue: { start: 10, end: 350, curve: 'linear' },
        saturation: { start: 0.5, end: 0.5, rate: 1, curve: 'linear' },
        brightness: { start: 0.5, end: 0.5, curve: 'linear' },
      };

      const cwResult = generate(hueProps, cwOptions);
      const ccwResult = generate(hueProps, ccwOptions);

      // Clockwise: 10 -> 350 goes through higher numbers (10, 95, 180, 265, 350)
      // Counter-clockwise: 10 -> 350 goes through 0 (10, 5, 0, 355, 350)
      const cwMidHue = cwResult[0].colors[2].hue;
      const ccwMidHue = ccwResult[0].colors[2].hue;

      // The midpoints should be very different
      expect(Math.abs(cwMidHue - ccwMidHue)).toBeGreaterThan(90);
    });
  });

  describe('Edge Cases', () => {
    it('works with custom bezier curve array', () => {
      const customCurveProps: ColorProps = {
        steps: 5,
        hue: { start: 0, end: 100, curve: [0.25, 0.1, 0.25, 1] },
        saturation: { start: 0.5, end: 1, rate: 1, curve: [0.42, 0, 1, 1] },
        brightness: { start: 1, end: 0.5, curve: [0, 0, 0.58, 1] },
      };

      const result = generate(customCurveProps);

      expect(result[0].colors).toHaveLength(5);
      result[0].colors.forEach(color => {
        expect(color.hex).toMatch(/^#[0-9a-f]{6}$/i);
      });
    });

    it('handles minimum steps (2)', () => {
      const minProps: ColorProps = {
        steps: 2,
        hue: { start: 0, end: 180, curve: 'linear' },
        saturation: { start: 0.5, end: 1, rate: 1, curve: 'linear' },
        brightness: { start: 1, end: 0.5, curve: 'linear' },
      };

      const result = generate(minProps);

      expect(result[0].colors).toHaveLength(2);
      expect(result[0].colors[0].hue).toBeCloseTo(0, 0);
      expect(result[0].colors[1].hue).toBeCloseTo(180, 0);
    });
  });

  describe('Regression', () => {
    it('matches snapshot for standard blue palette', () => {
      const blueProps: ColorProps = {
        steps: 11,
        hue: { start: 220, end: 240, curve: 'easeOutQuad' },
        saturation: { start: 0.08, end: 1, rate: 1, curve: 'easeOutQuad' },
        brightness: { start: 1, end: 0.2, curve: 'easeInQuart' },
      };

      const result = generate(blueProps, { name: 'Blue' });

      // Snapshot the hex values for regression testing
      const hexValues = result[0].colors.map(c => c.hex);
      expect(hexValues).toMatchSnapshot();
    });
  });
});
