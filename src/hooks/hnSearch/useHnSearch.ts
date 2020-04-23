/**
 * This custom hook is used to call out to the Algolia API and make subsequent updates to the Redux store. It takes
 * a search string as an argument. Whenever the search string argument changes, a new API request is made. Following
 * each API request, an action from the hnSearch Redux module is dispatched to update the application state.
 */

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  searchClear,
  searchStart,
  searchComplete,
  searchError,
  selectSearchResults,
  selectIsSearching,
  selectHasNextPage,
  selectHasPrevPage,
  ISearchResult,
} from '../../store/hnSearch/hnSearch'

export function useHnSearch(
  text: string
): { searchResults: ISearchResult[]; isSearching: boolean; next: null | (() => void); prev: null | (() => void) } {
  const dispatch = useDispatch()
  const searchResults = useSelector(selectSearchResults)
  const isSearching = useSelector(selectIsSearching)
  const hasNextPage = useSelector(selectHasNextPage)
  const hasPrevPage = useSelector(selectHasPrevPage)

  // Keep a local state for the page number. This will be updated from the next/prev fns
  const [pageNum, setPageNum] = useState(0)
  // Keep state of the last searched text. This will be used to compare to the next search text to decide whether the
  // page index number needs to be zero'd.
  const [prevSearchText, setPrevSearchText] = useState(text)

  useEffect(() => {
    // useEffect callbacks must be synchronous, which is why an IIFE must be used in order to use async/await syntax.
    ;(async function search() {
      if (!text.length) {
        dispatch(searchClear())
      } else {
        dispatch(searchStart(text))

        // Default the page number to the specified page number.
        let pageIdx = pageNum

        // If the search text has changed, zero the page number both for the request and in the pageNum state.
        if (text !== prevSearchText) {
          pageIdx = 0
          setPageNum(0)
        }

        setPrevSearchText(text)

        try {
          const resp = await fetch(`http://hn.algolia.com/api/v1/search?query=${text}&tags=story&page=${pageIdx}`)
          if (resp.ok) {
            const response = await resp.json()

            dispatch(searchComplete(response.hits, response.page, response.nbHits, response.nbPages, response.query))
          } else {
            dispatch(searchError(resp.statusText))
          }
        } catch (err) {
          dispatch(searchError(err.message || 'Error while searching'))
        }
      }
    })()
  }, [text, pageNum])

  const next = hasNextPage
    ? () => {
        setPageNum(pageNum + 1)
      }
    : null

  const prev = hasPrevPage
    ? () => {
        setPageNum(pageNum - 1)
      }
    : null

  return { searchResults, isSearching, next, prev }
}
