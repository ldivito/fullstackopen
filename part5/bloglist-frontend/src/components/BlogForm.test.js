import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const setBlogs = jest.fn()
  const user = userEvent.setup()

  render(<BlogForm setBlogs={setBlogs}/>)

  const authorInput = screen.getByPlaceholderText('author')
  const urlInput = screen.getByPlaceholderText('url')
  const TitleInput = screen.getByPlaceholderText('title')
  const createButton = screen.getByText('save')

  await user.type(TitleInput, 'This is a test blog title')
  await user.type(authorInput, 'Leandro')
  await user.type(urlInput,'https://www.google.com')
  await user.click(createButton)

  expect(setBlogs).toHaveBeenCalledTimes(1)
  expect(setBlogs.mock.calls[0][0].title).toBe(
    'This is a test blog title Leandro'
  )
})