import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
require('express-async-errors')

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (userJSON) {
      const user = JSON.parse(userJSON)
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


      const blogs = await blogService.getAll()
      const blogList = blogs.sort((a, b) => b.likes - a.likes)
      // Set the filtered blogs in the local storage
      window.localStorage.setItem('userBlogs', JSON.stringify(blogList))
      // Display the filtered blogs
      setBlogs(blogList)

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
            id='username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type='password'
            value={password}
            name='Password'
            id='password'
            onChange={({ target }) => setPassword(target.value)}/>
        </div>
        <button type='submit' id='login-button'>log in</button>
      </form>
    </div>
  )

  const blogForm = () => (
    <BlogForm
      setErrorMessage={setErrorMessage}
      setBlogs={setBlogs}
    />
  )

  const updateBlog = async (blog) => {
    try {
      await blogService.update(blog.id, blog)
      const blogs = await blogService.getAll()
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
      setErrorMessage(`blog titled ${blog.title} by ${blog.author} liked`)
    } catch (err) {
      setErrorMessage(`Liking blog titled ${blog.title} by ${blog.author} failed.`)
    }
  }

  const deleteBlog = async (id, blog) => {
    try {
      if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
        await blogService.remove(id)
        const response = await blogService.getAll()
        setBlogs(response)
        setErrorMessage(`Blog titled ${blog.title} by ${blog.author} deleted`)
      }
    } catch (err) {
      console.log(err)
      setErrorMessage(`Deleting blog titled ${blog.title} by ${blog.author} failed.`)
    }
  }

  return (
    <div>

      <h3>{errorMessage}</h3>

      {user && <div>
        {user.name} logged in <button onClick={handleLogout}>Logout</button>
      </div>
      }

      <br/>

      {user === null ?
        loginForm() :
        blogForm()
      }
      <h2>Blogs</h2>
      { user &&
          blogs.sort((a, b) => b.likes - a.likes).map(blog => <Blog key={blog.id} blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} username={user.username} />)
      }
      <br/>
    </div>

  )
}

export default App