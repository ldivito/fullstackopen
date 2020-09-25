import React, { useState } from 'react'
import ReactDOM from 'react-dom'


const Button = ({handler, name}) => <button onClick={handler}>{name}</button>

const Statics = ({feedback}) => {
  const good = feedback[0].value;
  const neutral = feedback[1].value;
  const bad = feedback[2].value;

  return (
    <div>
      <h1>Statics</h1>
      <p>Good: {good}</p>
      <p>Neutral: {neutral}</p>
      <p>Bad: {bad}</p>
      <p>All: {good + neutral + bad}</p>
      <p>Average: {(good - bad) / (good + neutral + bad)}</p>
      <p>Positive: {(good / (good + neutral + bad)) * 100} %</p>
    </div>
  )
}

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const feedback = [
    {name: "Good", value: good},
    {name: "Neutral", value: neutral},
    {name: "Bad", value: bad}
  ]

  const handleGoodFeedback = () => {
    setGood(good + 1)
  }
  const handleNeutralFeedback = () => {
    setNeutral(neutral + 1)
  }
  const handleBadFeedback = () => {
    setBad(bad + 1)
  }

  return (
    <div>
      <h1>Give feedback</h1>
      <Button handler={handleGoodFeedback} name="Good" />
      <Button handler={handleNeutralFeedback} name="Neutral" />
      <Button handler={handleBadFeedback} name="Bad" />
      <Statics feedback={feedback} />
    </div>
  )
}



ReactDOM.render(<App />,
  document.getElementById('root')
)