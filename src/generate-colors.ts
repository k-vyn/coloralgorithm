import { ColorProps, ColorStep, ColorSteps, ColorOptions } from "./types";
import distribute from "./distribute";
import generateSteps from "./generate-steps";
import getCoordinates from "./get-coordinates";

export default function generateColors(
  props: ColorProps,
  options: ColorOptions,
  invert?: boolean
): ColorSteps {
  const { steps, hue, saturation, brightness } = props;
  const { minorSteps } = options;

  // default rotation is clockwise
  const rotation =
    options.rotation === "counterclockwise" || options.rotation === "ccw"
      ? "ccw"
      : "cw";

  // generate steps 0 to 1 based on curve
  const hueSteps = generateSteps({
    curve: getCoordinates(hue.curve, invert),
    steps,
  });
  const saturationSteps = generateSteps({
    curve: getCoordinates(saturation.curve, invert),
    steps,
  });
  const brightnessSteps = generateSteps({
    curve: getCoordinates(brightness.curve, invert),
    steps,
  });

  // adjust hue start/end to get the intended rotation
  if (rotation === "cw") {
    if (hue.start > hue.end) {
      hue.start -= 360;
    }
  } else if (rotation === "ccw") {
    if (hue.end > hue.start) {
      hue.end -= 360;
    }
  }

  // Distribute the generated steps between hue, saturation, brightness ranges
  const hueValues = hueSteps.map(function (s) {
    return distribute({
      value: s,
      rangeA: [0, 1],
      rangeB: [
        invert === true ? hue.end : hue.start,
        invert === true ? hue.start : hue.end,
      ],
      limit: true,
    });
  });

  const saturationValues = saturationSteps.map(function (s) {
    const value = distribute({
      value: s,
      rangeA: [0, 1],
      rangeB: [
        invert === true ? saturation.end : saturation.start,
        invert === true ? saturation.start : saturation.end,
      ],
      limit: true,
    });
    const valueWithRate = value * saturation.rate;
    return valueWithRate < 1 ? valueWithRate : 1; // prevent too much satuartion saturation
  });

  const brightnessValues = brightnessSteps.map(function (s) {
    return distribute({
      value: s,
      rangeA: [0, 1],
      rangeB: [
        invert === true ? brightness.end : brightness.start,
        invert === true ? brightness.start : brightness.end,
      ],
    });
  });

  // Merge values into color steps
  const colorSteps: ColorSteps = hueValues.map(function (hue, i) {
    const step: ColorStep = {
      hue: {
        step: hueSteps[i] as number,
        value: hueValues[i] as number,
      },
      saturation: {
        step: saturationSteps[i] as number,
        value: saturationValues[i] as number,
      },
      brightness: {
        step: brightnessSteps[i] as number,
        value: brightnessValues[i] as number,
      },
      step: i,
      isMajor: true,
      isLocked: false,
    };
    return step;
  });

  // generate minor steps
  if (minorSteps) {
    minorSteps.forEach(function (o, i) {
      const defaultStep: ColorStep = {
        hue: {
          step: 0,
          value: 0,
        },
        saturation: {
          step: 0,
          value: 0,
        },
        brightness: {
          step: 0,
          value: 0,
        },
        isMajor: true,
        isLocked: false,
        step: 0,
      };

      let insertPreviousStep = defaultStep;
      let insertNextStep = defaultStep;
      let insertAtIndex = 0;

      colorSteps.forEach(function (p, j) {
        if (o === p.step) {
          insertAtIndex = j + 1;
          insertPreviousStep = p;
          insertNextStep = colorSteps[j + 1];
        }
      });

      const hueStep =
        (insertPreviousStep.hue.step + insertNextStep.hue.step) / 2;

      const hueValue = distribute({
        value: hueStep,
        rangeA: [0, 1],
        rangeB: [
          invert === true ? hue.end : hue.start,
          invert === true ? hue.start : hue.end,
        ],
      });

      const saturationStep =
        (insertPreviousStep.saturation.step + insertNextStep.saturation.step) /
        2;
      let saturationValue =
        distribute({
          value: saturationStep,
          rangeA: [0, 1],
          rangeB: [
            invert === true ? saturation.end : saturation.start,
            invert === true ? saturation.start : saturation.end,
          ],
        }) * saturation.rate;

      saturationValue = saturationValue < 1 ? saturationValue : 1;

      const brightnessStep =
        (insertPreviousStep.brightness.step + insertNextStep.brightness.step) /
        2;

      const brightnessValue = distribute({
        value: brightnessStep,
        rangeA: [0, 1],
        rangeB: [
          invert === true ? brightness.end : brightness.start,
          invert === true ? brightness.start : brightness.end,
        ],
      });

      if (insertAtIndex !== undefined) {
        const insertItem: ColorStep = {
          hue: {
            step: hueStep,
            value: hueValue,
          },
          saturation: {
            step: saturationStep,
            value: saturationValue,
          },
          brightness: {
            step: brightnessStep,
            value: brightnessValue,
          },
          isLocked: false,
          isMajor: false,
          step: (insertPreviousStep.step + insertNextStep.step) / 2,
        };
        colorSteps.splice(insertAtIndex, 0, insertItem);
      }
    });
  }

  return colorSteps;
}
