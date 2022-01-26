import React, {useEffect, useState} from 'react'
import axios from "axios";
import Search from "./Components/Search";
import CountriesList from "./Components/CountriesList";

const App = () => {

  const [countries, setCountries] = useState([])
  const [newCountriesFilter, setCountriesFilter] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.com/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  },[])

  const handleCountriesFilter = (event) => {
    setCountriesFilter(event.target.value)
  }

  return (
    <div>
      <Search value={newCountriesFilter} eventHandler={handleCountriesFilter} />
      <CountriesList countries={countries.filter(value => value.name.toLowerCase().match(newCountriesFilter.toLowerCase()))} handleCountriesFilter={ (e) => {handleCountriesFilter(e)} } />
    </div>
  )
}

export default App