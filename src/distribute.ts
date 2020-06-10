// Originally from https://github.com/koenbok/Framer/blob/master/framer/Utils.coffee
// Translated to Typescript

interface Props {
  value: number;
  rangeA: number[];
  rangeB: number[];
  limit?: boolean;
}

type Result = number;

export default function distribute({
  value,
  rangeA,
  rangeB,
  limit,
}: Props): Result {
  if (limit === undefined) {
    limit = false;
  }
  const [fromLow, fromHigh] = Array.from(rangeA);
  const [toLow, toHigh] = Array.from(rangeB);

  const result =
    toLow + ((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow);

  if (limit === true) {
    if (toLow < toHigh) {
      if (result < toLow) {
        return toLow;
      }
      if (result > toHigh) {
        return toHigh;
      }
    } else {
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
