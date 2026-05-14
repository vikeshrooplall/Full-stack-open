import Person from './Person'

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

export default Persons
