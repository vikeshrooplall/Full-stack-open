const Person = ({ person, onDelete }) => {
  return (
    <p>
      {person.name} {person.number}
      <button onClick={() => onDelete(person)}>Delete</button>
    </p>
  )
}

export default Person
