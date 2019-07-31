import { combineReducers } from 'redux';
import sourceReducer from './sourceReducer'
import authReducer from './authReducer'
import dialogReducer from './dialogReducer'

const rootReducer = combineReducers({
    sources: sourceReducer,
    auth: authReducer,
    dialog: dialogReducer
})

export default rootReducer;