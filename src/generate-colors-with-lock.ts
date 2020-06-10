import distribute from "./distribute";
import { ColorProps, ColorStep, ColorSteps, ColorOptions } from "./types";
const chroma = require("chroma-js");

function replaceNaN(array: number[]) {
  // fixes a NaN for 0 values in ChromaJS
  array[0] = 0;
  return array;
}

function convertToNamedObject(hsv: number[]) {
  return {
    hue: hsv[0],
    saturation: hsv[1],
    brightness: hsv[2],
  };
}

export default function generateColorsWithLock(
  props: ColorProps,
  options: ColorOptions,
  results: ColorSteps
): ColorSteps {
  const lockHSV = isNaN(chroma.hex(`${options.lockHex}`).hsv()[0])
    ? convertToNamedObject(replaceNaN(chroma.hex(`${options.lockHex}`).hsv()))
    : convertToNamedObject(chroma.hex(`${options.lockHex}`).hsv());

  let shortestDistance = 999999;
  let lockedColor: ColorStep;
  let lockedIndex: number;

  const lastColor = results[results.length - 1];

  results.forEach(function (color, index) {
    const { hue, saturation, brightness } = color;
    const hex = chroma.hsv(hue.value, saturation.value, brightness.value);
    const distance = chroma.distance(hex, options.lockHex);
    if (shortestDistance > distance) {
      shortestDistance = distance;
      lockedColor = color;
      lockedIndex = index;
    }
  });

  const difference = {
    hue: lockHSV.hue - lockedColor.hue.value,
    saturation: lockHSV.saturation - lockedColor.saturation.value,
    brightness: lockHSV.brightness - lockedColor.brightness.value,
  };

  const adjustedColorSet = results.map(function (color, index) {
    if (index < lockedIndex) {
      const hueDifference = distribute({
        value: index,
        rangeA: [0, lockedIndex],
        rangeB: [0, difference.hue],
      });
      const saturationDifference = distribute({
        value: index,
        rangeA: [0, lockedIndex],
        rangeB: [0, difference.saturation],
      });
      const brightnessDifference = distribute({
        value: index,
        rangeA: [0, lockedIndex],
        rangeB: [0, difference.brightness],
      });
      return {
        hue: {
          step: color.hue.step,
          value:
            color.hue.value + hueDifference > 0
              ? color.hue.value + hueDifference
              : 0,
        },
        saturation: {
          step: color.saturation.step,
          value:
            color.saturation.value + saturationDifference > 0
              ? color.saturation.value + saturationDifference
              : 0,
        },
        brightness: {
          step: color.brightness.step,
          value:
            color.brightness.value + brightnessDifference > 0
              ? color.brightness.value + brightnessDifference
              : 0,
        },
        step: color.step,
        isMajor: color.isMajor,
        isLocked: false,
      } as ColorStep;
    } else if (index === lockedIndex) {
      return {
        hue: { step: color.hue.step, value: lockHSV.hue },
        saturation: { step: color.saturation.step, value: lockHSV.saturation },
        brightness: { step: color.brightness.step, value: lockHSV.brightness },
        step: color.step,
        isMajor: color.isMajor,
        isLocked: true,
      };
    } else {
      const hueDifference = distribute({
        value: index,
        rangeA: [lockedIndex, lastColor.step + options.minorSteps.length],
        rangeB: [difference.hue, 0],
      });
      const saturationDifference = distribute({
        value: index,
        rangeA: [lockedIndex, lastColor.step + options.minorSteps.length],
        rangeB: [difference.saturation, 0],
      });
      const brightnessDifference = distribute({
        value: index,
        rangeA: [lockedIndex, lastColor.step + options.minorSteps.length],
        rangeB: [difference.brightness, 0],
      });
      return {
        hue: {
          step: color.hue.step,
          value:
            color.hue.value + hueDifference > 0 ||
            color.hue.value + hueDifference < 360
              ? color.hue.value + hueDifference
              : 0,
        },
        saturation: {
          step: color.saturation.step,
          value:
            color.saturation.value + saturationDifference < 1
              ? color.saturation.value + saturationDifference
              : 1,
        },
        brightness: {
          step: color.brightness.step,
          value:
            color.brightness.value + brightnessDifference < 1
              ? color.brightness.value + brightnessDifference
              : 1,
        },
        step: color.step,
        isMajor: color.isMajor,
        isLocked: false,
      };
    }
  });
  return adjustedColorSet;
}
