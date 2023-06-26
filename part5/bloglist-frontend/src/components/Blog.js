import {useState} from "react";

const Blog = ({ blog }) => {

  const [blogVisible, setBlogVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const hideWhenVisible = { display: blogVisible ? 'none' : '' }
  const showWhenVisible = { display: blogVisible ? '' : 'none' }

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
          <li>Likes: {blog.likes}</li>
          <li>User: {blog.user.username}</li>
        </ul>
      </div>
    </div>
)}

export default Blog