import bezier from "bezier-easing";

type Props = {
  curve: [number, number, number, number]; // Ensure this is a tuple of four numbers
  steps: number;
};
export default function generateNumberOfSteps({
  curve,
  steps,
}: Props): number[] {
  const arrayOfSteps = Array.from(Array(steps).keys());
  var array = [];
  for (const step in arrayOfSteps) {
    const stepNumber = parseInt(step, 10);
    const easing = bezier(...curve);
    const value = easing(stepNumber / (steps - 1));
    array.push(value);
  }
  return array;
}
