/* eslint-disable indent */

import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const blogsSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    addBlog(state, action) {
      return [...state, action.payload];
    },
    deleteBlog(state, action) {
      return state.filter((blog) => blog.id !== action.payload);
    },
    likeBlog(state, action) {
      const updatedBlog = action.payload;
      return state.map((blog) =>
        blog.id !== updatedBlog.id ? blog : updatedBlog,
      );
    },
  },
});

export const { setBlogs, addBlog, deleteBlog, likeBlog } = blogsSlice.actions;
export default blogsSlice.reducer;
