export const uploadDialog = (status) => {
    return (dispatch, getState) => {
        dispatch({ type: 'TOGGLE_UPLOAD_PANE', status })
    }
}