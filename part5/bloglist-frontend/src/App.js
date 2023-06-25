import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
require('express-async-errors')

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogFormVisible, setBlogFormVisible] = useState(false)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const handleLogin =  async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const addBlog = async (event) => {
    event.preventDefault()

    blogFormRef.current.toggleVisibility()
    try {
      const blogObject = {
        title: newBlogTitle,
        author: newBlogAuthor,
        url: newBlogUrl
      }

      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))

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

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type='text'
            value={username}
            name='Username'
            onChange={({target}) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type='password'
            value={password}
            name='Password'
            onChange={({target}) => setPassword(target.value)}/>
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )

  const blogForm = () => (
    <Togglable buttonLabel='New blog' ref={blogFormRef}>
      <BlogForm
        handleSubmit={addBlog}
        handleTitleChange={({target}) => setNewBlogTitle(target.value)}
        handleAuthorChange={({target}) => setNewBlogAuthor(target.value)}
        handleBlogUrlChange={({target}) => setNewBlogUrl(target.value)}
        title={newBlogTitle}
        author={newBlogAuthor}
        blogUrl={newBlogUrl}
      />
    </Togglable>
  )

  return (
    <div>

      <h3>{errorMessage}</h3>

      {user && <div>
        {user.username} logged in <button onClick={handleLogout}>Logout</button>
      </div>
      }

      <br/>

      {user === null ?
        loginForm() :
        blogForm()
      }

      <h2>Blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}

      <br/>

    </div>

  )
}

export default App