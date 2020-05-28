export declare type CurveType = string;
export declare type HueType = {
    start: number;
    end: number;
    curve: CurveType;
};
export declare type SaturationType = {
    start: number;
    end: number;
    curve: CurveType;
    rate: number;
};
export declare type BrightnessType = {
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
export interface ColorResult {
}
