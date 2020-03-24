import { SET_ORGANISATIONS, SET_IS_FETCHING, CLEAR_STATE } from '../actions/actionConstants';

const initialState = {
    organisations: [],
    isFetching: false
};

const reducer = (state=initialState, action) => {
    switch(action.type){
        case SET_ORGANISATIONS:
            return {
                ...state,
                organisations: action.organisations
            };
        case SET_IS_FETCHING:
            return {
                ...state,
                isFetching: action.status
            }
        case CLEAR_STATE:
            return {
                ...initialState
            }
        default:
            return {
                ...state
            };
    };
}

export default reducer;