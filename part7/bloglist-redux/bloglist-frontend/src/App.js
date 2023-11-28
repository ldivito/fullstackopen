/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import React, { useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import {
  addBlog,
  setBlogs,
  likeBlog,
  deleteBlog,
} from "./reducers/blogReducer";
import loginService from "./services/login";
import storageService from "./services/storage";

import { setUser } from "./reducers/userReducer";

import usersService from "./services/users";
import { setUsers } from "./reducers/usersReducer";

import LoginForm from "./components/LoginForm";
import NewBlog from "./components/NewBlog";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";

import { useDispatch, useSelector } from "react-redux";
import { setNotificationTimeout } from "./reducers/notificationReducer";
import {
  BrowserRouter as Router,
  Routes, Route, useParams, Link
} from 'react-router-dom'

export const Users = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);

  useEffect(() => {
    usersService.getAll().then((users) => {
      dispatch(setUsers(users));
    })
  }, []);

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td><Link to={`/users/${user.id}`}>{user.username}</Link></td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const User = () => {
  const id = useParams().id;

  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);
  const user = users.find((user) => user.id === id);

  useEffect(() => {
    usersService.getAll().then((users) => {
      dispatch(setUsers(users));
    })
  }
  , []);

  if (!user) {
    return null;
  }

  return (
    <div>
      <h2>{user.username}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
}

export const BlogDetails = () => {
  const id = useParams().id;

  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const blog = blogs.find((blog) => blog.id === id);

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      blogs.sort((b1, b2) => b2.likes - b1.likes);
      dispatch(setBlogs(blogs));
    });
  }, [dispatch]);

  if (!blog) {
    return null;
  }

  const like = async (blog) => {
    const blogToUpdate = { ...blog, likes: blog.likes + 1, user: blog.user.id };
    const updatedBlog = await blogService.update(blogToUpdate);
    dispatch(likeBlog(updatedBlog));
    dispatch(
      setNotificationTimeout(5, {
        message: `You liked '${blog.title}' by ${blog.author}`,
        type: "info",
      }),
    );
  };

  const comment = async (blog) => {
    const comment = document.getElementById("comment").value;
    const updatedBlog = await blogService.comment(blog.id, comment);
    dispatch(
      setNotificationTimeout(5, {
        message: `You commented '${blog.title}' by ${blog.author}`,
        type: "info",
      }),
    );
  }

  return (
    <div>
      <h2>{blog.title} by {blog.author}</h2>
      <a href={blog.url}>{blog.url}</a>
      <div>
        {blog.likes} likes
        <button onClick={() => like(blog)}>like</button>
      </div>
      <div>added by {blog.user.username}</div>
      <h3>comments</h3>
      <div>
        <input id="comment" />
        <button onClick={() => comment(blog)}>add comment</button>
      </div>
      <ul>
        {blog.comments.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
    </div>
  );
}

export const Base = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      blogs.sort((b1, b2) => b2.likes - b1.likes);
      dispatch(setBlogs(blogs));
    });
  }, [dispatch]);

  return (
    <div>
      <h2>blogs</h2>
      <div>
        {blogs.map((blog) => (
          <Link key={blog.id} to={`/blogs/${blog.id}`}>
            <Blog
              key={blog.id}
              blog={blog}
              like={() => like(blog)}
              remove={() => remove(blog)}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export const App = () => {
  const dispatch = useDispatch();

  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);

  const blogFormRef = useRef();

  useEffect(() => {
    const user = storageService.loadUser();
    dispatch(setUser(user));
  }, []);

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      blogs.sort((b1, b2) => b2.likes - b1.likes);
      dispatch(setBlogs(blogs));
    });
  }, [dispatch]);

  const login = async (username, password) => {
    try {
      const user = await loginService.login({ username, password });
      dispatch(setUser(user));
      storageService.saveUser(user);
      dispatch(
        setNotificationTimeout(5, {
          message: `Welcome ${user.name}`,
          type: "info",
        }),
      );
    } catch (e) {
      dispatch(
        setNotificationTimeout(5, {
          message: "wrong username or password",
          type: "error",
        }),
      );
    }
  };

  const logout = async () => {
    dispatch(setUser(null));
    storageService.removeUser();
    dispatch(
      setNotificationTimeout(5, {
        message: "Logged out",
        type: "info",
      }),
    );
  };

  const createBlog = async (newBlog) => {
    const createdBlog = await blogService.create(newBlog);
    dispatch(addBlog(blogs, createdBlog));
    dispatch(
      setNotificationTimeout(5, {
        message: `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
        type: "info",
      }),
    );
    blogFormRef.current.toggleVisibility();
  };

  const remove = async (blog) => {
    const ok = window.confirm(
      `Sure you want to remove '${blog.title}' by ${blog.author}`,
    );
    if (ok) {
      await blogService.remove(blog.id);
      dispatch(deleteBlog(blog.id));
      dispatch(
        setNotificationTimeout(5, {
          message: `You removed '${blog.title}' by ${blog.author}`,
          type: "info",
        }),
      );
    }
  };

  if (!user) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification />
        <LoginForm login={login} />
      </div>
    );
  }

  return (
    <Router>
      <div style={{ backgroundColor: "lightgray", padding: 5 }}>
        <Link to="/" style={{ paddingRight: 5 }}>blogs</Link>
        <Link to="/users" style={{ paddingRight: 5 }}>users</Link>
        {user.name} logged in <button onClick={logout}>logout</button>
      </div>

      <div>
        <h2>blogs</h2>
        <Notification />

        <Togglable buttonLabel="new note" ref={blogFormRef}>
          <NewBlog createBlog={createBlog} />
        </Togglable>
      </div>

      <Routes>
        <Route path="/" element={<Base />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User />} />
        <Route path="/blogs/:id" element={<BlogDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
