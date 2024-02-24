import {Gender, NewPatient} from '../src/types';

const toNewPatient = (object: unknown): NewPatient => {
	if (!object || typeof object !== 'object') {
		throw new Error('Incorrect or missing object: ' + object);
	}

	if ('name' in object && 'ssn' in object && 'dateOfBirth' in object && 'gender' in object  && 'occupation' in object) {

		const newPatient: NewPatient = {
			name: parseString(object.name),
			ssn: parseString(object.ssn),
			dateOfBirth: parseDate(object.dateOfBirth),
			gender: parseGender(object.gender),
			occupation: parseString(object.occupation),
		};

		return newPatient;
	}

	throw new Error('Incorrect or missing object: ' + object);
};

const isString = (text: unknown): text is string => {
	return typeof text === 'string' || text instanceof String;
}

const parseString = (param: unknown): string => {
	if (!param || !isString(param)) {
		throw new Error('Incorrect or missing string: ' + param);
	}
	return param;
}

const isDate = (date: string): boolean => {
	return Boolean(Date.parse(date));
}

const parseDate = (date: unknown): string => {
	if (!date || !isString(date) || !isDate(date)) {
		throw new Error('Incorrect or missing date: ' + date);
	}
	return date;
}

const isGender = (param: string): param is Gender => {
	return Object.values(Gender).map(g => g.toString()).includes(param);
}

const parseGender = (gender: unknown): Gender => {
	if (!gender || !isString(gender) || !isGender(gender)) {
		throw new Error('Incorrect or missing gender: ' + gender);
	}
	return gender;
}

export default toNewPatient;