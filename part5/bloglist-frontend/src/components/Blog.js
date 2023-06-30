import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, deleteBlog, username }) => {

  const [blogVisible, setBlogVisible] = useState(false)
  const [userLikes, setUserLikes] = useState(blog.likes)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const hideWhenVisible = { display: blogVisible ? 'none' : '' }
  const showWhenVisible = { display: blogVisible ? '' : 'none' }

  const updatedBlog = {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    user: blog.user.id,
    id: blog.id,
    likes: userLikes + 1,
  }

  const addLike = () => {
    setUserLikes(userLikes + 1)
    updateBlog(updatedBlog)
  }

  return (
    <div style={blogStyle} className="blog">
      <div className="title-author">
        {blog.title} {blog.author}
        <span style={hideWhenVisible}>
          <button onClick={() => setBlogVisible(true)}>View</button>
        </span>
        <span style={showWhenVisible}>
          <button onClick={() => setBlogVisible(false)}>Hide</button>
        </span>
      </div>

      {blogVisible && (
        <div style={showWhenVisible}>
          <ul>
            <li className="url">URL: {blog.url}</li>
            <li className="likes">Likes: {blog.likes} <button onClick={addLike}>Like</button></li>
            <li className="user">User: {blog.user.username}</li>
          </ul>
          <div>
            {blog.user.username === username && (
              <button onClick={() => deleteBlog(blog.id, blog)}>Remove</button>
            )}
          </div>
        </div>)}
    </div>
  )}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  username:  PropTypes.string.isRequired
}

export default Blog