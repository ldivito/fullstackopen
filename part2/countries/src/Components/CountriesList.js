import React from "react";
import Country from "./Country";
import CountryInfo from "./CountryInfo";

const CountriesList = ({countries}) => {

  if (countries.length < 10) {
    if(countries.length === 1) {
     return (
       <div>
        <CountryInfo country={countries[0]} />
       </div>
     )
    }
    return (
      <ul>
        {countries.map(country => <Country country={country} /> )}
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