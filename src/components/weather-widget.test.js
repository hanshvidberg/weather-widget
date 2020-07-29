import React from 'react'
import ReactDOM from 'react-dom'
import WeatherWidget from './WeatherWidget'


it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<WeatherWidget />, div)
})

it('renders with incorrect props', () => {
    const div = document.createElement('div')
    ReactDOM.render(<WeatherWidget weather={{name: 'Amager', foo: {baz: 'bar'}} } />, div)
    ReactDOM.render(<WeatherWidget weather={{bar: 'baz'}} />, div)
})




