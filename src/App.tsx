import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { useDebounceValue } from './hooks/debounceValue/useDebounceValue'
import {
  search,
  nextPage,
  prevPage,
  selectSearchResults,
  selectIsSearching,
  selectHasNextPage,
  selectHasPrevPage,
} from './store/hnSearch/hnSearch'

import styles from './App.module.css'

function App() {
  // State for the search text in the text input.
  const [searchText, setSearchText] = useState('')

  const dispatch = useDispatch()
  const searchResults = useSelector(selectSearchResults)
  const isSearching = useSelector(selectIsSearching)
  const hasNext = useSelector(selectHasNextPage)
  const hasPrev = useSelector(selectHasPrevPage)

  // Debounce value to be used in the actual search calls
  const debouncedSearchText = useDebounceValue(searchText, 500)

  useEffect(() => {
    dispatch(search(debouncedSearchText))
  }, [debouncedSearchText])

  return (
    <div className={styles.app}>
      <div className={styles.main}>
        <form className="u-flex" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            className="u-flexGrow1"
            disabled={isSearching}
            placeholder="Type to search Hacker News"
          />
        </form>
        {searchResults.map((res) => {
          return (
            <article key={res.objectID} className={styles.result}>
              <h1>{res.title}</h1>
              <p>
                <i>Authored by {res.author}</i>
              </p>
            </article>
          )
        })}
        <div className="u-flex u-flexJustifyEnd">
          {hasPrev && <button onClick={() => dispatch(prevPage())}>Previous</button>}
          {hasNext && <button onClick={() => dispatch(nextPage())}>Next</button>}
        </div>
      </div>
    </div>
  )
}

export default App
