import React from "react";

const Country = ({country,handleCountriesFilter}) => {
  return (
    <li style={{listStyleType: "none"}} key={country.id}>
      {country.name} <button value={country.name} onClick={handleCountriesFilter} >show</button>
    </li>
  )
}

export default Country