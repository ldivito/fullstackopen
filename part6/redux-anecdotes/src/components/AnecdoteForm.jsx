import { useDispatch } from 'react-redux'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target['anecdote'].value
    dispatch({
      type: 'anecdote/newAnecdote',
      payload: content
    })
    event.target['anecdote'].value = ''
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