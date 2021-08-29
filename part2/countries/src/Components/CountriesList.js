import React from "react";
import Country from "./Country";
import CountryInfo from "./CountryInfo";

const CountriesList = ({countries, maxDisplay = 10}) => {

  const handleClick = (country) => {
    return (<CountryInfo country={country} />)
  }

  if (countries.length < maxDisplay) {
    if(countries.length === 1) {
     return (
       <CountryInfo country={countries[0]} />
     )
    }
    return (
      <ul>
        {countries.map(country => <Country country={country} handleClick={handleClick} /> )}
      </ul>
    )
  }
  return (
    <p>
      Too many matches, specify another filter.
    </p>
  )
}

export default CountriesList