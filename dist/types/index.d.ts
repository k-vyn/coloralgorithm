import { ColorProps, ColorOptions } from "./types";
export declare function generate(props: ColorProps, options?: ColorOptions): {
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
//# sourceMappingURL=index.d.ts.map