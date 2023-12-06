import patientData from '../../data/patients';
import { Patient, NonSensitivePatient } from '../types';

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

export default {
	getEntries,
	getNonSensitiveEntries
}