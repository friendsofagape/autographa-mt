import { SET_CURRENT_USER, CLEAR_STATE } from '../actions/actionConstants';

const initState = {
    accessToken: null,
    firstName: null,
    lastName: null,
    email: null,
    role: null,
    current_user: {}
}

const authReducer = (state=initState, action) => {
    switch(action.type){
        case 'SET_ACCESS_TOKEN':
            return {
                ...state,
                accessToken: action.token.accessToken
            }
        case SET_CURRENT_USER:
            return {
                ...state,
                current_user: action.current_user
            }
        case CLEAR_STATE:
            return {
                ...initState
            }
        default:
            return state
    }
}

export default authReducer;