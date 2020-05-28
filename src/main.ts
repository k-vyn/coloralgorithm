import { ColorProps, ColorStep } from "./types";
import defaultCurves from "./default-curves";
import processColors from "./process-colors";
import distribute from "./distribute";
import generateSteps from "./generate-steps";
import getCoordinates from "./get-coordinates";
const bezier = require("bezier-easing");

export default function (props: ColorProps) {
  const { steps, minorSteps, hue, saturation, brightness, lockHex } = props;
  console.log(props);
  let brightnessArray = generateSteps({
    curve: bezier(...getCoordinates(brightness.curve)),
    steps,
  });
  let saturationArray = generateSteps({
    curve: bezier(...getCoordinates(saturation.curve)),
    steps,
  });
  let hueArray = generateSteps({
    curve: bezier(...getCoordinates(hue.curve)),
    steps,
  });

  const majorSteps = [];

  // Distrbute hue, saturation, brightness values across curves.
  brightnessArray = brightnessArray
    .map(function (s) {
      return distribute({
        value: s,
        rangeA: [0, 1],
        rangeB: [brightness.end * 0.01, brightness.start * 0.01],
      });
    })
    .reverse();

  saturationArray = saturationArray
    .map(function (s) {
      return distribute({
        value: s,
        rangeA: [0, 1],
        rangeB: [saturation.start * 0.01, saturation.end * 0.01],
      });
    })
    .reverse();

  hueArray = hueArray
    .map(function (s) {
      return distribute({
        value: s,
        rangeA: [0, 1],
        rangeB: [hue.start, hue.end],
      });
    })
    .reverse();

  // Consolidate into color steps

  const colorSteps: ColorStep[] = hueArray.map(function (hue, i) {
    const step: ColorStep = {
      hue: hueArray[i] as number,
      saturation: saturationArray[i] as number,
      brightness: brightnessArray[i] as number,
      index: i,
      isMajor: true,
    };
    return step;
  });

  minorSteps.map(function (o, i) {
    const defaultStep: ColorStep = {
      hue: 0,
      saturation: 0,
      brightness: 0,
      isMajor: true,
      index: 0,
    };

    let insertPreviousStep = defaultStep;
    let insertNextStep = defaultStep;
    let insertAtIndex = 0;

    colorSteps.map(function (p, j) {
      if (o == p.index) {
        insertAtIndex = j + 1;
        insertPreviousStep = p;
        insertNextStep = colorSteps[j + 1];
      }
    });

    const hueStep = (insertPreviousStep.hue + insertNextStep.hue) / 2;
    const hueValue = distribute({
      value: hueStep,
      rangeA: [0, 1],
      rangeB: [hue.start, hue.end],
    });

    const satStep =
      (insertPreviousStep.saturation + insertNextStep.saturation) / 2;
    const satValue =
      distribute({
        value: satStep,
        rangeA: [0, 1],
        rangeB: [saturation.start * 0.01, saturation.end * 0.01],
      }) *
      (saturation.rate * 0.01);

    const brightnessStep =
      (insertPreviousStep.brightness + insertNextStep.brightness) / 2;
    const brightnessValue = distribute({
      value: brightnessStep,
      rangeA: [0, 1],
      rangeB: [brightness.end * 0.01, brightness.start * 0.01],
    });

    if (insertAtIndex != undefined) {
      const insertItem: ColorStep = {
        hue: hueValue,
        saturation: satValue,
        brightness: brightnessValue,
        isMajor: false,
        index: (insertPreviousStep.index + insertNextStep.index) / 2,
      };
      colorSteps.splice(insertAtIndex, 0, insertItem);
    }
  });

  var colorMap = processColors(props, colorSteps);

  // if (lockHex) {
  //   colorMap = generateColorsWithLock(specs, colorMap, specs.lock_hex);
  // }

  return colorMap;
}
