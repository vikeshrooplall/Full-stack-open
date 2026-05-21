import { useState, useEffect } from 'react'
import weatherService from '../services/weather'

const CountryDetails = ({ country }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    if (country.capital && country.capital[0]) {

      weatherService.getWeatherFOrCountry(country.capital)
        .then(weatherData => {
          setWeather(weatherData)
        })
    }
  }, [country])

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area}</p>
      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages).map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={`flag of ${country.name.common}`} />
      <h2>Weather in {country.capital?.[0]}</h2>
      {weather && (
        <div>
          <p><strong>Temperature:</strong> {Math.round(weather.main.temp)}°C</p>
          <p><strong>Feels like:</strong> {Math.round(weather.main.feels_like)}°C</p>
          <p><strong>Humidity:</strong> {weather.main.humidity}%</p>
          <p><strong>Wind:</strong> {weather.wind.speed} m/s</p>
          <p><strong>Conditions:</strong> {weather.weather[0].description}</p>
          <img
            src={`https://openweathermap.org/img/w/${weather.weather[0].icon}.png`}
            alt={weather.weather[0].description}
          />
        </div>
      )}

    </div>
  )
}

export default CountryDetails
