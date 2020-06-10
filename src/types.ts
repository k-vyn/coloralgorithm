export type CurveType = number[] | string;

export type HueType = {
  start: number;
  end: number;
  curve: CurveType;
};

export type SaturationType = {
  start: number;
  end: number;
  curve: CurveType;
  rate: number;
};

export type BrightnessType = {
  start: number;
  end: number;
  curve: CurveType;
};

export type ColorAxis = {
  value: number;
  step: number;
};

export type ColorStep = {
  hue: ColorAxis;
  saturation: ColorAxis;
  brightness: ColorAxis;
  isMajor: boolean;
  isLocked: boolean;
  step: number;
};

export type ColorSteps = ColorStep[];

export type AlgorithmResult = ColorSteps[];

export type Color = {
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

export interface ColorOptions {
  lockHex?: string;
  lockHexInverted?: string;
  provideInverted?: boolean;
  minorSteps?: number[];
  rotation?: "clockwise" | "cw" | "counterclockwise" | "ccw";
  name?: string;
}

export interface ColorProps {
  steps: number;
  hue: HueType;
  saturation: SaturationType;
  brightness: BrightnessType;
}

export type ColorSet = Color[];
