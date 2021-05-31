import React from "react";

const Country = ({country}) => {
  return (
    <li style={{listStyleType: "none"}} key={country.id}>{country.name}</li>
  )
}

export default Country