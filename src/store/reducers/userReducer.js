import { SET_USERS, SET_IS_FETCHING, SET_ASSIGNED_USERS, SET_USER_BOOKS, CLEAR_STATE } from '../actions/actionConstants';

const initialState = {
    users: [],
    isFetching: false,
    assignedUsers: [],
    userBooks: {}
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USERS:
            return {
                ...state,
                users: action.users
            };
        case SET_ASSIGNED_USERS:
            return {
                ...state,
                assignedUsers: action.users
            }
        case SET_IS_FETCHING:
            return {
                ...state,
                isFetching: action.status
            }
        case SET_USER_BOOKS:
            return {
                ...state,
                userBooks: action.books
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