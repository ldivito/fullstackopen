import { useRef, useState } from 'react'
import blogService from '../services/blogs'
import Togglable from './Togglable'
import PropTypes from 'prop-types'

const BlogForm = ({ setErrorMessage, setBlogs }) => {

  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

  const blogFormRef = useRef()

  const addBlog = async (event) => {
    event.preventDefault()
    blogFormRef.current.toggleVisibility()
    try {
      const blogObject = {
        title: newBlogTitle,
        author: newBlogAuthor,
        url: newBlogUrl
      }

      await blogService.create(blogObject)

      const blogs = await blogService.getAll()
      setBlogs(blogs)

      setErrorMessage(`a new blog ${newBlogTitle} by ${newBlogAuthor} `)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)

      setNewBlogTitle('')
      setNewBlogAuthor('')
      setNewBlogUrl('')
    } catch (exception) {
      setErrorMessage('Cannot add new blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  return (
    <div>
      <h2>Create new Blog</h2>
      <Togglable buttonLabel='New blog' ref={blogFormRef}>
        <form onSubmit={addBlog}>
          <div>
            <label htmlFor="title">title:</label>
            <input
              value={newBlogTitle}
              id='title'
              placeholder='title'
              onChange={({ target }) => setNewBlogTitle(target.value)}
            />
          </div>
          <div>
            <label htmlFor="author">author:</label>
            <input
              value={newBlogAuthor}
              id='author'
              placeholder='author'
              onChange={({ target }) => setNewBlogAuthor(target.value)}
            />
          </div>
          <div>
            <label htmlFor="url">url:</label>
            <input
              value={newBlogUrl}
              id='url'
              placeholder='url'
              onChange={({ target }) => setNewBlogUrl(target.value)}
            />
          </div>
          <button type="submit">save</button>
        </form>
      </Togglable>
    </div>
  )
}

BlogForm.propTypes = {
  setErrorMessage: PropTypes.func.isRequired,
  setBlogs: PropTypes.func.isRequired
}

export default BlogForm