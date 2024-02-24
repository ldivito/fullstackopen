export type Diagnosis = {
  code: string;
  name: string;
  latin?: string;
};

export type Patient = {
  id: string;
  name: string;
  ssn: string;
  dateOfBirth: string;
  gender: string;
  occupation: string;
}

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export type NewPatient = Omit<Patient, 'id'>;

export type NonSensitivePatient = Omit<Patient, 'ssn'>;