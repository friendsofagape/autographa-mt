import { combineReducers } from 'redux';
import sourceReducer from './sourceReducer';
import authReducer from './authReducer';
import dialogReducer from './dialogReducer';
import projectReducer from './projectReducer';
import organisationReducer from './organisationReducer';
import userReducer from './userReducer';

const rootReducer = combineReducers({
    sources: sourceReducer,
    auth: authReducer,
    dialog: dialogReducer,
    project: projectReducer,
    organisation: organisationReducer,
    user: userReducer,
});

export default rootReducer;