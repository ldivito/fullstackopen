import express from 'express';
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

import diagnosesRouter from './src/routes/diagnosesRoute';
import patientsRouter from './src/routes/patientRoute';

const PORT = 3001;

const baseUrl = '/api';

app.get(baseUrl + '/ping', (_req, res) => {
	console.log('someone pinged here');
	res.send('pong');
});

app.use(baseUrl + '/diagnoses', diagnosesRouter);
app.use(baseUrl + '/patients', patientsRouter);


app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});