import React, {useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import storageService from './services/storage'

import LoginForm from './components/LoginForm'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import { useDispatch } from 'react-redux'
import { setNotificationTimeout } from './reducers/notificationReducer'

const App = () => {
  const dispatch = useDispatch()

  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState('')

  const blogFormRef = useRef()


  useEffect(() => {
    const user = storageService.loadUser()
    setUser(user)
  }, [])

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  const login = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      setUser(user)
      storageService.saveUser(user)
      dispatch(
        setNotificationTimeout(5, {
          message: `Welcome ${user.name}`,
          type: 'info',
        }),
      )
    } catch (e) {
      dispatch(
        setNotificationTimeout(5, {
          message: 'wrong username or password',
          type: 'error',
        }),
      )
    }
  }

  const logout = async () => {
    setUser(null)
    storageService.removeUser()
    dispatch(
      setNotificationTimeout(5, {
        message: 'Logged out',
        type: 'info',
      }),
    )
  }

  const createBlog = async (newBlog) => {
    const createdBlog = await blogService.create(newBlog)
    dispatch(
      setNotificationTimeout(5, {
        message: `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
        type: 'info',
      }),
    )
    setBlogs(blogs.concat(createdBlog))
    blogFormRef.current.toggleVisibility()
  }

  const like = async (blog) => {
    const blogToUpdate = { ...blog, likes: blog.likes + 1, user: blog.user.id }
    const updatedBlog = await blogService.update(blogToUpdate)
    dispatch(
      setNotificationTimeout(5, {
        message: `You liked '${blog.title}' by ${blog.author}`,
        type: 'info',
      }),
    )
    setBlogs(blogs.map((b) => (b.id === blog.id ? updatedBlog : b)))
  }

  const remove = async (blog) => {
    const ok = window.confirm(
      `Sure you want to remove '${blog.title}' by ${blog.author}`,
    )
    if (ok) {
      await blogService.remove(blog.id)
      dispatch(
        setNotificationTimeout(5, {
          message: `You removed '${blog.title}' by ${blog.author}`,
          type: 'info',
        }),
      )
      setBlogs(blogs.filter((b) => b.id !== blog.id))
    }
  }

  if (!user) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification />
        <LoginForm login={login} />
      </div>
    )
  }

  const byLikes = (b1, b2) => b2.likes - b1.likes

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <div>
        {user.name} logged in
        <button onClick={logout}>logout</button>
      </div>
      <Togglable buttonLabel='new note' ref={blogFormRef}>
        <NewBlog createBlog={createBlog} />
      </Togglable>
      <div>
        {blogs.sort(byLikes).map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            like={() => like(blog)}
            canRemove={user && blog.user.username === user.username}
            remove={() => remove(blog)}
          />
        ))}
      </div>
    </div>
  )
}

export default App
