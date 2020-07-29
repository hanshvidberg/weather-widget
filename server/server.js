import path from 'path'
import fs from 'fs'

import express from 'express'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import cors from 'cors'

import App from '../src/App'

import { getWeather } from '../src/weather-service/index'

const PORT = process.env.NODE_ENV === 'production' ? 8080 : 4000
const app = express()


const router = express.Router()

const serverRenderer = (req, res, next) => {
  fs.readFile(path.resolve('./build/index.html'), 'utf8', async (err, data) => {
    if (err) {
      console.error(err)
      return res.status(500).send('An error occurred')
    }

    const currentWeather = await getWeather(req.query.city || 'Copenhagen')

    return res.send(
      data.replace(
        '<div id="root"></div>',
        `<div id="root">${ReactDOMServer.renderToString(
          <App data={currentWeather} />
        )}</div>`
      )
    )
  })
}
router.use('^/$', serverRenderer)

router.use(
  express.static(path.resolve(__dirname, '..', 'build'), { maxAge: '30d' })
)

app.use(cors())
// tell the app to use the above rules
app.use(router)

app.get('/get-weather', async (req, res) => {
  try {
    const weather = await getWeather(req.query.city)
    res.json(weather)
  } catch (err) {
    console.log(err)
  }
})

app.listen(PORT, () => {
  console.log(`SSR running on port ${PORT}`)
})
