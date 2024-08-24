type CurveType = [number, number, number, number] | string;
type HueType = {
    start: number;
    end: number;
    curve: CurveType;
};
type SaturationType = {
    start: number;
    end: number;
    curve: CurveType;
    rate: number;
};
type BrightnessType = {
    start: number;
    end: number;
    curve: CurveType;
};
interface ColorOptions {
    lockHex?: string;
    lockHexInverted?: string;
    provideInverted?: boolean;
    minorSteps?: number[];
    rotation?: "clockwise" | "cw" | "counterclockwise" | "ccw";
    name?: string;
}
interface ColorProps {
    steps: number;
    hue: HueType;
    saturation: SaturationType;
    brightness: BrightnessType;
}

declare function generate(props: ColorProps, options?: ColorOptions): {
    inverted: boolean;
    colors: {
        step: number;
        hue: number;
        saturation: number;
        brightness: number;
        isMajor: boolean;
        isLocked: boolean;
        hex: any;
        hsl: any;
        hsv: any;
        lab: any;
        rgbString: any;
        rgbArray: any;
        rgbaString: any;
        rgbaArray: any;
    }[];
    name: string | undefined;
}[];

export { generate };
