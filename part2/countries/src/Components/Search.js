import React from "react";

const Search = ({value,eventHandler}) => {
  return (
    <div>Find countries:
      <input value={value} onChange={eventHandler} />
    </div>
  )
}

export default Search