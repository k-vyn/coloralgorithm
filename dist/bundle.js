// Originally from https://github.com/koenbok/Framer/blob/master/framer/Utils.coffee
// Translated to Typescript
function distribute({ value, rangeA, rangeB, limit, }) {
    if (limit === undefined) {
        limit = false;
    }
    const [fromLow, fromHigh] = Array.from(rangeA);
    const [toLow, toHigh] = Array.from(rangeB);
    const result = toLow + ((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow);
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

const bezier = require("bezier-easing");
function generateNumberOfSteps({ curve, steps, }) {
    const arrayOfSteps = Array.from(Array(steps).keys());
    var array = [];
    for (const step in arrayOfSteps) {
        const stepNumber = parseInt(step, 10);
        const easing = bezier(...curve);
        const value = easing(stepNumber / (steps - 1));
        array.push(value);
    }
    return array;
}

const defaultCurves = {
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
        const coordinates = defaultCurves[curve];
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
    const { steps, hue, saturation, brightness } = props;
    const { minorSteps } = options;
    // default rotation is clockwise
    const rotation = options.rotation === "counterclockwise" || options.rotation === "ccw"
        ? "ccw"
        : "cw";
    // generate steps 0 to 1 based on curve
    const hueSteps = generateNumberOfSteps({
        curve: getCoordinates(hue.curve, invert),
        steps,
    });
    const saturationSteps = generateNumberOfSteps({
        curve: getCoordinates(saturation.curve, invert),
        steps,
    });
    const brightnessSteps = generateNumberOfSteps({
        curve: getCoordinates(brightness.curve, invert),
        steps,
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
    const colorSteps = hueValues.map(function (hue, i) {
        const step = {
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
            const defaultStep = {
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
            const hueStep = (insertPreviousStep.hue.step + insertNextStep.hue.step) / 2;
            const hueValue = distribute({
                value: hueStep,
                rangeA: [0, 1],
                rangeB: [
                    invert === true ? hue.end : hue.start,
                    invert === true ? hue.start : hue.end,
                ],
            });
            const saturationStep = (insertPreviousStep.saturation.step + insertNextStep.saturation.step) /
                2;
            let saturationValue = distribute({
                value: saturationStep,
                rangeA: [0, 1],
                rangeB: [
                    invert === true ? saturation.end : saturation.start,
                    invert === true ? saturation.start : saturation.end,
                ],
            }) * saturation.rate;
            saturationValue = saturationValue < 1 ? saturationValue : 1;
            const brightnessStep = (insertPreviousStep.brightness.step + insertNextStep.brightness.step) /
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
                const insertItem = {
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

const chroma$1 = require("chroma-js");
function convertToColors(props, options, algorithmResult) {
    const results = algorithmResult.map(function (set, i) {
        const colors = set.map(function ({ hue, saturation, brightness, isMajor, isLocked, step, }) {
            const color = chroma$1.hsv(hue.value, saturation.value, brightness.value);
            function replaceNaN(array) {
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

const chroma = require("chroma-js");
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
    const lockHSV = isNaN(chroma.hex(`${options.lockHex}`).hsv()[0])
        ? convertToNamedObject(replaceNaN(chroma.hex(`${options.lockHex}`).hsv()))
        : convertToNamedObject(chroma.hex(`${options.lockHex}`).hsv());
    let shortestDistance = 999999;
    let lockedColor = {
        hue: { step: 0, value: 0 },
        saturation: { step: 0, value: 0 },
        brightness: { step: 0, value: 0 },
        step: 0,
        isMajor: false,
        isLocked: false
    };
    let lockedIndex;
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
        var _a, _b, _c;
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
            const hueDifference = distribute({
                value: index,
                rangeA: [lockedIndex, lastColor.step + (((_a = options === null || options === void 0 ? void 0 : options.minorSteps) === null || _a === void 0 ? void 0 : _a.length) || 0)],
                rangeB: [difference.hue, 0],
            });
            const saturationDifference = distribute({
                value: index,
                rangeA: [lockedIndex, lastColor.step + (((_b = options === null || options === void 0 ? void 0 : options.minorSteps) === null || _b === void 0 ? void 0 : _b.length) || 0)],
                rangeB: [difference.saturation, 0],
            });
            const brightnessDifference = distribute({
                value: index,
                rangeA: [lockedIndex, lastColor.step + (((_c = options === null || options === void 0 ? void 0 : options.minorSteps) === null || _c === void 0 ? void 0 : _c.length) || 0)],
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
    const { lockHex, lockHexInverted, provideInverted } = options;
    const algorithmResult = [];
    const generated = generateColors(props, options);
    if (lockHex) {
        algorithmResult.push(generateColorsWithLock(props, options, generated));
    }
    else {
        algorithmResult.push(generated);
    }
    if (provideInverted) {
        const generatedInverted = generateColors(props, options, true);
        lockHexInverted === undefined
            ? algorithmResult.push(generatedInverted)
            : algorithmResult.push(generateColorsWithLock(props, options, generatedInverted));
    }
    return convertToColors(props, options, algorithmResult);
}

export { generate };
