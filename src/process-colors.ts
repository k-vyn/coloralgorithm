const chroma = require("chroma-js");
import { ColorProps } from "./types";

export default function processColors(props: ColorProps, colorSteps) {
  const { steps, minorSteps, hue, saturation, brightness, lockHex } = props;

  var map = [];
  var majorSteps = 0;

  colorSteps.map(function (o, i) {
    var params = {
      hue: o.hue,
      sat: o.sat,
      lum: o.lum,
    };
    if (params.sat > 1) {
      params.sat = 1;
    }
    var hex = chroma(chroma.hsv([params.hue, params.sat, params.lum]));
    var hexRGB = chroma(chroma.hsv([params.hue, params.sat, params.lum])).rgb();

    const contrastWhite = chroma.contrast(hex, "white").toFixed(2);
    const contrastBlack = chroma.contrast(hex, "black").toFixed(2);

    var displayColor = "";
    if (contrastWhite >= 4.5) {
      displayColor = "white";
    } else {
      displayColor = "black";
    }
    if (contrastWhite >= 4.5) {
      displayColor = "white";
    } else {
      displayColor = "black";
    }
    var isLock = false;
    if (lockHex) {
      if (lockHex.toUpperCase() == chroma(hex).hex().toUpperCase()) {
        isLock = true;
      }

      if (`#${lockHex.toUpperCase()}` == chroma(hex).hex().toUpperCase()) {
        isLock = true;
      }
    }

    var colorObj = {
      hex: chroma(hex).hex(),
      hue: chroma(hex).hsv()[0],
      sat: chroma(hex).hsv()[1],
      lum: chroma(hex).hsv()[2],
      hsv: chroma(hex).hsv(),
      hsl: chroma(hex).hsl(),
      rgb: chroma(hex).rgb(),
      hueRange: [hue.start, hue.end],
      steps: steps,
      label: o.step,
      contrastBlack: contrastBlack,
      contrastWhite: contrastWhite,
      displayColor: displayColor,
      lock: isLock,
    };

    if (isNaN(colorObj.hue)) {
      colorObj.hue = 0;
    }
    if (isNaN(colorObj.hsv[0])) {
      colorObj.hsv[0] = 0;
    }
    if (isNaN(colorObj.hsl[0])) {
      colorObj.hsl[0] = 0;
    }

    map.push(colorObj);
  });

  return map;
}
