import React, { useState, useEffect } from 'react'

const whitelistKeys = ['temp', 'pressure', 'humidity']

const dictionary = {
  temp: 'Temparature',
  pressure: 'Pressure',
  humidity: 'Humidity',
}
function getData(data) {
  if (!data) return []
  return Object.keys(data.main).reduce((acc, key) => {
    if (whitelistKeys.includes(key)) {
      acc.push({
        label: [dictionary[key]],
        value: data.main[key],
      })
    }
    return acc
  }, [])
}
const WeatherWidget = props => {
  const [weather, setWeather] = useState(getData(props.weather))
  const [city, setCity] = useState(props.weather && props.weather.name)
  // const [name, setName] = useState(props.weather && props.weather.name)
  const [error, setError] = useState('')
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    let ignore = false

    async function getWeather(city) {
      setLoading(true)
      try {
        const weather = await fetch(
          `http://localhost:8080/get-weather?city=${city}`
        )
        const data = await weather.json()

        if (data.cod === '404') {
          setError(data.message)
          setLoading(false)
          return
        } else {
          if (!ignore) {
            setError('')
            setWeather(getData(data))
            setCity(data.name)
            setLoading(false)
            window.history.pushState(null, null, `?city=${city}`)
          }
        }
      } catch (error) {
        setError(error.message)
      }
    }

    getWeather(city)

    return () => {
      ignore = true
    }
  }, [city])

  const handleSubmit = e => {
    e.preventDefault()
    const form = new FormData(e.target)
    setCity(form.get('city'))
  }
  return (
    <div>
      <div className="panel panel-info">
        <h4 className="panel-heading">
          Weather in {city ? city : ''}
          {isLoading && (
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          )}
        </h4>
        <ul className="list-group">
          {error ? (
            <li className="list-group-item">{error}</li>
          ) : weather ? (
            weather.map(item => (
              <li key={item.label} className="list-group-item">
                {item.label}: {item.value}
              </li>
            ))
          ) : (
            <li className="list-group-item">...loading</li>
          )}
          <li className="list-group-item">
            <form className="form-inline" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  className="form-control"
                  type="text"
                  name="city"
                  id="city"
                />
              </div>
              <button type="submit" className="btn btn-default">
                Search
              </button>
            </form>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default WeatherWidget
