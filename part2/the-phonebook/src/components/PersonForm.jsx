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
                placeholder="Enter name (min 3 characters)"
              />
      </div>
      <div>
        Number: <input
                  id="number"
                  name="number"
                  autoComplete="tel"
                  value={newNumber}
                  onChange={handleNumberChange}
                  placeholder="e.g 09-1234556 or 040-22334455"
                />
      </div>
      <button type='submit'>Add</button>
    </form>
  )
}

export default PersonForm
