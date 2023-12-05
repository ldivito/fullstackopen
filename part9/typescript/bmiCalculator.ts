export const bmiCalculator = (args: { height: number, weight: number }): string => {
    const bmi = args.weight / Math.pow(args.height / 100, 2);
    if (bmi < 18.5) {
        return 'Underweight';
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        return 'Normal (healthy weight)';
    } else if (bmi >= 25 && bmi <= 29.9) {
        return 'Overweight';
    } else {
        return 'Obese';
    }
};

const height = Number(process.argv[2]);
const weight = Number(process.argv[3]);

console.log(bmiCalculator({ height, weight }));
