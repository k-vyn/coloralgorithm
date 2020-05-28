'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var chroma = require("chroma-js");
function processColors(props, colorSteps) {
    var steps = props.steps, minorSteps = props.minorSteps, hue = props.hue, saturation = props.saturation, brightness = props.brightness, lockHex = props.lockHex;
    var map = [];
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
        var contrastWhite = chroma.contrast(hex, "white").toFixed(2);
        var contrastBlack = chroma.contrast(hex, "black").toFixed(2);
        var displayColor = "";
        if (contrastWhite >= 4.5) {
            displayColor = "white";
        }
        else {
            displayColor = "black";
        }
        if (contrastWhite >= 4.5) {
            displayColor = "white";
        }
        else {
            displayColor = "black";
        }
        var isLock = false;
        if (lockHex) {
            if (lockHex.toUpperCase() == chroma(hex).hex().toUpperCase()) {
                isLock = true;
            }
            if ("#" + lockHex.toUpperCase() == chroma(hex).hex().toUpperCase()) {
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

function distribute(_a) {
    var value = _a.value, rangeA = _a.rangeA, rangeB = _a.rangeB;
    var _b = Array.from(rangeA), fromLow = _b[0], fromHigh = _b[1];
    var _c = Array.from(rangeB), toLow = _c[0], toHigh = _c[1];
    var result = toLow + ((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow);
    if (toLow < toHigh) {
        if (result < toLow) {
            return toLow;
        }
        if (result > toHigh) {
            return toHigh;
        }
    }
    else {
        if (result > toLow) {
            return toLow;
        }
        if (result < toHigh) {
            return toHigh;
        }
    }
    return result;
}

function generateNumberOfSteps(_a) {
    var curve = _a.curve, steps = _a.steps;
    var arrayOfSteps = Array.from(Array(steps).keys());
    var array = [];
    for (var step in arrayOfSteps) {
        var stepNumber = parseInt(step);
        var value = curve(stepNumber / (steps - 1));
        array.push(value);
    }
    array.reverse();
    return array;
}

var defaultCurves = {
    linear: {
        name: "linear",
        formatted_name: "Linear",
        value: [0.5, 0.5, 0.5, 0.5],
    },
    easeInCubic: {
        name: "easeInCubic",
        formatted_name: "Cubic - EaseIn",
        value: [0.55, 0.055, 0.675, 0.19],
    },
    easeOutCubic: {
        name: "easeOutCubic",
        formatted_name: "Cubic - EaseOut",
        value: [0.215, 0.61, 0.355, 1],
    },
    easeInOutCubic: {
        name: "easeInOutCubic",
        formatted_name: "Cubic - EaseInOut",
        value: [0.645, 0.045, 0.355, 1],
    },
    easeInSine: {
        name: "easeInSine",
        formatted_name: "Sine - EaseIn",
        value: [0.47, 0, 0.745, 0.715],
    },
    easeOutSine: {
        name: "easeOutSine",
        formatted_name: "Sine - EaseOut",
        value: [0.39, 0.575, 0.565, 1],
    },
    easeInOutSine: {
        name: "easeInOutSine",
        formatted_name: "Sine - EaseInOut",
        value: [0.445, 0.05, 0.55, 0.95],
    },
    easeInQuad: {
        name: "easeInQuad",
        formatted_name: "Quad - EaseIn",
        value: [0.55, 0.085, 0.68, 0.53],
    },
    easeOutQuad: {
        name: "easeOutQuad",
        formatted_name: "Quad - EaseOut",
        value: [0.25, 0.46, 0.45, 0.94],
    },
    easeInOutQuad: {
        name: "easeInOutQuad",
        formatted_name: "Quad - EaseInOut",
        value: [0.455, 0.03, 0.515, 0.955],
    },
    easeInQuart: {
        name: "easeInQuart",
        formatted_name: "Quart - EaseIn",
        value: [0.895, 0.03, 0.685, 0.22],
    },
    easeOutQuart: {
        name: "easeOutQuart",
        formatted_name: "Quart - EaseOut",
        value: [0.165, 0.84, 0.44, 1],
    },
    easeInOutQuart: {
        name: "easeInOutQuart",
        formatted_name: "Quart - EaseInOut",
        value: [0.77, 0, 0.175, 1],
    },
    easeInQuint: {
        name: "easeInQuint",
        formatted_name: "Quint - EaseIn",
        value: [0.755, 0.05, 0.855, 0.06],
    },
    easeOutQuint: {
        name: "easeOutQuint",
        formatted_name: "Quint - EaseOut",
        value: [0.23, 1, 0.32, 1],
    },
    easeInOutQuint: {
        name: "easeInOutQuint",
        formatted_name: "Quint - EaseInOut",
        value: [0.86, 0, 0.07, 1],
    },
    easeInCirc: {
        name: "easeInCirc",
        formatted_name: "Circ - EaseIn",
        value: [0.6, 0.04, 0.98, 0.335],
    },
    easeOutCirc: {
        name: "easeOutCirc",
        formatted_name: "Circ - EaseOut",
        value: [0.075, 0.82, 0.165, 1],
    },
    easeInOutCirc: {
        name: "easeInOutCirc",
        formatted_name: "Circ - EaseInOut",
        value: [0.785, 0.135, 0.15, 0.86],
    },
    easeInExpo: {
        name: "easeInExpo",
        formatted_name: "Expo - EaseIn",
        value: [0.95, 0.05, 0.795, 0.035],
    },
    easeOutExpo: {
        name: "easeOutExpo",
        formatted_name: "Expo - EaseOut",
        value: [0.19, 1, 0.22, 1],
    },
    easeInOutExpo: {
        name: "easeInOutExpo",
        formatted_name: "Expo - EaseInOut",
        value: [1, 0, 0, 1],
    },
    easeInBack: {
        name: "easeInBack",
        formatted_name: "Back - EaseIn",
        value: [0.6, -0.28, 0.735, 0.045],
    },
    easeOutBack: {
        name: "easeOutBack",
        formatted_name: "Back - EaseOut",
        value: [0.175, 0.885, 0.32, 1.275],
    },
    easeInOutBack: {
        name: "easeInOutBack",
        formatted_name: "Back - EaseInOut",
        value: [0.68, -0.55, 0.265, 1.55],
    },
};

function getCoordinates(curve) {
    if (typeof curve === "string") {
        var coordinates = defaultCurves[curve];
        if (coordinates) {
            return coordinates.value;
        }
        else {
            throw Error("provided incorrect curve");
        }
    }
    if (typeof curve === "object") {
        if (curve.length === 4) {
            if (!curve.some(isNaN)) {
                return curve;
            }
            else {
                throw Error("incompatible curve");
            }
        }
        else {
            throw Error("curve is neither a string or a compatible array");
        }
    }
    throw Error("curve was neither a string or an object");
}

var bezier = require("bezier-easing");
function main (props) {
    var steps = props.steps, minorSteps = props.minorSteps, hue = props.hue, saturation = props.saturation, brightness = props.brightness, lockHex = props.lockHex;
    console.log(props);
    var brightnessArray = generateNumberOfSteps({
        curve: bezier.apply(void 0, getCoordinates(brightness.curve)),
        steps: steps,
    });
    var saturationArray = generateNumberOfSteps({
        curve: bezier.apply(void 0, getCoordinates(saturation.curve)),
        steps: steps,
    });
    var hueArray = generateNumberOfSteps({
        curve: bezier.apply(void 0, getCoordinates(hue.curve)),
        steps: steps,
    });
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
    var colorSteps = hueArray.map(function (hue, i) {
        var step = {
            hue: hueArray[i],
            saturation: saturationArray[i],
            brightness: brightnessArray[i],
            index: i,
            isMajor: true,
        };
        return step;
    });
    minorSteps.map(function (o, i) {
        var defaultStep = {
            hue: 0,
            saturation: 0,
            brightness: 0,
            isMajor: true,
            index: 0,
        };
        var insertPreviousStep = defaultStep;
        var insertNextStep = defaultStep;
        var insertAtIndex = 0;
        colorSteps.map(function (p, j) {
            if (o == p.index) {
                insertAtIndex = j + 1;
                insertPreviousStep = p;
                insertNextStep = colorSteps[j + 1];
            }
        });
        var hueStep = (insertPreviousStep.hue + insertNextStep.hue) / 2;
        var hueValue = distribute({
            value: hueStep,
            rangeA: [0, 1],
            rangeB: [hue.start, hue.end],
        });
        var satStep = (insertPreviousStep.saturation + insertNextStep.saturation) / 2;
        var satValue = distribute({
            value: satStep,
            rangeA: [0, 1],
            rangeB: [saturation.start * 0.01, saturation.end * 0.01],
        }) *
            (saturation.rate * 0.01);
        var brightnessStep = (insertPreviousStep.brightness + insertNextStep.brightness) / 2;
        var brightnessValue = distribute({
            value: brightnessStep,
            rangeA: [0, 1],
            rangeB: [brightness.end * 0.01, brightness.start * 0.01],
        });
        if (insertAtIndex != undefined) {
            var insertItem = {
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

exports.default = main;
//# sourceMappingURL=index.js.map
