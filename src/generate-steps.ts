type Props = {
  curve: (number) => number;
  steps: number;
};

export default function generateNumberOfSteps({ curve, steps }: Props) {
  const arrayOfSteps = Array.from(Array(steps).keys());
  var array = [];

  for (const step in arrayOfSteps) {
    const stepNumber = parseInt(step);
    const value = curve(stepNumber / (steps - 1));
    array.push(value);
  }
  array.reverse();

  return array;
}
