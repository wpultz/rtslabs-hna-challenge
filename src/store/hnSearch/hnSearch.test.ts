import * as hn from './hnSearch'
const reducer = hn.default

describe('hnSearch redux module', () => {
  describe('reducer', () => {
    it('should produce default state', () => {
      const curState = reducer(undefined, { type: 'INIT', payload: '' })

      expect(curState).toEqual({
        isSearching: false,
        error: '',
        text: '',
        response: {
          hits: [],
          page: 0,
          nbHits: 0,
          nbPages: 0,
        },
      })
    })

    it('should update the `isSearching` flag and clear error on SearchStart action', () => {
      const prevState = {
        isSearching: false,
        error: 'err',
        text: '',
        response: {
          hits: [],
          page: 0,
          nbHits: 0,
          nbPages: 0,
        },
      }

      const curState = reducer(prevState, hn.searchStart('search text'))

      expect(curState).toMatchObject({
        isSearching: true,
        text: 'search text',
        error: '',
      })
    })

    it('should update `isSearching flag and search response on SearchComplete action', () => {
      const prevState = {
        isSearching: true,
        error: '',
        text: 'search text',
        response: {
          hits: [],
          page: 0,
          nbHits: 0,
          nbPages: 0,
        },
      }

      const searchResults = [
        {
          title: 'cool article',
          author: 'talented writer',
          url: 'articles.com',
          story_text: '',
          comment_text: '',
          objectID: 'abc123',
        },
      ]

      const curState = reducer(prevState, hn.searchComplete(searchResults, 1, 2, 3))

      expect(curState).toMatchObject({
        isSearching: false,
        response: {
          hits: searchResults,
          page: 1,
          nbHits: 2,
          nbPages: 3,
        },
      })
    })

    it('should update the `isSearching` flag and error on SearchError action', () => {
      const prevState = {
        isSearching: true,
        error: '',
        text: 'search text',
        response: {
          hits: [],
          page: 0,
          nbHits: 0,
          nbPages: 0,
        },
      }

      const curState = reducer(prevState, hn.searchError('oops'))

      expect(curState).toMatchObject({
        isSearching: false,
        error: 'oops',
      })
    })

    it('should return default state on SearchClear action', () => {
      const prevState = {
        isSearching: true,
        error: 'asdf',
        text: 'search text',
        response: {
          hits: [
            {
              title: 'cool article',
              author: 'talented writer',
              url: 'articles.com',
              story_text: '',
              comment_text: '',
              objectID: 'abc123',
            },
          ],
          page: 1,
          nbHits: 2,
          nbPages: 3,
        },
      }

      const curState = reducer(prevState, hn.searchClear())

      expect(curState).toMatchObject({
        isSearching: false,
        error: '',
        text: '',
        response: {
          hits: [],
          page: 0,
          nbHits: 0,
          nbPages: 0,
        },
      })
    })
  })

  describe('action creators', () => {
    it('should produce a SearchState action', () => {
      expect(hn.searchStart('hey')).toEqual({
        type: hn.ActionTypes.SearchPending,
        payload: 'hey',
      })
    })

    it('should produce a SearchComplete action', () => {
      expect(hn.searchComplete([], 1, 2, 3)).toEqual({
        type: hn.ActionTypes.SearchComplete,
        payload: {
          hits: [],
          page: 1,
          nbHits: 2,
          nbPages: 3,
        },
      })
    })

    it('should produce a SearchError action', () => {
      expect(hn.searchError('whoops')).toEqual({
        type: hn.ActionTypes.SearchError,
        payload: 'whoops',
      })
    })

    it('should produce a SearchClear action', () => {
      expect(hn.searchClear()).toEqual({
        type: hn.ActionTypes.SearchClear,
      })
    })
  })

  describe('selectors', () => {
    it('should select the array of search results', () => {
      const searchResults = [
        {
          title: 'cool article',
          author: 'talented writer',
          url: 'articles.com',
          story_text: '',
          comment_text: '',
          objectID: 'abc123',
        },
      ]

      const state = {
        isSearching: false,
        error: '',
        text: 'search text',
        response: {
          hits: searchResults,
          page: 0,
          nbHits: 0,
          nbPages: 0,
        },
      }

      expect(hn.selectSearchResults(state)).toEqual(searchResults)
    })

    it('should select the `isSearching` flag state', () => {
      const state = {
        isSearching: true,
        error: '',
        text: 'search text',
        response: {
          hits: [],
          page: 0,
          nbHits: 0,
          nbPages: 0,
        },
      }

      expect(hn.selectIsSearching(state)).toEqual(true)
    })
  })
})
