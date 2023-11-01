import { useDispatch } from 'react-redux'
import anecdoteService from '../services/anecdotes'
import {createAnecdote} from "../reducers/anecdoteReducer.js";

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target['anecdote'].value
    event.target['anecdote'].value = ''
    dispatch(createAnecdote(content))
    dispatch({
      type: 'notifications/setNotification',
      payload: `you created '${content}'`
    })
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div><input name="anecdote"/></div>
        <button type="submit">create</button>
      </form>
    </>
  )
}

export default AnecdoteForm