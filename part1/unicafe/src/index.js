import React, { useState } from 'react'
import ReactDOM from 'react-dom'


const Button = ({handler, name}) => <button onClick={handler}>{name}</button>

const Static = ({text, value}) => <p>{text}: {value}</p>

const Statistic = ({feedback}) => {
  const good = feedback[0].value;
  const neutral = feedback[1].value;
  const bad = feedback[2].value;

  if ( (good + neutral + bad) <= 0 ) {
    return (
      <div>
        <h1>Statics</h1>
        <p>No feedback given</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Statics</h1>

      <Static text="Good" value={good} />
      <Static text="Neutral" value={neutral} />
      <Static text="Bad" value={bad} />
      <Static text="All" value={good + neutral + bad} />
      <Static text="Average" value={(good - bad) / (good + bad + neutral)} />
      <Static text="Positive" value={(good / (bad + good + neutral)) * 100} />
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
      <Statistic feedback={feedback} />
    </div>
  )
}



ReactDOM.render(<App />,
  document.getElementById('root')
)