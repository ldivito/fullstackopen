import React from "react";

const Form = ({addPerson,nameValue,personEventHandler,numberValue,numberEventHandler}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        <div>name: <input value={nameValue} onChange={personEventHandler} /></div>
        <div>number: <input value={numberValue} onChange={numberEventHandler} /></div>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default Form