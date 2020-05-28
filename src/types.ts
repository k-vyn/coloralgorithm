export type CurveType = string;

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

export interface ColorProps {
  steps: number;
  minorSteps: number[];
  hue: HueType;
  saturation: SaturationType;
  brightness: BrightnessType;
  lockHex?: string;
  provideInverted?: boolean;
}

export interface ColorStep {
  hue: number;
  saturation: number;
  brightness: number;
  isMajor: boolean;
  index: number;
}

export interface ColorResult {}
