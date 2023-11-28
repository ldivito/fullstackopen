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
  Routes, Route
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
              <td>{user.username}</td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
      <div>
        <h2>blogs</h2>
        <Notification />
        <div>
          {user.name} logged in
          <button onClick={logout}>logout</button>
        </div>
        <Togglable buttonLabel="new note" ref={blogFormRef}>
          <NewBlog createBlog={createBlog} />
        </Togglable>
        <div>
          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              like={like}
              remove={remove}
              user={user}
            />
          ))}
        </div>
      </div>

      <Routes>
        <Route path="/users" element={<Users />} />
      </Routes>
    </Router>
  );
};

export default App;
