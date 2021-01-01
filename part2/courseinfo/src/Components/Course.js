import React from "react";

const Header = ({ course }) => {
  return (
    <h2>{course.name}</h2>
  )
}

const Total = ({ course }) => {
  const exercises = course.parts.map((part) => part.exercises)
  const total = exercises.reduce((s, p) => s + p)
  return(
    <strong>Total of exercises {total}</strong>
  )
}

const Part = (props) => {
  return (
    <p>
      {props.part.name} {props.part.exercises}
    </p>
  )
}

const Content = ({ course }) => {
  return (
    <div>
      <ul>
        {course.parts.map((part) => <li key={part.id}><Part part={part} /></li>)}
      </ul>
      <Total course={course} />
    </div>
  )
}

const Course = ({course}) => (
  <div>
    <Header course={course} />
    <Content course={course} />
  </div>
)

export default Course