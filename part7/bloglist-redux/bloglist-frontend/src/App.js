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
import {Button, ListGroup, Table} from "react-bootstrap";

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
      <Table striped>
        <thead>
          <tr>
            <th>User</th>
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
      </Table>

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
      <ListGroup>
        {user.blogs.map((blog) => (
          <ListGroup.Item key={blog.id}>{blog.title}</ListGroup.Item>
        ))}
      </ListGroup>

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
        type: "success",
      }),
    );
  }

  return (
    <div>
      <h2>{blog.title} by {blog.author}</h2>
      <a href={blog.url}>{blog.url}</a>
      <div>
        {blog.likes} likes
        <Button variant="success" onClick={() => like(blog)}>like</Button>
      </div>
      <div>added by {blog.user.username}</div>
      <h3>comments</h3>
      <div>
        <input id="comment" />
        <Button variant="primary" onClick={() => comment(blog)}>add comment</Button>
      </div>
      <ListGroup>
        {blog.comments.map((comment) => (
          <ListGroup.Item key={comment}>{comment}</ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export const Base = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      blogs.sort((b1, b2) => b2.likes - b1.likes);
      dispatch(setBlogs(blogs));
    });
  }, [dispatch]);

  const createBlog = async (newBlog) => {
    const createdBlog = await blogService.create(newBlog);
    dispatch(addBlog(blogs, createdBlog));
    dispatch(
      setNotificationTimeout(5, {
        message: `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
        type: "success",
      }),
    );
    blogFormRef.current.toggleVisibility();
  };


  return (
    <div>
      <h2>blogs</h2>
      <Togglable buttonLabel="new note" ref={blogFormRef}>
        <NewBlog createBlog={createBlog} />
      </Togglable>
      <br/>
      <Table striped>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog.id}>
              <td>
                <Link to={`/blogs/${blog.id}`}>
                  {blog.title} {blog.author}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

    </div>
  );
}

export const App = () => {
  const dispatch = useDispatch();

  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);


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
          type: "success",
        }),
      );
    } catch (e) {
      dispatch(
        setNotificationTimeout(5, {
          message: "wrong username or password",
          type: "danger",
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
        type: "success",
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
          type: "success",
        }),
      );
    }
  };

  if (!user) {
    return (
      <div className="container">
        <h2>log in to application</h2>
        <br/>
        <Notification />
        <br/>
        <LoginForm login={login} />
      </div>
    );
  }

  return (
    <Router>
      <div className="container">
        <div style={{ backgroundColor: "lightgray", padding: 5 }}>
          <Link to="/" style={{ paddingRight: 5 }}>blogs</Link>
          <Link to="/users" style={{ paddingRight: 5 }}>users</Link>
          {user.name} logged in <Button variant="danger" onClick={logout}>logout</Button>
        </div>

        <div>
          <br/>
          <Notification />
        </div>

        <Routes>
          <Route path="/" element={<Base />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="/blogs/:id" element={<BlogDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
