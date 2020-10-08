import React, { useState } from 'react'
import ReactDOM from 'react-dom'


const Button = ({handler, name}) => <button onClick={handler}>{name}</button>

const Statistic = ({text, value}) => {
  return (
    <>
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
    </>
  )
}

const Statistics = ({feedback}) => {
  const good = feedback[0].value
  const neutral = feedback[1].value
  const bad = feedback[2].value
  const all = good + neutral + bad
  let average = 0
  let positive = 0

  if (all !== 0) {
    average = (good*1 + neutral*0 + bad*(-1)) / all
    positive = good / all * 100
    return (
      <>
        <Statistic text="good" value={good} />
        <Statistic text="neutral" value={neutral} />
        <Statistic text="bad" value={bad} />
        <Statistic text="all" value={all} />
        <Statistic text="average" value={average} />
        <Statistic text="positive" value={positive + " %"} />
      </>
    )
  }
  return <p>No feedback given</p>
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
      <Statistics feedback={feedback} />
    </div>
  )
}



ReactDOM.render(<App />,
  document.getElementById('root')
)