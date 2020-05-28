declare type Props = {
    curve: (number: any) => number;
    steps: number;
};
export default function generateNumberOfSteps({ curve, steps }: Props): any[];
export {};
