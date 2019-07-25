import { combineReducers } from 'redux';
import sourceReducer from './sourceReducer'

const rootReducer = combineReducers({
    sources: sourceReducer
})

export default rootReducer;