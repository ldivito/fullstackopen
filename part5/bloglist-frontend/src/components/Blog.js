import {useState} from "react";

const Blog = ({ blog, updateBlog, deleteBlog, username }) => {

  const [blogVisible, setBlogVisible] = useState(false)
  const [userLikes, setUserLikes] = useState(blog.likes);

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
  };

  const addLike = () => {
    setUserLikes(userLikes + 1)
    updateBlog(updatedBlog)
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <span style={hideWhenVisible}>
           <button onClick={() => setBlogVisible(true)}>View</button>
        </span>
        <span style={showWhenVisible}>
          <button onClick={() => setBlogVisible(false)}>Hide</button>
        </span>
      </div>

      <div style={showWhenVisible}>
        <ul>
          <li>URL: {blog.url}</li>
          <li>Likes: {blog.likes} <button onClick={addLike}>Like</button></li>
          <li>User: {blog.user.username}</li>
        </ul>
        <div>
          {blog.user.username === username && (
            <button onClick={() => deleteBlog(blog.id, blog)}>Remove</button>
          )}
        </div>
      </div>
    </div>
)}

export default Blog