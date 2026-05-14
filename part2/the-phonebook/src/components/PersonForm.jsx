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

export default PersonForm
