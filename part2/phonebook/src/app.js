import React, {useEffect, useState} from 'react'
import Filter from "./components/filter";
import Form from "./components/form";
import PersonList from "./components/personList";
import personService from './Services/persons';


const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newNameFilter, setNewNameFilter ] = useState('')
  const [ addedMessage, setAddedMessage ] = useState(null)
  const [ addedMessageType, setAddedMessageType ] = useState('')

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
      const originalPerson = persons.find(original => original.name == newName)
      if (window.confirm(`${originalPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
        const personObject = {
          ...originalPerson,
          number: newNumber
        }

        personService
          .update(personObject.id,personObject)
          .then(
            response => {
              setAddedMessage(`Replaced ${originalPerson.name} number successfully.`)
              setAddedMessageType('message-info')
              setTimeout(() => {
                setAddedMessage(null)
              }, 5000)
              persons.map(person => person.id !== personObject.id ? person : response.data)
            }
          )
          .catch(error => {
            setAddedMessage(`Contact ${originalPerson.name} not found, please create it again.`)
            setAddedMessageType('message-error')
            setTimeout(() => {
              setAddedMessage(null)
            }, 5000)
            setPersons(persons.filter(p => p.id !== originalPerson.id))
          })
      }
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
          setAddedMessage(`Added ${returnedPerson.name}.`)
          setAddedMessageType('message-info')
          setTimeout(() => {
            setAddedMessage(null)
          }, 5000)
        }
      )
  }

  const handleDeletePerson = (event) => {
    event.preventDefault()
    if (window.confirm(`Delete ${persons.find(person => person.id == event.target.value).name}?`)) {
      personService
        .deletePerson(event.target.value)
        .then(
          setPersons(persons.filter(p => p.id != event.target.value))
        )
    }
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

  const AddNotification = ({ message, type }) => {
    const success = {
    }

    if (message === null) {
      return null
    }

    return (
      <div className={type}>
        {message}
      </div>
    )
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <AddNotification message={addedMessage} type={addedMessageType} />
      <Filter value={newNameFilter} eventHandler={handleNameFilter} />
      <h3>Add new contact</h3>
      <Form addPerson={addPerson} nameValue={newName} personEventHandler={handleNewPerson} numberValue={newNumber} numberEventHandler={handleNewNumber}/>
      <h3>Numbers</h3>
      <ul>
        <PersonList eventHandler={handleDeletePerson} persons={persons.filter(value => value.name.toLowerCase().match(newNameFilter.toLowerCase()))}/>
      </ul>
    </div>
  )
}

export default App