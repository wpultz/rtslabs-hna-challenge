import { ThunkDispatch } from 'redux-thunk'

// Subset of the properties available on an individual search result.
// An exhaustive set of all properties is not necessary to build this application.
export interface ISearchResult {
  title: string
  author: string
  url: string
  story_text: string
  comment_text: string
  objectID: string
}

interface ISearchResponse {
  hits: ISearchResult[]
  page: number
  nbHits: number
  nbPages: number
  [key: string]: any
  query: string
}

// Aliased subset of the properties available in a search results response.
// An exhaustive set of all properties is not necessary to build this application.
interface IHnSearchState {
  isSearching: boolean
  error: string
  text: string
  response: ISearchResponse
}

// Default state for the search slice of the store.
const defaultState: IHnSearchState = {
  isSearching: false,
  error: '',
  text: '',
  response: {
    hits: [],
    page: 0,
    nbHits: 0,
    nbPages: 0,
    query: '',
  },
}

// Action types enum.
export enum ActionTypes {
  SearchPending = 'SEARCH_PENDING',
  SearchComplete = 'SEARCH_COMPLETE',
  SearchError = 'SEARCH_ERROR',
  SearchClear = 'SEARCH_CLEAR',
}

// Interfaces and type definition for the actions available from this Redux module.
interface ISearchStartAction {
  type: ActionTypes.SearchPending
  payload: string
}
interface ISearchCompleteAction {
  type: ActionTypes.SearchComplete
  payload: ISearchResponse
}
interface ISearchErrorAction {
  type: ActionTypes.SearchError
  payload: string
}
interface ISearchClearAction {
  type: ActionTypes.SearchClear
}

type SearchActionTypes = ISearchStartAction | ISearchCompleteAction | ISearchErrorAction | ISearchClearAction

//  Reducer, default export as specified in the Ducks pattern.
export default function reducer(state: IHnSearchState = defaultState, action: SearchActionTypes): IHnSearchState {
  switch (action.type) {
    case ActionTypes.SearchPending:
      return { ...state, isSearching: true, error: '', text: action.payload }

    case ActionTypes.SearchComplete:
      return { ...state, isSearching: false, response: { ...action.payload } }

    case ActionTypes.SearchError:
      return { ...state, isSearching: false, error: action.payload }

    case ActionTypes.SearchClear:
      return defaultState

    default:
      return state
  }
}

// Primitive action creators.
export function searchStart(text: string): SearchActionTypes {
  return { type: ActionTypes.SearchPending, payload: text }
}

export function searchComplete(
  hits: ISearchResult[],
  page: number,
  nbHits: number,
  nbPages: number,
  query: string
): SearchActionTypes {
  return {
    type: ActionTypes.SearchComplete,
    payload: { hits, page, nbHits, nbPages, query },
  }
}

export function searchError(error: string): SearchActionTypes {
  return { type: ActionTypes.SearchError, payload: error }
}

export function searchClear(): SearchActionTypes {
  return { type: ActionTypes.SearchClear }
}

/**
 * Thunk action to call the Algolia API and update the store state.
 *
 * @param text Text to use as the query to the Algolia API
 * @param pageIdx Page index to request for the given search string. Defaulted to 0.
 */
export function search(text: string, pageIdx: number = 0) {
  return async (dispatch: ThunkDispatch<{}, {}, any>) => {
    if (!text.length) {
      dispatch(searchClear())
    } else {
      dispatch(searchStart(text))

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
  }
}

/**
 * Thunk action to calculate the next page index and perform a search.
 */
export function nextPage() {
  return async (dispatch: ThunkDispatch<{}, {}, any>, getState: () => IHnSearchState) => {
    const state = getState()
    const nextPageIdx = selectCurrentPage(state) + 1
    const searchText = selectSearchText(state)

    dispatch(search(searchText, nextPageIdx))
  }
}

/**
 * Thunk action to calculate the previous page index and perform a search.
 */
export function prevPage() {
  return async (dispatch: ThunkDispatch<{}, {}, any>, getState: () => IHnSearchState) => {
    const state = getState()
    const prevPageIdx = selectCurrentPage(state) - 1
    const searchText = selectSearchText(state)

    dispatch(search(searchText, prevPageIdx))
  }
}

// Selector functions.
export const selectSearchResults = (state: IHnSearchState) => state.response.hits

export const selectIsSearching = (state: IHnSearchState) => state.isSearching

export const selectHasNextPage = (state: IHnSearchState) => state.response.page < state.response.nbPages - 1

export const selectHasPrevPage = (state: IHnSearchState) => state.response.page > 0

export const selectCurrentPage = (state: IHnSearchState) => state.response.page

export const selectSearchText = (state: IHnSearchState) => state.text
