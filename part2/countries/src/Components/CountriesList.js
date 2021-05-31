import React from "react";
import Country from "./Country";
import CountryInfo from "./CountryInfo";

const CountriesList = ({countries}) => {

  if (countries.length < 10) {
    if(countries.length === 1) {
     return (
       <div>
        <h1><Country country={countries[0]} /></h1>
        <CountryInfo country={countries[0]} />
       </div>
     )
    }
    return (
      <div>
        {countries.map(country => <Country country={country} /> )}
      </div>
    )
  }
  return (
    <p>
      Too many matches, specify another filter.
    </p>
  )
}

export default CountriesList