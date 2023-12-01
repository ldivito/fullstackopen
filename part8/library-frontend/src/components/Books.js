import {gql, useQuery} from "@apollo/client";
import {useEffect, useState} from 'react';

const ALL_BOOKS = gql`
  query allBooks($genres: String) {
    allBooks(genres: $genres) {
      title
      author {
        name
      }
      published
      genres
    }
  }
`

const ALL_GENRES = gql`
  query {
    allGenres
  }
`

const GenreButtons = ({setSelectedGenre}) => {
  const result = useQuery(ALL_GENRES);

  if (result.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      {result.data.allGenres.map(g => <button key={g} onClick={() => setSelectedGenre(g)}>{g}</button>)}
      <button onClick={() => setSelectedGenre(null)}>all genres</button>
    </div>
  )
}

const Books = () => {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const { loading, data, refetch } = useQuery(ALL_BOOKS, { variables: { genres: selectedGenre } });

  useEffect(() => {
    if (selectedGenre) {
      refetch();
    }
  }, [selectedGenre, refetch]);

  if (loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>books</h2>
      <div>
        {selectedGenre ? `in genre ${selectedGenre}` : 'all genres'}
      </div>
      <table>
        <tbody>
        <tr>
          <th></th>
          <th>
            author
          </th>
          <th>
            published
          </th>
        </tr>
        {data.allBooks.map(b =>
          <tr key={b.title}>
            <td>{b.title}</td>
            <td>{b.author.name}</td>
            <td>{b.published}</td>
          </tr>
        )}
        </tbody>
      </table>
      <GenreButtons setSelectedGenre={setSelectedGenre} />
    </div>
  )
}
export default Books
