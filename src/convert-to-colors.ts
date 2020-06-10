import { ColorProps, AlgorithmResult, Color, ColorOptions } from "./types";
const chroma = require("chroma-js");

export default function convertToColors(
  props: ColorProps,
  options: ColorOptions,
  algorithmResult: AlgorithmResult
) {
  const results = algorithmResult.map(function (set, i) {
    const colors = set.map(function ({
      hue,
      saturation,
      brightness,
      isMajor,
      isLocked,
      step,
    }) {
      const color = chroma.hsv(hue.value, saturation.value, brightness.value);
      function replaceNaN(array: number[]) {
        // fixes a NaN for 0 values in ChromaJS
        array[0] = 0;
        return array;
      }
      return {
        step,
        hue: hue.value,
        saturation: saturation.value,
        brightness: brightness.value,
        isMajor,
        isLocked,
        hex: color.hex(),
        hsl: isNaN(color.hsl()[0]) ? replaceNaN(color.hsl()) : color.hsl(),
        hsv: isNaN(color.hsv()[0]) ? replaceNaN(color.hsv()) : color.hsv(),
        lab: isNaN(color.lab()[0]) ? replaceNaN(color.lab()) : color.lab(),
        rgbString: color.rgb().join(),
        rgbArray: color.rgb(),
        rgbaString: color.rgba().join(),
        rgbaArray: color.rgba(),
      };
    });
    return {
      inverted: i > 0 ? true : false,
      colors: colors,
      name: options.name,
    };
  });
  return results;
}
