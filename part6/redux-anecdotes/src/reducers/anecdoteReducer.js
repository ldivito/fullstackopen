import {createSlice} from "@reduxjs/toolkit";

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const anecdoteReducer = createSlice({
  name: 'anecdote',
  initialState: [],
  reducers: {
    addVote(state, action) {
      const id = action.payload
      const anecdoteToVote = state.find(a => a.id === id)
      const votedAnecdote = {
        ...anecdoteToVote,
        votes: anecdoteToVote.votes + 1
      }
      // Return the anecdotes array with the voted anecdote replaced and sort it by votes
      return state.map(a => a.id !== id ? a : votedAnecdote).sort((a, b) => b.votes - a.votes)
    },
    newAnecdote(state, action) {
      state.push(action.payload)
    },
    appendAnecdotes(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const {addVote, newAnecdote, appendAnecdotes, setAnecdotes} = anecdoteReducer.actions
export default anecdoteReducer.reducer