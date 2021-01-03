import React from "react";

const Filter = ({value,eventHandler}) => {
  return (
    <div>Filter shown with:
      <input value={value} onChange={eventHandler} />
    </div>
  )
}

export default Filter