import {gql, useMutation, useQuery} from "@apollo/client";

const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

export const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(
    name: $name,
    setBornTo: $setBornTo
  ) {
    name
    born
    bookCount
  }
}
`

const Authors = () => {
  const result = useQuery(ALL_AUTHORS)

  const [changeBorn] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS } ]
  })

  if (result.loading) {
    return <div>loading...</div>
  }

  const authors = result.data.allAuthors

  const submit = async (event) => {
    event.preventDefault()

    const name = event.target.name.value
    const setBornTo = event.target.born.value

    console.log('change born...')
    await changeBorn({ variables: { name, setBornTo : Number(setBornTo) } })

    event.target.name.value = ''
    event.target.born.value = ''
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
        <tr>
          <th></th>
          <th>
            born
          </th>
          <th>
            books
          </th>
        </tr>
        {authors.map(a =>
          <tr key={a.name}>
            <td>{a.name}</td>
            <td>{a.born}</td>
            <td>{a.bookCount}</td>
          </tr>
        )}
        </tbody>
      </table>

      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          name
          <select name='name'>
            {authors.map(a =>
              <option key={a.name} value={a.name}>{a.name}</option>
            )}
          </select>
        </div>
        <div>
          born
          <input
            name='born'
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )

}

export default Authors
