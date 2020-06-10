import defaultCurves from "./default-curves";
import { CurveType } from "./types";

export default function getCoordinates(curve: CurveType, invert?: boolean) {
  if (typeof curve === "string") {
    const coordinates = defaultCurves[curve];
    if (coordinates) {
      return invert === true
        ? coordinates.value.slice().reverse()
        : coordinates.value;
    } else {
      throw Error("provided incorrect curve");
    }
  }

  if (typeof curve === "object") {
    if (curve.length === 4) {
      if (!curve.some(isNaN)) {
        return curve;
      } else {
        throw Error("incompatible curve");
      }
    } else {
      throw Error("curve is neither a string or a compatible array");
    }
  }
  throw Error("curve was neither a string or an object");
}
