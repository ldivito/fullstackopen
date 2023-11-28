/* eslint-disable indent */

import { createSlice } from '@reduxjs/toolkit'

const initialState = []

const blogsSlice = createSlice({
	name: 'blogs',
	initialState,
	reducers: {
		setBlogs(state, action) {
			return action.payload
		},
		createBlog(state, action) {
			return [...state, action.payload]
		},
	},
})

export const { setBlogs, createBlog} = blogsSlice.actions
export default blogsSlice.reducer