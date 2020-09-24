import React from 'react'
import ReactDOM from 'react-dom'

const App = () => {
  const course = {
    name: 'Half Stack application development',
    lesson: [
      {
        name: "Fundamentals of React",
        exercises: 10
      },
      {
        name: "Using props to pass data",
        exercises: 7
      },
      {
        name: "State of a component",
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  )
}

const Header = (props) => {
  return (
    <h1>{props.course.name}</h1>
  )
}

const Content = (props) => {
  return (
    <>
      <p>{props.course.lesson[0].name} {props.course.lesson[0].exercises}</p>
      <p>{props.course.lesson[1].name} {props.course.lesson[1].exercises}</p>
      <p>{props.course.lesson[2].name} {props.course.lesson[2].exercises}</p>
    </>
  )
}

const Total = (props) => {
  let exerciseAmount = 0;

  props.course.lesson.forEach(item => {
    exerciseAmount += item.exercises;
  })
  console.log(exerciseAmount);

  return (
    <p>Number of exercises {exerciseAmount}</p>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))