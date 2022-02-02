import React, {useEffect, useState} from 'react'
import Filter from "./components/filter";
import Form from "./components/form";
import PersonList from "./components/personList";
import personService from './Services/persons';
import axios from "axios";

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newNameFilter, setNewNameFilter ] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (checkDuplicate(persons, newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }
    const personObject = {
      name: newName,
      number: newNumber,
      id: persons[persons.length - 1].id + 1
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        }
      )
  }

  const handleNewPerson = (event) => {
    setNewName(event.target.value)
  }

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleNameFilter = (event) => {
    setNewNameFilter(event.target.value)
  }

  const checkDuplicate = (arr, val) => {
    return arr.some(function(arrVal) {
      return val === arrVal.name;
    });
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={newNameFilter} eventHandler={handleNameFilter} />
      <h3>Add new contact</h3>
      <Form addPerson={addPerson} nameValue={newName} personEventHandler={handleNewPerson} numberValue={newNumber} numberEventHandler={handleNewNumber}/>
      <h3>Numbers</h3>
      <ul>
       <PersonList persons={persons.filter(value => value.name.toLowerCase().match(newNameFilter.toLowerCase()))}/>
      </ul>
    </div>
  )
}

export default App