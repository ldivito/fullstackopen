import React from "react";

const Person = ({person,handleDeletePerson}) => {
  return (
    <li key={person.name}>{person.name} {person.number} <button value={person.id} onClick={handleDeletePerson}>Delete</button> </li>
  )
}

export default Person