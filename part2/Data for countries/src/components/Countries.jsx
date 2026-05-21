import Country from './Country'
import CountryDetails from './CountryDetails'

const Countries = ({ countries, searchTerm, showCountry}) => {

  const filteredCountries= countries.filter(country =>
  country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (searchTerm.trim() === '') {
    return null
  }

  if (filteredCountries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (filteredCountries.length === 1) {
    return <CountryDetails country={filteredCountries[0]} />
  }

  return (
    <div>
      {filteredCountries.map(country => (
        <Country
          key={country.cca3}
          country={country}
          showCountry={showCountry}
        />
      ))}
    </div>
  )
}

export default Countries
