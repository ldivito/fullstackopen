import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'

import { useNotificationDispatch } from "./NotificationContext"

import {createAnecdote, getAnecdotes, updateAnecdote} from "./services/requests";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const App = () => {

  const queryClient = useQueryClient()
  const notificationDispatch = useNotificationDispatch()

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate(
      { ...anecdote, votes: anecdote.votes + 1 },
      {
        onError: (error) => {
          notificationDispatch({ type: 'DISPLAY', payload: error.message })
          setTimeout(() => {
            notificationDispatch({ type: "CLEAR" })
          }, 5000)
        },
        onSuccess: () => {
          notificationDispatch({ type: 'DISPLAY', payload: `You voted for ${anecdote.content}` })
          setTimeout(() => {
            notificationDispatch({ type: "CLEAR" })
          }, 5000)
        }
      }
    )
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes
  })

  if(result.isLoading) return <div>Loading data...</div>

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
