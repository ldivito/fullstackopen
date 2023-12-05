import express from "express";
import { bmiCalculator } from "./bmiCalculator";
import { exerciseCalculator } from "./exerciseCalculator";

const app = express();

app.get('/', (_req, res) => {
    res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
    const height = Number(req.query.height);
    const weight = Number(req.query.weight);

    if (!height || !weight) {
        res.status(400).send({ error: 'malformatted parameters' });
    }

    const bmi = bmiCalculator({ height, weight });

    res.send({
        weight,
        height,
        bmi
    });

});

app.post('/exercises', (req, res) => {
    const body = req.body;
    const target = body.target;
    const hours = body.daily_exercises;

    if (!target || !hours) {
        res.status(400).send({ error: 'parameters missing' });
    }

    if (!Array.isArray(hours) || !hours.every(h => typeof h === 'number')) {
        res.status(400).send({ error: 'malformatted parameters' });
    }

    const result = exerciseCalculator(target, hours);

    res.send(result);
});

const port = 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
