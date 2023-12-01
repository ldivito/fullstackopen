import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommendations from './components/Recommendations'
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom'
import {useApolloClient} from "@apollo/client";

const App = () => {
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  // Check if user is logged in
  if (!token && localStorage.getItem('library-user-token')) {
    setToken(localStorage.getItem('library-user-token'))
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  if (!token) {
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
            <Link to={"/login"}>
              <button>login</button>
            </Link>
          </div>

          <Routes>
            <Route path="/authors" element={<Authors />} />
            <Route path="/books" element={<Books />} />
            <Route path="/login" element={<Login setToken={setToken} />} />
          </Routes>
        </Router>
      </div>
    )
  }

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
          <Link to="/recommendations">
            <button>recommendations</button>
          </Link>
          <button onClick={logout}>logout</button>
        </div>

        <Routes>
          <Route path="/authors" element={<Authors />} />
          <Route path="/books" element={<Books />} />
          <Route path="/add" element={<NewBook />} />
          <Route path="/recommendations" element={<Recommendations />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
