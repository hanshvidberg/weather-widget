const https = require('https')

const WEATHER_API = 'https://api.openweathermap.org/data/2.5/weather?q='

// const APIKEY = '166d00e26d3ff2c6149e89feccc5c59a'
const APIKEY = '9c1e7d5128841f5d64657a93cb33a8bb'

function constructURL(city) {
  const url = `${WEATHER_API}${city}&units=metric&appid=${APIKEY}`
  return url
}

export async function getWeather(city) {
  const url = constructURL(city)
  return new Promise((resolve, reject) => {
    try {
      https.get(url, response => {
        response.setEncoding('utf8')
        let body = ''
        response.on('data', data => {
          body += data
        })
        response.on('end', () => {
          body = JSON.parse(body)
          if (body.cod === 404) {
            reject(body)
          }
          resolve(body)
        })
      })
    } catch (err) {
      console.error('error', err)
      reject(err)
    }
  })
}
