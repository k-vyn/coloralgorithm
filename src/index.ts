import { AlgorithmResult, ColorProps, ColorOptions } from "./types";
import generateColors from "./generate-colors";
import convertToColors from "./convert-to-colors";
import generateColorsWithLock from "./generate-colors-with-lock";

export function generate(props: ColorProps, options?: ColorOptions) {
  if (options === undefined) {
    options = {};
  }
  const { lockHex, lockHexInverted, provideInverted } = options;
  const algorithmResult: AlgorithmResult = [];
  const generated = generateColors(props, options);
  if (lockHex) {
    algorithmResult.push(generateColorsWithLock(props, options, generated));
  } else {
    algorithmResult.push(generated);
  }

  if (provideInverted) {
    const generatedInverted = generateColors(props, options, true);
    lockHexInverted === undefined
      ? algorithmResult.push(generatedInverted)
      : algorithmResult.push(
          generateColorsWithLock(props, options, generatedInverted)
        );
  }
  return convertToColors(props, options, algorithmResult);
}
