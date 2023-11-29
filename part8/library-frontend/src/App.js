import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom'

const App = () => {

  return (
    <div>
      <Router>
        <div>
          <Link to="/authors">
            <button>authors</button>
          </Link>
          <Link to="/books">
            <button>books</button>
          </Link>
          <Link to="/add">
            <button>add book</button>
          </Link>
        </div>

        <Routes>
          <Route path="/authors" element={<Authors />} />
          <Route path="/books" element={<Books />} />
          <Route path="/add" element={<NewBook />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
