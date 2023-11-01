import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {createAnecdote} from "../services/requests";
import { useNotificationDispatch } from "../NotificationContext"

const AnecdoteForm = () => {

  const queryClient = useQueryClient()
  const notificationDispatch = useNotificationDispatch()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate(
      { content, votes: 0 },
      {
        onError: (error) => {
          // Return error when creating anecdote and length of content is less than 5 characters
          if (content.length > 5) {
            notificationDispatch({ type: 'DISPLAY', payload: error.message })
          } else {
            notificationDispatch({ type: 'DISPLAY', payload: `Anecdote must be at least 5 characters long` })
          }
          setTimeout(() => {
            notificationDispatch({ type: "CLEAR" })
          }, 5000)
        },
        onSuccess: () => {
          notificationDispatch({ type: 'DISPLAY', payload: `You created ${content}`})
          setTimeout(() => {
            notificationDispatch({ type: "CLEAR" })
          }, 5000)
        }
      }
    )
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
