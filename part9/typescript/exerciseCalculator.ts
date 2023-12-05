type Rating = 1 | 2 | 3;

type RatingDescription = 'bad' | 'not too bad but could be better' | 'good';




interface Result {
    periodLength: number,
    trainingDays: number,
    success: boolean,
    rating: Rating,
    ratingDescription: RatingDescription,
    target: number,
    average: number
}

export const exerciseCalculator = (target: number, hours: Array<number>): Result => {
    const periodLength = hours.length;
    const trainingDays = hours.filter(h => h > 0).length;
    const average = hours.reduce((a, b) => a + b, 0) / periodLength;
    const success = average >= target;
    const rating = average >= target ? 3 : average >= target / 2 ? 2 : 1;
    const ratingDescription = rating === 3 ? 'good' : rating === 2 ? 'not too bad but could be better' : 'bad';
    const targetHours = target;

    return {
        periodLength,
        trainingDays,
        success,
        rating,
        ratingDescription,
        target: targetHours,
        average
    };
};


const target = Number(process.argv[2]);
const hours = process.argv.slice(3).map(h => Number(h));

console.log(exerciseCalculator(target, hours));
