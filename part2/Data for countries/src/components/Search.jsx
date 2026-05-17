const Search = ({ filter, handleFilterChange }) => {
  return (
    <div>
      Find Countries:
      <input
        id={filter}
        value={filter}
        onChange={handleFilterChange}
      />
    </div>
  )
}

export default Search
