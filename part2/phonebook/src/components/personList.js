import Person from "./person";
import React from "react";

const PersonList = ({persons}) => {

  return (
    persons.map(person => <Person person={person} />)
  )
}

export default PersonList