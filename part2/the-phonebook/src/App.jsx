import { useState, useEffect } from 'react'
import personService from './services/persons'

const Person = ({ person, onDelete }) => {
  return (
    <p>
      {person.name} {person.number}
      <button onClick={() => onDelete(person)}>Delete</button>
    </p>
  )
}

const Persons = ({ persons, searchTerm, onDeletePerson }) => {
  // Find filtered persons
  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  return (
    <div>
      {filteredPersons.map(person => (
        <Person
          key={person.id}
          person={person}
          onDelete={onDeletePerson}
        />
      ))}
    </div>
  )
}

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      <p>Filter shown with:</p>
      <input
        id='filter'
        name='filter'
        autoComplete='off'
        value={filter}
        onChange={handleFilterChange}
      />
    </div>
  )
}

const PersonForm = ({ addPerson, newName, handleNameChange, newNumber, handleNumberChange }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        Name: <input
                id="name"
                name="name"
                autoComplete="name"
                value={newName}
                onChange={handleNameChange}
              />
      </div>
      <div>
        Number: <input
                  id="number"
                  name="number"
                  autoComplete="tel"
                  value={newNumber}
                  onChange={handleNumberChange}
                />
      </div>
      <button type='submit'>Add</button>
    </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

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
