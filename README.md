# color-algorithm

A JavaScript function for producing color sets. Used to build Lyft's color system (Spectrum) and power [ColorBox](https://www.colorbox.io/).

## Background

- [Re-Approaching Color by Lyft Design](https://design.lyft.com/re-approaching-color-9e604ba22c88)
- [Designing a Comprehensive Color System by Linda Dong](https://www.rethinkhq.com/videos/designing-a-comprehensive-color-system-for-lyft)

## Install

```
npm i @k-vyn/coloralgorithm
```

## Usage

CommonJS

```javascript
const color = require("@k-vyn/coloralgorithm");
color.generate(props, options?);
```

ES6

```javascript
import color from "@k-vyn/coloralgorithm";
color.generate(props, options?);
```

## Props

These **must** be pass to the function.

```typescript
interface Props {
  steps: number;
  hue: {
    start: number; // 0 - 359
    end: number; // 0 - 359
    curve: Curve; // See acceptable curves below
  };
  saturation: {
    start: number; // 0 - 1
    end: number; // 0 - 1
    curve: Curve;
    rate: number; // 1 is default
  };
  brightness: {
    start: number; // 0 - 1
    end: number; // 0 - 1
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

Additionially, a custom curve can be provided. Custom curves are numbered arrays with four 0-1 values. `[x1, y1, x2, y2]`.

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
  minorStep:[0],
}

// returns steps - 0, .5, 1...
```

```javascript
{
  minorStep:[0, .5],
}
// returns steps - 0, .5, .75, 1...
```

```javascript
{
  minorStep:[5, 6],
}
// returns steps - ...50, 55, 60, 65...
```

### Lock Hex

Alters result to provide a hex value as a return value. It works by identifying the closest color in the result by Euclidian distance, and the eases all colors around the hex proportionally.

```javascript
{
  lockHex: '#999`,
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
type Result = ColorSet[];

type ColorSet = Color[];

type Color = {
  label: number;
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
          label: 0
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

## Development

This package is built using [Rollup](https://github.com/rollup/rollup), and this package is written in TypeScript and converted to CommonJS using a [rollup typescript plugin](https://github.com/ezolenko/rollup-plugin-typescript2).

To run locally, you can either run `npm run build` for a one time build or `npm run start` to make continous builds.
