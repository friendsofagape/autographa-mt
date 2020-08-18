export const uploadDialog = (status) => {
    return (dispatch, getState) => {
        dispatch({ type: 'TOGGLE_UPLOAD_PANE', status })
    }
}

export const booksDialog = (status) => {
    return (dispatch, getState) => {
        dispatch({ type: 'TOGGLE_BOOKS_CHECKBOX', status})
    }
}