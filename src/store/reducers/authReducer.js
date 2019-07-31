const initState = {
    accessToken: null,
    firstName: null,
    lastName: null,
    email: null,
    role: null
}

const authReducer = (state=initState, action) => {
    console.log('auth reducer')
    switch(action.type){
        case 'SET_ACCESS_TOKEN':
            return {
                ...state,
                accessToken: action.token.accessToken
            }
        default:
            return state
    }
}

export default authReducer;