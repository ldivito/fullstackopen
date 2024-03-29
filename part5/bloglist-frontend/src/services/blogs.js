import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const config = () => ({
  headers: {
    Authorization: token,
  },
})

const setToken = newToken => {
  token = `Bearer ${newToken}`
}
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const response = await axios.post(baseUrl, newObject, config())
  return response.data
}

const update = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject, config())
  return response.data
}

const remove = async (id) => {
  await axios.delete(`${baseUrl}/${id}`, config())
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, create, update, remove, setToken }