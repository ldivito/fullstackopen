const BlogForm = ({
    handleSubmit,
    handleTitleChange,
    handleAuthorChange,
    handleBlogUrlChange,
    title,
    author,
    blogUrl
    }) => {
        return (
            <div>
                <h2>Create new</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        title:
                        <input
                            value={title}
                            onChange={handleTitleChange}
                        />
                    </div>
                    <div>
                        author:
                        <input
                            value={author}
                            onChange={handleAuthorChange}
                        />
                    </div>
                    <div>
                        url:
                        <input
                            value={blogUrl}
                            onChange={handleBlogUrlChange}
                        />
                    </div>
                    <button type="submit">save</button>
                </form>
            </div>
        )
    }

export default BlogForm