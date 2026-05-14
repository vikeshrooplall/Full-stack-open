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
  const [notification , setNotification] = useState({ message: null, type: 'success'})

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const showNotification = (message, type= 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: 'success'})
    }, 5000)
  }

  // handle delete
  const handleDeletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .destroy(person.id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== person.id))
          showNotification(`${person.name} has been deleted from phonebook`, 'success')
        })
        .catch(() => {
          showNotification(`${person.name} has already been removed`, 'error')
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
            showNotification(`${isDuplicate.name}'s phone number has been successfully updated`, 'success')
          })
          .catch(() => {
            showNotification(`${isDuplicate.name} has already been removed from phonebook`, 'error')
            setPersons(persons.filter(p => p.id !== isDuplicate.id))
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
        showNotification(`${returnedPerson.name} has been successfully added to the phonebook`, 'success')
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
      <Notification message={notification.message} type={notification.type} />
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
