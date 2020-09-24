import React from 'react'
import ReactDOM from 'react-dom'

const App = () => {
  const course = {
    name: 'Half Stack application development',
    lessons: [
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
      <Content lessons={course.lessons} />
      <Total lessons={course.lessons} />
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
      <Part lesson={props.lessons[0]} />
      <Part lesson={props.lessons[1]} />
      <Part lesson={props.lessons[2]} />
    </>
  )
}

const Part = (props) => {
  return (
    <div>
      <p>
        {props.lesson.name} {props.lesson.exercises}
      </p>
    </div>
  )
}

const Total = (props) => {
  let exerciseAmount = 0;

  props.lessons.forEach(item => {
    exerciseAmount += item.exercises;
  })

  return (
    <p>Number of exercises {exerciseAmount}</p>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))