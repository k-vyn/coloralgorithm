const chroma = require("chroma-js");

/**
 * https://github.com/gre/bezier-easing
 * BezierEasing - use bezier curve for transition easing function
 * by Gaëtan Renaudeau 2014 - 2015 – MIT License
 */

// These values are established by empiricism with tests (tradeoff: performance VS precision)
var NEWTON_ITERATIONS = 4;
var NEWTON_MIN_SLOPE = 0.001;
var SUBDIVISION_PRECISION = 0.0000001;
var SUBDIVISION_MAX_ITERATIONS = 10;

var kSplineTableSize = 11;
var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

var float32ArraySupported = typeof Float32Array === "function";

function A(aA1, aA2) {
  return 1.0 - 3.0 * aA2 + 3.0 * aA1;
}
function B(aA1, aA2) {
  return 3.0 * aA2 - 6.0 * aA1;
}
function C(aA1) {
  return 3.0 * aA1;
}

// Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
function calcBezier(aT, aA1, aA2) {
  return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
}

// Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
function getSlope(aT, aA1, aA2) {
  return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
}

function binarySubdivide(aX, aA, aB, mX1, mX2) {
  var currentX,
    currentT,
    i = 0;
  do {
    currentT = aA + (aB - aA) / 2.0;
    currentX = calcBezier(currentT, mX1, mX2) - aX;
    if (currentX > 0.0) {
      aB = currentT;
    } else {
      aA = currentT;
    }
  } while (
    Math.abs(currentX) > SUBDIVISION_PRECISION &&
    ++i < SUBDIVISION_MAX_ITERATIONS
  );
  return currentT;
}

function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
  for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
    var currentSlope = getSlope(aGuessT, mX1, mX2);
    if (currentSlope === 0.0) {
      return aGuessT;
    }
    var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
    aGuessT -= currentX / currentSlope;
  }
  return aGuessT;
}

function LinearEasing(x) {
  return x;
}

function bezier(mX1, mY1, mX2, mY2) {
  if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
    throw new Error("bezier x values must be in [0, 1] range");
  }

  if (mX1 === mY1 && mX2 === mY2) {
    return LinearEasing;
  }

  // Precompute samples table
  var sampleValues = float32ArraySupported
    ? new Float32Array(kSplineTableSize)
    : new Array(kSplineTableSize);
  for (var i = 0; i < kSplineTableSize; ++i) {
    sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
  }

  function getTForX(aX) {
    var intervalStart = 0.0;
    var currentSample = 1;
    var lastSample = kSplineTableSize - 1;

    for (
      ;
      currentSample !== lastSample && sampleValues[currentSample] <= aX;
      ++currentSample
    ) {
      intervalStart += kSampleStepSize;
    }
    --currentSample;

    // Interpolate to provide an initial guess for t
    var dist =
      (aX - sampleValues[currentSample]) /
      (sampleValues[currentSample + 1] - sampleValues[currentSample]);
    var guessForT = intervalStart + dist * kSampleStepSize;

    var initialSlope = getSlope(guessForT, mX1, mX2);
    if (initialSlope >= NEWTON_MIN_SLOPE) {
      return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
    } else if (initialSlope === 0.0) {
      return guessForT;
    } else {
      return binarySubdivide(
        aX,
        intervalStart,
        intervalStart + kSampleStepSize,
        mX1,
        mX2
      );
    }
  }

  return function BezierEasing(x) {
    // Because JavaScript number are imprecise, we should guarantee the extremes are right.
    if (x === 0) {
      return 0;
    }
    if (x === 1) {
      return 1;
    }
    return calcBezier(getTForX(x), mY1, mY2);
  };
}

const curves = [
  {
    name: "linear",
    formatted_name: "Linear",
    value: bezier(0.5, 0.5, 0.5, 0.5),
  },
  {
    name: "easeInCubic",
    formatted_name: "Cubic - EaseIn",
    value: bezier(0.55, 0.055, 0.675, 0.19),
  },
  {
    name: "easeOutCubic",
    formatted_name: "Cubic - EaseOut",
    value: bezier(0.215, 0.61, 0.355, 1),
  },
  {
    name: "easeInOutCubic",
    formatted_name: "Cubic - EaseInOut",
    value: bezier(0.645, 0.045, 0.355, 1),
  },
  {
    name: "easeInSine",
    formatted_name: "Sine - EaseIn",
    value: bezier(0.47, 0, 0.745, 0.715),
  },
  {
    name: "easeOutSine",
    formatted_name: "Sine - EaseOut",
    value: bezier(0.39, 0.575, 0.565, 1),
  },
  {
    name: "easeInOutSine",
    formatted_name: "Sine - EaseInOut",
    value: bezier(0.445, 0.05, 0.55, 0.95),
  },
  {
    name: "easeInQuad",
    formatted_name: "Quad - EaseIn",
    value: bezier(0.55, 0.085, 0.68, 0.53),
  },
  {
    name: "easeOutQuad",
    formatted_name: "Quad - EaseOut",
    value: bezier(0.25, 0.46, 0.45, 0.94),
  },
  {
    name: "easeInOutQuad",
    formatted_name: "Quad - EaseInOut",
    value: bezier(0.455, 0.03, 0.515, 0.955),
  },
  {
    name: "easeInQuart",
    formatted_name: "Quart - EaseIn",
    value: bezier(0.895, 0.03, 0.685, 0.22),
  },
  {
    name: "easeOutQuart",
    formatted_name: "Quart - EaseOut",
    value: bezier(0.165, 0.84, 0.44, 1),
  },
  {
    name: "easeInOutQuart",
    formatted_name: "Quart - EaseInOut",
    value: bezier(0.77, 0, 0.175, 1),
  },
  {
    name: "easeInQuint",
    formatted_name: "Quint - EaseIn",
    value: bezier(0.755, 0.05, 0.855, 0.06),
  },
  {
    name: "easeOutQuint",
    formatted_name: "Quint - EaseOut",
    value: bezier(0.23, 1, 0.32, 1),
  },
  {
    name: "easeInOutQuint",
    formatted_name: "Quint - EaseInOut",
    value: bezier(0.86, 0, 0.07, 1),
  },
  {
    name: "easeInCirc",
    formatted_name: "Circ - EaseIn",
    value: bezier(0.6, 0.04, 0.98, 0.335),
  },
  {
    name: "easeOutCirc",
    formatted_name: "Circ - EaseOut",
    value: bezier(0.075, 0.82, 0.165, 1),
  },
  {
    name: "easeInOutCirc",
    formatted_name: "Circ - EaseInOut",
    value: bezier(0.785, 0.135, 0.15, 0.86),
  },
  {
    name: "easeInExpo",
    formatted_name: "Expo - EaseIn",
    value: bezier(0.95, 0.05, 0.795, 0.035),
  },
  {
    name: "easeOutExpo",
    formatted_name: "Expo - EaseOut",
    value: bezier(0.19, 1, 0.22, 1),
  },
  {
    name: "easeInOutExpo",
    formatted_name: "Expo - EaseInOut",
    value: bezier(1, 0, 0, 1),
  },
  {
    name: "easeInBack",
    formatted_name: "Back - EaseIn",
    value: bezier(0.6, -0.28, 0.735, 0.045),
  },
  {
    name: "easeOutBack",
    formatted_name: "Back - EaseOut",
    value: bezier(0.175, 0.885, 0.32, 1.275),
  },
  {
    name: "easeInOutBack",
    formatted_name: "Back - EaseInOut",
    value: bezier(0.68, -0.55, 0.265, 1.55),
  },
];

const linear = bezier(0.5, 0.5, 0.5, 0.5);

const easeInCubic = bezier(0.55, 0.055, 0.675, 0.19);
const easeOutCubic = bezier(0.215, 0.61, 0.355, 1);
const easeInOutCubic = bezier(0.645, 0.045, 0.355, 1);

const easeInSine = bezier(0.47, 0, 0.745, 0.715);
const easeOutSine = bezier(0.39, 0.575, 0.565, 1);
const easeInOutSine = bezier(0.445, 0.05, 0.55, 0.95);

const easeInQuad = bezier(0.55, 0.085, 0.68, 0.53);
const easeOutQuad = bezier(0.25, 0.46, 0.45, 0.94);
const easeInOutQuad = bezier(0.455, 0.03, 0.515, 0.955);

const easeInQuart = bezier(0.895, 0.03, 0.685, 0.22);
const easeOutQuart = bezier(0.165, 0.84, 0.44, 1);
const easeInOutQuart = bezier(0.77, 0, 0.175, 1);

///
const easeInCirc = bezier(0.6, 0.04, 0.98, 0.335);
const easeOutCirc = bezier(0.075, 0.82, 0.165, 1);
const easeInOutCirc = bezier(0.785, 0.135, 0.15, 0.86);

const easeInQuint = bezier(0.755, 0.05, 0.855, 0.06);
const easeOutQuint = bezier(0.23, 1, 0.32, 1);
const easeInOutQuint = bezier(0.86, 0, 0.07, 1);

const easeInExpo = bezier(0.95, 0.05, 0.795, 0.035);
const easeOutExpo = bezier(0.19, 1, 0.22, 1);
const easeInOutExpo = bezier(1, 0, 0, 1);

const easeInBack = bezier(0.6, -0.28, 0.735, 0.045);
const easeOutBack = bezier(0.175, 0.885, 0.32, 1.275);
const easeInOutBack = bezier(0.68, -0.55, 0.265, 1.55);

function distribute(value, rangeA, rangeB) {
  const [fromLow, fromHigh] = Array.from(rangeA);
  const [toLow, toHigh] = Array.from(rangeB);

  const result =
    toLow + ((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow);

  if (toLow < toHigh) {
    if (result < toLow) {
      return toLow;
    }
    if (result > toHigh) {
      return toHigh;
    }
  } else {
    if (result > toLow) {
      return toLow;
    }
    if (result < toHigh) {
      return toHigh;
    }
  }

  return result;
}

function processColorsFromArrays(specs, arrayOfValues) {
  var map = [];
  var majorSteps = 0;

  arrayOfValues.map(function (o, i) {
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
    if (specs.lock_heck) {
      if (specs.lock_hex.toUpperCase() == chroma(hex).hex().toUpperCase()) {
        isLock = true;
      }

      if (
        `#${specs.lock_hex.toUpperCase()}` == chroma(hex).hex().toUpperCase()
      ) {
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
      hueRange: [specs.hue_start, specs.hue_end],
      steps: specs.steps,
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

function generateColorsWithLock(specs, colorMap, minorStepIndices) {
  var map = [];
  const lock = specs.lock_hex;
  var lockHsv = chroma(lock).hsv();
  if (isNaN(lockHsv[0])) {
    lockHsv[0] = 0;
  }

  const lockObj = { hue: lockHsv[0], sat: lockHsv[1], lum: lockHsv[2] };

  var shortestDistance = 999999;
  var lockColorObj = {
    hue: 0,
    sat: 0,
    lum: 0,
  };

  for (var obj of colorMap) {
    const calcDistance = chroma.deltaE(obj.hex, lock);

    if (shortestDistance > calcDistance) {
      shortestDistance = calcDistance;
      lockColorObj = obj;
    }
  }

  const lockColorIndex = colorMap.indexOf(lockColorObj);

  var updatedArrays = [];

  const delta = {
    hue: lockObj.hue - lockColorObj.hue,
    sat: lockObj.sat - lockColorObj.sat,
    lum: lockObj.lum - lockColorObj.lum,
  };

  for (var i in colorMap) {
    // Is before lock

    var item = { step: 0, hue: 0, sat: 0, lum: 0 };

    if (i < lockColorIndex) {
      const deltaAdjusted = {
        hue: distribute(i, [0, lockColorIndex], [0, delta.hue]),
        sat: distribute(i, [0, lockColorIndex], [0, delta.sat]),
        lum: distribute(i, [0, lockColorIndex], [0, delta.lum]),
      };

      item.hue = colorMap[i].hue + deltaAdjusted.hue;
      item.sat = colorMap[i].sat + deltaAdjusted.sat;
      item.lum = colorMap[i].lum + deltaAdjusted.lum;
    }
    // Is lock
    if (i == lockColorIndex) {
      item.hue = lockObj.hue;
      item.sat = lockObj.sat;
      item.lum = lockObj.lum;
    }

    // is after lock
    if (i > lockColorIndex) {
      const deltaAdjusted = {
        hue: distribute(
          i,
          [lockColorIndex, colorMap.length - 1],
          [delta.hue, 0]
        ),
        sat: distribute(
          i,
          [lockColorIndex, colorMap.length - 1],
          [delta.sat, 0]
        ),
        lum: distribute(
          i,
          [lockColorIndex, colorMap.length - 1],
          [delta.lum, 0]
        ),
      };

      item.hue = colorMap[i].hue + deltaAdjusted.hue;
      item.sat = colorMap[i].sat + deltaAdjusted.sat;
      item.lum = colorMap[i].lum + deltaAdjusted.lum;
    }
    item.step = colorMap[i].label;
    updatedArrays.push(item);
  }

  return processColorsFromArrays(specs, updatedArrays);
}

module.exports = function (specs) {
  if (specs === undefined) {
    console.log("No specs");
    return undefined;
  }
  function generateNumberOfSteps(curve, steps) {
    var array = [];
    for (var step in Array.from(Array(steps).keys())) {
      const numStep = parseInt(step);
      const value = curve(numStep / (steps - 1));
      array.push(value);
    }
    array.reverse();
    return array;
  }
  var lum_array = generateNumberOfSteps(
    curves.filter((o) => {
      return o.name === specs.lum_curve;
    })[0].value,
    specs.steps
  );
  var sat_array = generateNumberOfSteps(
    curves.filter((o) => {
      return o.name === specs.sat_curve;
    })[0].value,
    specs.steps
  );
  var hue_array = generateNumberOfSteps(
    curves.filter((o) => {
      return o.name === specs.hue_curve;
    })[0].value,
    specs.steps
  );

  var lum_array_adjusted = [];
  var sat_array_adjusted = [];
  var hue_array_adjusted = [];

  for (var index in lum_array) {
    const step = lum_array[index];
    lum_array_adjusted.push(
      distribute(step, [0, 1], [specs.lum_end * 0.01, specs.lum_start * 0.01])
    );
  }

  for (var index in sat_array) {
    const step = sat_array[index];
    var sat_step = distribute(
      step,
      [0, 1],
      [specs.sat_start * 0.01, specs.sat_end * 0.01]
    );

    sat_step = sat_step * (specs.sat_rate * 0.01);
    sat_array_adjusted.push(sat_step);
  }

  for (var index in hue_array) {
    const step = hue_array[index];
    hue_array_adjusted.push(
      distribute(step, [0, 1], [specs.hue_start, specs.hue_end])
    );
  }

  sat_array_adjusted.reverse();
  sat_array.reverse();
  hue_array_adjusted.reverse();
  hue_array.reverse();

  const arrays = {
    hue: hue_array_adjusted,
    hue_steps: hue_array,
    sat: sat_array_adjusted,
    sat_steps: sat_array,
    lum: lum_array_adjusted,
    lum_steps: lum_array,
  };

  const arrayOfValues = [];

  arrays.hue.map(function (o, i) {
    const item = {
      hue: arrays.hue[i],
      hueStep: arrays.hue_steps[i],
      sat: arrays.sat[i],
      satStep: arrays.sat_steps[i],
      lum: arrays.lum[i],
      lumStep: arrays.lum_steps[i],
      major: true,
      step: i * 10,
    };
    arrayOfValues.push(item);
  });
  specs.minor_steps.map(function (o, i) {
    if (isNaN(o) == false) {
      var insertPreviousItem = { step: 0, hueStep: 0, satStep: 0, lumStep: 0 };
      var insertAtIndex = undefined;
      var insertNextItem = { step: 0, hueStep: 0, satStep: 0, lumStep: 0 };

      arrayOfValues.map(function (p, j) {
        if (o == p.step) {
          insertAtIndex = j + 1;
          insertPreviousItem = p;
          insertNextItem = arrayOfValues[j + 1];
        }
      });

      const hueStep = (insertPreviousItem.hueStep + insertNextItem.hueStep) / 2;
      const hueValue = distribute(
        hueStep,
        [0, 1],
        [specs.hue_start, specs.hue_end]
      );

      const satStep = (insertPreviousItem.satStep + insertNextItem.satStep) / 2;
      const satValue =
        distribute(
          satStep,
          [0, 1],
          [specs.sat_start * 0.01, specs.sat_end * 0.01]
        ) *
        (specs.sat_rate * 0.01);

      const lumStep = (insertPreviousItem.lumStep + insertNextItem.lumStep) / 2;
      const lumValue = distribute(
        lumStep,
        [0, 1],
        [specs.lum_end * 0.01, specs.lum_start * 0.01]
      );

      if (insertAtIndex != undefined) {
        const insertItem = {
          hue: hueValue,
          hueStep: hueStep,
          sat: satValue,
          satStep: satStep,
          lum: lumValue,
          lumStep: lumStep,
          major: false,
          step: (insertPreviousItem.step + insertNextItem.step) / 2,
        };
        arrayOfValues.splice(insertAtIndex, 0, insertItem);
      }
    }
  });

  var colorMap = processColorsFromArrays(specs, arrayOfValues);

  if (specs.lock_hex) {
    colorMap = generateColorsWithLock(specs, colorMap, specs.lock_hex);
  }

  return colorMap;
};
