import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'

import hnSearch from './hnSearch/hnSearch'

// TODO figure out the TS error with the reducer signature. Seems like maybe related to not using combineReducers
// @ts-ignore
export const store = createStore(hnSearch, composeWithDevTools(applyMiddleware(thunk)))
