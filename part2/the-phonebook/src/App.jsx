import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [notification , setNotification] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  // handle delete
  const handleDeletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .destroy(person.id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== person.id))
          setNotification(`${person.name} has been deleted from Phonebook`)
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
    }
  }

  // handle search filter
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const addPerson = (event) => {
    // prevent default page reload
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }

    // check for duplicate name
    const isDuplicate = persons.find(person =>
      person.name.toLowerCase() === personObject.name.toLowerCase()
    )

    // display error message if duplicate
    if (isDuplicate) {
      if (window.confirm(`${isDuplicate.name} is already added to the phonebook, Replace the old number with new one?`)) {
        const updatedPerson = { ...isDuplicate, number: newNumber}

        // Update person's number
        personService
          .update(isDuplicate.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person =>
              person.id !== isDuplicate.id ? person : returnedPerson
            ))
            setNotification(`${isDuplicate.name}'s phone number has been successfully updated`)
            setTimeout(() => {
              setNotification(null)
            }, 5000)
          })

      }
      // clear input elements
      setNewName('')
      setNewNumber('')
      // exit function without adding name
      return
    }

    // add new person if not duplicate and save to json server
    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNotification(
          `${returnedPerson.name} has been successfully added to the phonebook`,
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        )
        // clear input element
        setNewName('')
        setNewNumber('')
      })
  }

  // event handler to update name as user types
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  // update number as user types
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />
      <Filter filter={searchTerm} handleFilterChange={handleSearchChange} />
      <h3>Add a new person</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons
        persons={persons}
        searchTerm={searchTerm}
        onDeletePerson={handleDeletePerson}
      />
    </div>
  )
}

export default App
