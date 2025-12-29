# color-algorithm

A JavaScript function for producing color sets. Used to build Lyft's color system (Spectrum) and power [ColorBox](https://www.colorbox.io/).

## Upgrading to v2.0.0

v2.0.0 introduces **input validation** with helpful error messages. This is a breaking change if your code was passing invalid inputs that previously failed silently.

### What Changed

- Invalid inputs now throw `ColorAlgorithmError` instead of producing undefined behavior
- New exports: `ColorAlgorithmError`, `ErrorCodes`, and TypeScript types

### Migration

If your code was already passing valid inputs, no changes needed. If you were relying on silent failures, wrap calls in try/catch:

```typescript
import { generate, ColorAlgorithmError } from "@k-vyn/coloralgorithm";

try {
  const palette = generate(props);
} catch (e) {
  if (e instanceof ColorAlgorithmError) {
    console.error(e.code, e.message);
  }
}
```

## Background

- [Re-Approaching Color by Lyft Design](https://design.lyft.com/re-approaching-color-9e604ba22c88)
- [Designing a Comprehensive Color System by Linda Dong](https://www.rethinkhq.com/videos/designing-a-comprehensive-color-system-for-lyft)

## Install

```
npm i @k-vyn/coloralgorithm
```

## Usage

### ES Modules (Recommended)

```typescript
import { generate } from "@k-vyn/coloralgorithm";

const palette = generate(props, options);
```

### With TypeScript Types

```typescript
import { generate, ColorAlgorithmError, ErrorCodes } from "@k-vyn/coloralgorithm";
import type { ColorProps, ColorOptions, ColorResults } from "@k-vyn/coloralgorithm";

const props: ColorProps = {
  steps: 11,
  hue: { start: 220, end: 240, curve: "easeOutQuad" },
  saturation: { start: 0.08, end: 1, rate: 1, curve: "easeOutQuad" },
  brightness: { start: 1, end: 0.2, curve: "easeInQuart" },
};

const palette: ColorResults = generate(props, { name: "Blue" });
```

### CommonJS

```javascript
const { generate } = require("@k-vyn/coloralgorithm");
generate(props, options);
```

## Props

These **must** be passed to the function. Invalid values will throw `ColorAlgorithmError`.

```typescript
interface Props {
  steps: number;      // >= 2 (integer)
  hue: {
    start: number;    // 0 - 360
    end: number;      // 0 - 360
    curve: Curve;     // See acceptable curves below
  };
  saturation: {
    start: number;    // 0 - 1
    end: number;      // 0 - 1
    curve: Curve;
    rate: number;     // > 0 (default: 1)
  };
  brightness: {
    start: number;    // 0 - 1
    end: number;      // 0 - 1
    curve: Curve;
  };
}
```

### Curves

Hue, Saturation, and Luminosity all allow you to specify a curve. The curve manipulates the progression of the steps.

#### Default curve

These are easing curves that come bundled in. You can see the different progressions on [easing.net](https://easings.net/).

| easeIn        | easeOut        | easeInOut        |
| ------------- | -------------- | ---------------- |
| `easeInSine`  | `easeOutSine`  | `easeInOutSine`  |
| `easeInQuad`  | `easeOutQuad`  | `easeInOutQuad`  |
| `easeInCubic` | `easeOutCubic` | `easeInOutCubic` |
| `easeInQuart` | `easeOutQuart` | `easeInOutQuart` |
| `easeInQuint` | `easeOutQuint` | `easeInOutQuint` |
| `easeInExpo`  | `easeOutExpo`  | `easeInOutExpo`  |
| `easeInCirc`  | `easeOutCirc`  | `easeInOutCirc`  |
| `easeInBack`  | `easeOutBack`  | `easeInOutBack`  |
| `linear`      | `linear`       | `linear`         |

```javascript
{
  saturation: {
    start:0,
    end:1,
    curve:"easeInSine",
  },
}
```

#### Custom curve

Additionally, a custom curve can be provided. Custom curves are numbered arrays with four 0-1 values. `[x1, y1, x2, y2]`.

```javascript
{
  saturation: {
    start:0,
    end:1,
    curve:[0.12, 0, 0.39, 0],
  },
}
```

## Options

Configurable options

```typescript
interface Options {
  minorSteps?: number[];
  lockHex?: string; // hex value
  provideInverted?: boolean;
  lockHexInverted?: string; // hex value
  rotation?: "clockwise" | "counterclockwise" | "cw" | "ccw";
  name?: string;
}
```

### Minor Steps

Provides an additional step in between two steps.

Major steps are whole numbers `0, 1, 2, 3,`. Minor steps are decimal numbers `.5, 1.5, 2.75`.

_Note: Always keep minor steps sorted least-to-greatest._

#### Examples

```javascript
{
  minorSteps:[0],
}

// returns steps - 0, .5, 1...
```

```javascript
{
  minorSteps:[0, .5],
}
// returns steps - 0, .5, .75, 1...
```

```javascript
{
  minorSteps:[5, 6],
}
// returns steps - ...50, 55, 60, 65...
```

### Lock Hex

Alters result to provide a hex value as a return value. It works by identifying the closest color in the result by Euclidian distance, and the eases all colors around the hex proportionally.

```javascript
{
  lockHex: '#999',
}
// returns colors - ...#999...
```

### Provide Inverted

Provides an additional color set that is inverted. Inversion is provided across Hue, Saturation, and Brightness. Each axis will flip start/end values. It will also reverse the curve, so an `EaseIn` will become an `EaseOut`.

#### Example

```javascript
{
  provideInverted: true,
}
/// returns [NormalColorSet, InvertedColorSet]
```

#### Examples

See Lock Hex. This will lock a hex in the inverted set.

### Rotation

This can alter the rotation of the progression of hues. Default rotation will progress hues 0 through 359 and repeat. By setting it progress `counterclockwise`, you'll reverse the progression order.

#### Examples

```javascript
{
  hue: {
    start: 10
    end: 350
  ...
},
{
  rotation: 'clockwise', // default
}
// returns hues ~ 10, 100, 250, 350
```

```javascript
{
  hue: {
    start: 10
    end: 350
  ...
},
{
  rotation: 'counterclockwise',
}
// returns hues ~ 10, 5, 0, 350
```

### Name

This is simply time saver. It returns the name in the result. Nothing else.

```javascript
{
  name: 'red',
}
/// returns result.name = red
```

## Result

The function returns the generated palette as an array of color objects:

```typescript
type ColorResults = {
  inverted: boolean;
  name: string | undefined;
  colors: Color[];
}[];

type Color = {
  step: number;
  hue: number;
  saturation: number;
  brightness: number;
  isMajor: boolean;
  isLocked: boolean;
  hex: string;
  hsl: number[];
  hsv: number[];
  lab: number[];
  rgbString: string;
  rgbArray: number[];
  rgbaString: string;
  rgbaArray: number[];
};
```

An example return looks something like this –

```typescript
const result = [
    {
      inverted: false,
      colors: [
        {
          step: 0,
          hue: 10
          saturation: 0.04
          brightness: 1
          isMajor: true
          isLocked: false
          hex: "#fff7f5"
          hsl: [10.000000000000057, 1, 0.98, 1]
          hsv: [10.000000000000085, 0.04000000000000007, 1]
          lab: [97.65498027125287, 2.5409203669395364, 1.8232127862283898]
          rgbString: "255,247,245"
          rgbArray: [255, 247, 245]
          rgbaString: "255,247,245,1"
          rgbaArray: [255, 247, 245, 1]
        } ...
      ]
    },
    {
      inverted: true,
      colors: (13) [
        {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}
      ],
    }
]
```

## Error Handling

v2.0.0+ validates all inputs and throws `ColorAlgorithmError` for invalid values.

```typescript
import { generate, ColorAlgorithmError, ErrorCodes } from "@k-vyn/coloralgorithm";

try {
  const palette = generate(props);
} catch (e) {
  if (e instanceof ColorAlgorithmError) {
    switch (e.code) {
      case ErrorCodes.INVALID_STEPS:
        console.error("Steps must be >= 2");
        break;
      case ErrorCodes.INVALID_HEX:
        console.error("Invalid hex color format");
        break;
      default:
        console.error(e.message);
    }
  }
}
```

### Error Codes

| Code | Description |
|------|-------------|
| `INVALID_STEPS` | steps must be an integer >= 2 |
| `INVALID_HUE` | hue.start/end must be 0-360 |
| `INVALID_SATURATION` | saturation.start/end must be 0-1 |
| `INVALID_BRIGHTNESS` | brightness.start/end must be 0-1 |
| `INVALID_RATE` | saturation.rate must be > 0 |
| `INVALID_CURVE` | Unknown curve name or invalid curve array |
| `INVALID_HEX` | lockHex must be valid hex (#RGB or #RRGGBB) |
| `INVALID_MINOR_STEPS` | minorSteps must be array of numbers |
| `MISSING_PROPS` | props is required |

## Development

This package is built using [Rollup](https://github.com/rollup/rollup) and TypeScript.

To run locally, you can either run `npm run build` for a one time build or `npm run start` to make continuous builds.
