import React from 'react'

const CountryInfo = ({country}) => {

  const countryData = {
    capital: country.capital,
    population: country.population,
    languages: country.languages,
    flag: country.flag
  }

  return (
    <div>
      <p>Capital: {countryData.capital}</p>
      <p>Population: {countryData.population}</p>
      <h2>Languages</h2>
      <ul>
        {countryData.languages.map(language => <li key={language.name}>{language.name}</li>)}
      </ul>
      <br />

      <img src={countryData.flag} width={'150px'} alt={`${country.name} flag`}/>
    </div>
  )
}

export default  CountryInfo