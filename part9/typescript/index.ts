import express from "express";
import { bmiCalculator } from "./bmiCalculator";

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

const port = 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
