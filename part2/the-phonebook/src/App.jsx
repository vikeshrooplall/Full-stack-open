import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    {
      name: 'Arto Hellas',
      number: '8046151300' }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // handle search filter
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  // Find filtered persons
  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
      alert(`${personObject.name} is already added to the phonebook`)
      // clear input elements
      setNewName('')
      setNewNumber('')
      // exit function without adding name
      return
    }

    // add new person if not duplicate
    setPersons(persons.concat(personObject))
    // clear input element
    setNewName('')
    setNewNumber('')
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
      <p>Filter shown with:</p>
      <input
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder= 'search by name'
      />
      <form onSubmit={addPerson}>
        <h2>Add a new</h2>
        <div>
          name: <input
                  value={newName}
                  onChange={handleNameChange}
                />
        </div>
        <div>
          number: <input
                    value={newNumber}
                    onChange={handleNumberChange}
                  />
        </div>
        <div>
          <button type="submit">Add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {filteredPersons.map(person => {
        return (
          <p key={person.name}>
            {person.name}: {person.number}
          </p>
        )
      })}
    </div>
  )
}

export default App
