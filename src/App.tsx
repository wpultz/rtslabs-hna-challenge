import React, { useState } from 'react'

import { useHnSearch } from './hooks/hnSearch/useHnSearch'
import { useDebounceValue } from './hooks/debounceValue/useDebounceValue'

import styles from './App.module.css'

function App() {
  // State for the search text in the text input.
  const [searchText, setSearchText] = useState('')

  // Debounce value to be used in the actual search calls
  const debouncedSearchText = useDebounceValue(searchText, 500)

  // HN search hook. Search text in, results and status out.
  const { searchResults, isSearching, next, prev } = useHnSearch(debouncedSearchText)

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
          {prev && <button onClick={prev}>Previous</button>}
          {next && <button onClick={next}>Next</button>}
        </div>
      </div>
    </div>
  )
}

export default App
