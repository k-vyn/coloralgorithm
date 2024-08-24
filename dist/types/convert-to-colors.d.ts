import { ColorProps, AlgorithmResult, ColorOptions } from "./types";
export default function convertToColors(props: ColorProps, options: ColorOptions, algorithmResult: AlgorithmResult): {
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
//# sourceMappingURL=convert-to-colors.d.ts.map