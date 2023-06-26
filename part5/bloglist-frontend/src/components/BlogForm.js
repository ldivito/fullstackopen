import {useRef, useState} from "react";
import Togglable from "./Togglable";

const BlogForm = ({
    blogService,
    setErrorMessage,
    blogs, setBlogs
    }) => {
        const [newBlogTitle, setNewBlogTitle] = useState('')
        const [newBlogAuthor, setNewBlogAuthor] = useState('')
        const [newBlogUrl, setNewBlogUrl] = useState('')

        const blogFormRef = useRef()

        const addBlog = async (event) => {
            event.preventDefault()
            blogFormRef.current.toggleVisibility()
            try {
                const blogObject = {
                    title: newBlogTitle,
                    author: newBlogAuthor,
                    url: newBlogUrl
                }

                const newBlog = await blogService.create(blogObject)
                setBlogs(blogs.concat(newBlog))

                setErrorMessage(`a new blog ${newBlogTitle} by ${newBlogAuthor} `)
                setTimeout(() => {
                    setErrorMessage(null)
                }, 5000)

                setNewBlogTitle('')
                setNewBlogAuthor('')
                setNewBlogUrl('')
            } catch (exception) {
                setErrorMessage('Cannot add new blog')
                setTimeout(() => {
                    setErrorMessage(null)
                }, 5000)
            }
        }

        return (
            <div>
                <h2>Create new Blog</h2>
                <Togglable buttonLabel='New blog' ref={blogFormRef}>
                    <form onSubmit={addBlog}>
                        <div>
                            title:
                            <input
                              value={newBlogTitle}
                              onChange={({target}) => setNewBlogTitle(target.value)}
                            />
                        </div>
                        <div>
                            author:
                            <input
                              value={newBlogAuthor}
                              onChange={({target}) => setNewBlogAuthor(target.value)}
                            />
                        </div>
                        <div>
                            url:
                            <input
                              value={newBlogUrl}
                              onChange={({target}) => setNewBlogUrl(target.value)}
                            />
                        </div>
                        <button type="submit">save</button>
                    </form>
                </Togglable>
            </div>
        )
    }

export default BlogForm