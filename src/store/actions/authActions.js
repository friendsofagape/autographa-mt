import jwt_decode from 'jwt-decode';
import { SET_CURRENT_USER, CLEAR_STATE } from './actionConstants';

export const validateAccessToken = () => async dispatch => {
    let decoded;
// let tokenAliveFlag = false
    var accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
        decoded = jwt_decode(accessToken)
        console.log('decoded', decoded)
        let currentDate = new Date().getTime()
        let expiry = decoded.exp * 1000
        // var firstName = decoded.firstName
        var hours = (expiry - currentDate) / 36e5
        if(hours > 0){
            // tokenAliveFlag = true
            dispatch(setCurrentUser({
                firstName: decoded.firstName,
                lastName: decoded.lastName,
                email: decoded.sub,
                role: decoded.role
            }))
            console.log("logged in")
        }else{
            console.log("logged out")
            window.location = '/signin'
        }
    }
}

export const clearState = () => ({
    type: CLEAR_STATE
});

export const setAccessToken = (token) => {
    return (dispatch, getState) => {
        dispatch({ type: 'SET_ACCESS_TOKEN', token })
    }
}

export const setCurrentUser = (current_user) => ({
    type: SET_CURRENT_USER,
    current_user
})