import axios from 'axios'

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

const getWeatherFOrCountry = (city) => {
  const url =`${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`
  const request = axios.get(url)
  return request.then(response => response.data)
}

export default { getWeatherFOrCountry }
