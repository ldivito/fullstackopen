import Person from "./person";
import React from "react";

const PersonList = ({persons, eventHandler}) => {

  return (
    persons.map(person => <Person key={person.id} person={person} handleDeletePerson={eventHandler}/>)
  )
}

export default PersonList