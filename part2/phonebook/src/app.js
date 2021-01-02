import React, { useState } from 'react'

const App = () => {
  const [ persons, setPersons ] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newNameFilter, setNewNameFilter ] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    if (checkDuplicate(persons, newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }
    const personObject = {
      name: newName,
      number: newNumber
    }
    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
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
      <div>Filter shown with: <input value={newNameFilter} onChange={handleNameFilter} /></div>
      <h3>Add new contact</h3>
      <form onSubmit={addPerson}>
        <div>
          <div>name: <input value={newName} onChange={handleNewPerson} /></div>
          <div>number: <input value={newNumber} onChange={handleNewNumber} /></div>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h3>Numbers</h3>
      <ul>
        {persons.filter(value => value.name.toLowerCase().match(newNameFilter.toLowerCase())).map((person) => <li key={person.name}>{person.name} {person.number}</li>)}
      </ul>
    </div>
  )
}

export default App