import patientData from '../../data/patients';
import { NewPatient, Patient, NonSensitivePatient } from '../types';
import { v1 as uuid } from 'uuid';

const getEntries = (): Patient[] => {
	return patientData;
}

const getNonSensitiveEntries = (): NonSensitivePatient[] => {
	return patientData.map(({id, name, dateOfBirth, gender, occupation}) => ({
		id,
		name,
		dateOfBirth,
		gender,
		occupation
	}));
}

const addPatient = ( entry : NewPatient ) : Patient => {

	const id = uuid();

	const newPatient = {
		id: id,
		...entry
	};

	patientData.push(newPatient);
	return newPatient;
}


export default {
	getEntries,
	getNonSensitiveEntries,
	addPatient
}