import React from 'react'

const CountryInfo = ({country}) => {

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
    </div>
  )
}

export default  CountryInfo