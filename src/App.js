import React from 'react'
import './App.css'
import WeatherWidget from './components/WeatherWidget'

function App(props) {
  return (
    <div className="App">
      <header className="App-header">
        <WeatherWidget weather={props.data} />
      </header>
      <script
        id="initial"
        dangerouslySetInnerHTML={{
          __html: `window.INITIAL=${JSON.stringify(props)}`,
        }}
      />
    </div>
  )
}

export default App
