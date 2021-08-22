import React from "react";

const Country = ({country,handleClick}) => {
  return (
    <li style={{listStyleType: "none"}} key={country.id}>
      {country.name} <button onClick={handleClick(country)}>show</button>
    </li>
  )
}

export default Country