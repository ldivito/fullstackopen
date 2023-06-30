import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title and author by default and not number of likes', async () => {
  const blog = {
    title: 'This is a test blog title',
    author: 'Leandro',
    likes: 50,
    url: 'https://www.google.com',
    user: {},
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText(
    'This is a test blog title Leandro'
  )
  expect(element).toBeDefined()
  const { container } = render(<Blog blog={blog} />)
  const likes = container.querySelector('.likes')
  expect(likes).toEqual(null)
  const url = container.querySelector('.url')
  expect(url).toEqual(null)
})

test('URL and Like count is visible when clicking the show more button', async () => {
  const blog = {
    title: 'This is a test blog title',
    author: 'Leandro',
    likes: 50,
    url: 'https://www.google.com',
    user: {},
  }

  const user = userEvent.setup()
  const { container } = render(<Blog blog={blog} />)

  const view = screen.getByText('View')
  await user.click(view)

  const likes = container.querySelector('.likes')
  const url = container.querySelector('.url')
  expect(url).toBeDefined()
  expect(likes).toBeDefined()
})

test('Clicking the like button twice calls the event handler also two times', async () => {
  const blog = {
    title: 'This is a test blog title',
    author: 'Leandro',
    likes: 50,
    url: 'https://www.google.com',
    user: {},
  }

  const user = userEvent.setup()
  const updateBlog = jest.fn()

  const { container } = render(<Blog blog={blog} updateBlog={updateBlog} />)
  const viewButton = screen.getByText('View')
  await user.click(viewButton)

  const likeButton = screen.getByText('Like')
  await user.click(likeButton)
  await user.click(likeButton)
  expect(updateBlog).toHaveBeenCalledTimes(2)
})