export const setAccessToken = (token) => {
    return (dispatch, getState) => {
        dispatch({ type: 'SET_ACCESS_TOKEN', token })
    }
}