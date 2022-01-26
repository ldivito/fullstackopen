import React, {useEffect, useState} from 'react'
import axios from "axios";

const CountryInfo = ({country}) => {
  const [weather,setWeather] = useState(null);

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${country.name}&units=metric&appid=${process.env.REACT_APP_API_KEY}`)
      .then(response => {
        setWeather(response.data)
      })
  },[])

  if (weather !== null) {
    return (
      <div>
        <h1>{country.name}</h1>
        <p>Capital: {country.capital}</p>
        <p>Population: {country.population}</p>
        <h2>Languages</h2>
        <ul>
          {country.languages.map(language => <li key={language.name}>{language.name}</li>)}
        </ul>
        <br />
        <img src={country.flag} width={'150px'} alt={`${country.name} flag`}/>

        <h2>Weather in { country.name }</h2>
        <div><strong>Temperature:</strong> { weather.main.temp} Celsius</div>
        <div><strong>Wind:</strong> { weather.wind.speed } Km/h direction { weather.win }</div>

      </div>
    )
  } else {
    return (
      <div>
        <h1>{country.name}</h1>
        <p>Capital: {country.capital}</p>
        <p>Population: {country.population}</p>
        <h2>Languages</h2>
        <ul>
          {country.languages.map(language => <li key={language.name}>{language.name}</li>)}
        </ul>
        <br />

        <img src={country.flag} width={'150px'} alt={`${country.name} flag`}/>

        <h2>Loading Weather for { country.name }....</h2>
      </div>
    )
  }


}

export default  CountryInfo