import {gql, useQuery} from "@apollo/client";
import {useEffect, useState} from 'react';

const USER_GENRES = gql`
	query {
		me {
			favoriteGenre
		}
	}
`

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

const Recommendatios = () => {
	const [userGenres, setUserGenres] = useState(null)
	const {loading, data} = useQuery(USER_GENRES)
	const {loading: loadingBooks, data: dataBooks} = useQuery(ALL_BOOKS, {variables: {genres: userGenres}})

	useEffect(() => {
		if (data) {
			setUserGenres(data.me.favoriteGenre)
		}
	}, [data])

	if (loading || loadingBooks) {
		return <div>loading...</div>
	}

	return (
		<div>
			<h2>recommendations</h2>
			<div>
				books in your favorite genre <b>{userGenres}</b>
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
				{dataBooks.allBooks.map(b =>
					<tr key={b.title}>
						<td>{b.title}</td>
						<td>{b.author.name}</td>
						<td>{b.published}</td>
					</tr>
				)}
				</tbody>
			</table>
		</div>
	)
}

export default Recommendatios