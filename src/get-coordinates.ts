import defaultCurves from "./default-curves";

export default function getCoordinates(curve) {
  if (typeof curve === "string") {
    const coordinates = defaultCurves[curve];
    if (coordinates) {
      return coordinates.value;
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
