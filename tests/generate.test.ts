// tests/generate.test.ts

import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { generate } from '../src/index';
import generateColors from '../src/generate-colors';
import convertToColors from '../src/convert-to-colors';
import generateColorsWithLock from '../src/generate-colors-with-lock';

// Mock the dependencies
vi.mock('../src/generate-colors');
vi.mock('../src/convert-to-colors');
vi.mock('../src/generate-colors-with-lock');

describe('generate function', () => {
    const mockProps = {
        properties: {
            steps: 11,
            hue: {
                start: 220,
                end: 240,
                curve: 'easeOutQuad',
            },
            saturation: {
                start: 0.08,
                end: 1,
                rate: 1,
                curve: 'easeOutQuad',
            },
            brightness: {
                start: 1,
                end: 0.2,
                curve: 'easeInQuart',
            },
        },
        options: {
            minorSteps: [0, 1],
            name: 'Blue',
            provideInverted: false,
            rotation: 'clockwise' as const,
        },
    };

    const mockGeneratedColors = [{ /* mock color data */ }];
    const mockConvertedColors = { /* mock converted color results */ };

    beforeEach(() => {
        (generateColors as Mock).mockClear();
        (convertToColors as Mock).mockClear();
        (generateColorsWithLock as Mock).mockClear();
    });

    it('should generate colors and convert them without providing inverted colors', () => {
        (generateColors as Mock).mockReturnValue(mockGeneratedColors);
        (convertToColors as Mock).mockReturnValue(mockConvertedColors);

        const result = generate(mockProps.properties, mockProps.options);

        expect(generateColors).toHaveBeenCalledWith(mockProps.properties, mockProps.options);
        expect(generateColorsWithLock).not.toHaveBeenCalled(); // Since lockHex is not set
        expect(convertToColors).toHaveBeenCalledWith(mockProps.properties, mockProps.options, [mockGeneratedColors]);
        expect(result).toBe(mockConvertedColors);
    });

    it('should generate colors with lockHex', () => {
        const lockHexOptions = { ...mockProps.options, lockHex: "#000" };
        const mockLockedColors = [{ /* mock locked color data */ }];

        (generateColors as Mock).mockReturnValue(mockGeneratedColors);
        (generateColorsWithLock as Mock).mockReturnValue(mockLockedColors);
        (convertToColors as Mock).mockReturnValue(mockConvertedColors);

        const result = generate(mockProps.properties, lockHexOptions);

        expect(generateColors).toHaveBeenCalledWith(mockProps.properties, lockHexOptions);
        expect(generateColorsWithLock).toHaveBeenCalledWith(mockProps.properties, lockHexOptions, mockGeneratedColors);
        expect(convertToColors).toHaveBeenCalledWith(mockProps.properties, lockHexOptions, [mockLockedColors]);
        expect(result).toBe(mockConvertedColors);
    });

    it('should generate inverted colors when provideInverted is set', () => {
        const invertedOptions = { ...mockProps.options, provideInverted: true };
        const mockInvertedColors = [{ /* mock inverted color data */ }];

        (generateColors as Mock).mockReturnValueOnce(mockGeneratedColors).mockReturnValueOnce(mockInvertedColors);
        (convertToColors as Mock).mockReturnValue(mockConvertedColors);

        const result = generate(mockProps.properties, invertedOptions);

        expect(generateColors).toHaveBeenCalledTimes(2); // Called twice, once for normal and once for inverted
        expect(generateColors).toHaveBeenCalledWith(mockProps.properties, invertedOptions);
        expect(generateColors).toHaveBeenCalledWith(mockProps.properties, invertedOptions, true);
        expect(generateColorsWithLock).not.toHaveBeenCalled(); // Assuming lockHexInverted is not set
        expect(convertToColors).toHaveBeenCalledWith(mockProps.properties, invertedOptions, [mockGeneratedColors, mockInvertedColors]);
        expect(result).toBe(mockConvertedColors);
    });
});