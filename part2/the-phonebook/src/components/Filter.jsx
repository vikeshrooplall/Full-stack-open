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

export default Filter
