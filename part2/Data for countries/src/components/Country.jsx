const Country = ({ country, showCountry }) => {
  return (
    <div>
      {country.name.common}
      <button onClick={() => showCountry(country)}>Show</button>
    </div>
  )
}

export default Country
