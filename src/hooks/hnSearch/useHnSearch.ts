/**
 * This custom hook is used to call out to the Algolia API and make subsequent updates to the Redux store. It takes
 * a search string as an argument. Whenever the search string argument changes, a new API request is made. Following
 * each API request, an action from the hnSearch Redux module is dispatched to update the application state.
 */

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  searchClear,
  searchStart,
  searchComplete,
  searchError,
  selectSearchResults,
  selectIsSearching,
  ISearchResult,
} from '../../store/hnSearch/hnSearch'

export function useHnSearch(text: string): [ISearchResult[], boolean] {
  const dispatch = useDispatch()
  const searchResults = useSelector(selectSearchResults)
  const isSearching = useSelector(selectIsSearching)

  useEffect(() => {
    // useEffect callbacks must be synchronous, which is why an IIFE must be used in order to use async/await syntax.
    ;(async function search() {
      if (!text.length) {
        dispatch(searchClear())
      } else {
        dispatch(searchStart(text))

        try {
          const resp = await fetch(`http://hn.algolia.com/api/v1/search?query=${text}&tags=story`)
          if (resp.ok) {
            const response = await resp.json()

            dispatch(searchComplete(response.hits, response.page, response.nbHits, response.nbPages))
          } else {
            dispatch(searchError(resp.statusText))
          }
        } catch (err) {
          dispatch(searchError(err.message || 'Error while searching'))
        }
      }
    })()
  }, [text])

  return [searchResults, isSearching]
}
