import {gql, useMutation, useQuery} from "@apollo/client";
import {useEffect, useState} from "react";

const LOGIN = gql`
	mutation login($username: String!, $password: String!) {
		login(username: $username, password: $password)  {
			value
		}
	}
`

const Login = ({setToken}) => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const [login, result] = useMutation(LOGIN, {
		onError: (error) => {
			console.log(error.graphQLErrors[0].message)
		}
	})

	useEffect(() => {
		if (result.data) {
			const token = result.data.login.value
			setToken(token)
			localStorage.setItem('library-user-token', token)
		}
	}, [result.data])

	const submit = async (event) => {
		event.preventDefault()
		await login({variables: {username, password}})
	}

	return (
		<div>
			<form onSubmit={submit}>
				<div>
					name <input
						value={username}
						onChange={({target}) => setUsername(target.value)}
					/>
				</div>
				<div>
					pass <input
						type='password'
						value={password}
						onChange={({target}) => setPassword(target.value)}
					/>
				</div>
				<button type='submit'>login</button>
			</form>
		</div>
	)
}


export default Login