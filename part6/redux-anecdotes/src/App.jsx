import { useSelector, useDispatch } from 'react-redux'

const App = () => {
  const anecdotes = useSelector(state => state)
  const dispatch = useDispatch()

  const generateId = () => Number((Math.random() * 1000000).toFixed(0))

  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target['anecdote'].value
    event.target['anecdote'].value = ''
    // Dispatch the action creator here for adding a new anecdote
    dispatch({
      type: 'ADD_ANECDOTE',
      payload: {
        content,
        id: generateId(),
        votes: 0
      }
    })
  }


  const vote = (id) => {
    // Dispatch the action creator here for voting
    dispatch({
      type: 'VOTE',
      data: { id }
    })
  }

  return (
    <>
      <h2>Anecdotes</h2>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <input name='anecdote' />
        <button type='submit'>create</button>
      </form>
    </>
  )
}

export default App