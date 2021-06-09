import React from "react";

const Search = ({value,eventHandler}) => {
  return (
    <div>
      <span>Find countries:</span>
      <input value={value} onChange={eventHandler} />
    </div>
  )
}

export default Search