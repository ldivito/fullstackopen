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

import { setUsers } from "./reducers/userReducer";

import LoginForm from "./components/LoginForm";
import NewBlog from "./components/NewBlog";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";

import { useDispatch, useSelector } from "react-redux";
import { setNotificationTimeout } from "./reducers/notificationReducer";

const App = () => {
  const dispatch = useDispatch();

  const blogs = useSelector((state) => state.blogs);
  const users = useSelector((state) => state.users);

  const blogFormRef = useRef();

  useEffect(() => {
    const user = storageService.loadUser();
    dispatch(setUsers(user));
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
      dispatch(setUsers(user));
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
    dispatch(setUsers(null));
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

  if (!users) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification />
        <LoginForm login={login} />
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <div>
        {users.name} logged in
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
            user={users}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
