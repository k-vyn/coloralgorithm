'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// Originally from https://github.com/koenbok/Framer/blob/master/framer/Utils.coffee
// Translated to Typescript
function distribute(_a) {
    var value = _a.value, rangeA = _a.rangeA, rangeB = _a.rangeB, limit = _a.limit;
    if (limit === undefined) {
        limit = false;
    }
    var _b = Array.from(rangeA), fromLow = _b[0], fromHigh = _b[1];
    var _c = Array.from(rangeB), toLow = _c[0], toHigh = _c[1];
    var result = toLow + ((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow);
    if (limit === true) {
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
    }
    return result;
}

var bezier = require("bezier-easing");
function generateNumberOfSteps(_a) {
    var curve = _a.curve, steps = _a.steps;
    var arrayOfSteps = Array.from(Array(steps).keys());
    var array = [];
    for (var step in arrayOfSteps) {
        var stepNumber = parseInt(step, 10);
        var easing = bezier.apply(void 0, curve);
        var value = easing(stepNumber / (steps - 1));
        array.push(value);
    }
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

function getCoordinates(curve, invert) {
    if (typeof curve === "string") {
        var coordinates = defaultCurves[curve];
        if (coordinates) {
            return invert === true
                ? coordinates.value.slice().reverse()
                : coordinates.value;
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

function generateColors(props, options, invert) {
    var steps = props.steps, hue = props.hue, saturation = props.saturation, brightness = props.brightness;
    var minorSteps = options.minorSteps;
    // default rotation is clockwise
    var rotation = options.rotation === "counterclockwise" || options.rotation === "ccw"
        ? "ccw"
        : "cw";
    // generate steps 0 to 1 based on curve
    var hueSteps = generateNumberOfSteps({
        curve: getCoordinates(hue.curve, invert),
        steps: steps,
    });
    var saturationSteps = generateNumberOfSteps({
        curve: getCoordinates(saturation.curve, invert),
        steps: steps,
    });
    var brightnessSteps = generateNumberOfSteps({
        curve: getCoordinates(brightness.curve, invert),
        steps: steps,
    });
    // adjust hue start/end to get the intended rotation
    if (rotation === "cw") {
        if (hue.start > hue.end) {
            hue.start -= 360;
        }
    }
    else if (rotation === "ccw") {
        if (hue.end > hue.start) {
            hue.end -= 360;
        }
    }
    // Distribute the generated steps between hue, saturation, brightness ranges
    var hueValues = hueSteps.map(function (s) {
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
    var saturationValues = saturationSteps.map(function (s) {
        var value = distribute({
            value: s,
            rangeA: [0, 1],
            rangeB: [
                invert === true ? saturation.end : saturation.start,
                invert === true ? saturation.start : saturation.end,
            ],
            limit: true,
        });
        var valueWithRate = value * saturation.rate;
        return valueWithRate < 1 ? valueWithRate : 1; // prevent too much satuartion saturation
    });
    var brightnessValues = brightnessSteps.map(function (s) {
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
    var colorSteps = hueValues.map(function (hue, i) {
        var step = {
            hue: {
                step: hueSteps[i],
                value: hueValues[i],
            },
            saturation: {
                step: saturationSteps[i],
                value: saturationValues[i],
            },
            brightness: {
                step: brightnessSteps[i],
                value: brightnessValues[i],
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
            var defaultStep = {
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
            var insertPreviousStep = defaultStep;
            var insertNextStep = defaultStep;
            var insertAtIndex = 0;
            colorSteps.forEach(function (p, j) {
                if (o === p.step) {
                    insertAtIndex = j + 1;
                    insertPreviousStep = p;
                    insertNextStep = colorSteps[j + 1];
                }
            });
            var hueStep = (insertPreviousStep.hue.step + insertNextStep.hue.step) / 2;
            var hueValue = distribute({
                value: hueStep,
                rangeA: [0, 1],
                rangeB: [
                    invert === true ? hue.end : hue.start,
                    invert === true ? hue.start : hue.end,
                ],
            });
            var saturationStep = (insertPreviousStep.saturation.step + insertNextStep.saturation.step) /
                2;
            var saturationValue = distribute({
                value: saturationStep,
                rangeA: [0, 1],
                rangeB: [
                    invert === true ? saturation.end : saturation.start,
                    invert === true ? saturation.start : saturation.end,
                ],
            }) * saturation.rate;
            saturationValue = saturationValue < 1 ? saturationValue : 1;
            var brightnessStep = (insertPreviousStep.brightness.step + insertNextStep.brightness.step) /
                2;
            var brightnessValue = distribute({
                value: brightnessStep,
                rangeA: [0, 1],
                rangeB: [
                    invert === true ? brightness.end : brightness.start,
                    invert === true ? brightness.start : brightness.end,
                ],
            });
            if (insertAtIndex !== undefined) {
                var insertItem = {
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

var chroma = require("chroma-js");
function convertToColors(props, options, algorithmResult) {
    var results = algorithmResult.map(function (set, i) {
        var colors = set.map(function (_a) {
            var hue = _a.hue, saturation = _a.saturation, brightness = _a.brightness, isMajor = _a.isMajor, isLocked = _a.isLocked, step = _a.step;
            var color = chroma.hsv(hue.value, saturation.value, brightness.value);
            function replaceNaN(array) {
                // fixes a NaN for 0 values in ChromaJS
                array[0] = 0;
                return array;
            }
            return {
                step: step,
                hue: hue.value,
                saturation: saturation.value,
                brightness: brightness.value,
                isMajor: isMajor,
                isLocked: isLocked,
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

var chroma$1 = require("chroma-js");
function replaceNaN(array) {
    // fixes a NaN for 0 values in ChromaJS
    array[0] = 0;
    return array;
}
function convertToNamedObject(hsv) {
    return {
        hue: hsv[0],
        saturation: hsv[1],
        brightness: hsv[2],
    };
}
function generateColorsWithLock(props, options, results) {
    var lockHSV = isNaN(chroma$1.hex("" + options.lockHex).hsv()[0])
        ? convertToNamedObject(replaceNaN(chroma$1.hex("" + options.lockHex).hsv()))
        : convertToNamedObject(chroma$1.hex("" + options.lockHex).hsv());
    var shortestDistance = 999999;
    var lockedColor;
    var lockedIndex;
    var lastColor = results[results.length - 1];
    results.forEach(function (color, index) {
        var hue = color.hue, saturation = color.saturation, brightness = color.brightness;
        var hex = chroma$1.hsv(hue.value, saturation.value, brightness.value);
        var distance = chroma$1.distance(hex, options.lockHex);
        if (shortestDistance > distance) {
            shortestDistance = distance;
            lockedColor = color;
            lockedIndex = index;
        }
    });
    var difference = {
        hue: lockHSV.hue - lockedColor.hue.value,
        saturation: lockHSV.saturation - lockedColor.saturation.value,
        brightness: lockHSV.brightness - lockedColor.brightness.value,
    };
    var adjustedColorSet = results.map(function (color, index) {
        if (index < lockedIndex) {
            var hueDifference = distribute({
                value: index,
                rangeA: [0, lockedIndex],
                rangeB: [0, difference.hue],
            });
            var saturationDifference = distribute({
                value: index,
                rangeA: [0, lockedIndex],
                rangeB: [0, difference.saturation],
            });
            var brightnessDifference = distribute({
                value: index,
                rangeA: [0, lockedIndex],
                rangeB: [0, difference.brightness],
            });
            return {
                hue: {
                    step: color.hue.step,
                    value: color.hue.value + hueDifference > 0
                        ? color.hue.value + hueDifference
                        : 0,
                },
                saturation: {
                    step: color.saturation.step,
                    value: color.saturation.value + saturationDifference > 0
                        ? color.saturation.value + saturationDifference
                        : 0,
                },
                brightness: {
                    step: color.brightness.step,
                    value: color.brightness.value + brightnessDifference > 0
                        ? color.brightness.value + brightnessDifference
                        : 0,
                },
                step: color.step,
                isMajor: color.isMajor,
                isLocked: false,
            };
        }
        else if (index === lockedIndex) {
            return {
                hue: { step: color.hue.step, value: lockHSV.hue },
                saturation: { step: color.saturation.step, value: lockHSV.saturation },
                brightness: { step: color.brightness.step, value: lockHSV.brightness },
                step: color.step,
                isMajor: color.isMajor,
                isLocked: true,
            };
        }
        else {
            var hueDifference = distribute({
                value: index,
                rangeA: [lockedIndex, lastColor.step + options.minorSteps.length],
                rangeB: [difference.hue, 0],
            });
            var saturationDifference = distribute({
                value: index,
                rangeA: [lockedIndex, lastColor.step + options.minorSteps.length],
                rangeB: [difference.saturation, 0],
            });
            var brightnessDifference = distribute({
                value: index,
                rangeA: [lockedIndex, lastColor.step + options.minorSteps.length],
                rangeB: [difference.brightness, 0],
            });
            return {
                hue: {
                    step: color.hue.step,
                    value: color.hue.value + hueDifference > 0 ||
                        color.hue.value + hueDifference < 360
                        ? color.hue.value + hueDifference
                        : 0,
                },
                saturation: {
                    step: color.saturation.step,
                    value: color.saturation.value + saturationDifference < 1
                        ? color.saturation.value + saturationDifference
                        : 1,
                },
                brightness: {
                    step: color.brightness.step,
                    value: color.brightness.value + brightnessDifference < 1
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

function generate(props, options) {
    if (options === undefined) {
        options = {};
    }
    var lockHex = options.lockHex, lockHexInverted = options.lockHexInverted, provideInverted = options.provideInverted;
    var algorithmResult = [];
    var generated = generateColors(props, options);
    if (lockHex) {
        algorithmResult.push(generateColorsWithLock(props, options, generated));
    }
    else {
        algorithmResult.push(generated);
    }
    if (provideInverted) {
        var generatedInverted = generateColors(props, options, true);
        lockHexInverted === undefined
            ? algorithmResult.push(generatedInverted)
            : algorithmResult.push(generateColorsWithLock(props, options, generatedInverted));
    }
    return convertToColors(props, options, algorithmResult);
}

exports.generate = generate;
//# sourceMappingURL=index.js.map
