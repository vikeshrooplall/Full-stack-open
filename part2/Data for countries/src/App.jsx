import { useState, useEffect } from 'react'
import countryService from './services/countries'
import Countries from './components/Countries'
import Search from './components/Search'

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect (() => {
    countryService
      .getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
  }, [])

  const handleFilterChange = (event) => {
    setSearchTerm(event.target.value)
  }

  return (
    <div>
      <Search
        filter={searchTerm}
        handleFilterChange={handleFilterChange} />
      <Countries
        countries={countries}
        searchTerm={searchTerm}
      />
    </div>
  )
}

export default App
