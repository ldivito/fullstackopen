import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

test('renders title and author by default and not number of likes', async () => {
  const blog = {
    title: "This is a test blog title",
    author: 'Leandro',
    likes: 50,
    url: 'https://www.google.com',
    user: {},
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText(
    "This is a test blog title Leandro"
  );
  expect(element).toBeDefined()
  const { container } = render(<Blog blog={blog} />)
  const likes = container.querySelector('.likes')
  expect(likes).toEqual(null)
});