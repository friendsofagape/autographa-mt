export const createSource = (source) => {
    return (dispatch, getState) => {
        dispatch({ type: 'GET_SOURCES', source })
    }
};


export const saveToken = (token) => {
    return (dispatch, getState) => {
        dispatch({ type: 'GET_TOKEN', token })
    }
}

export const displaySnackBar = (popUp) => {
    return (dispatch, getState) => {
        dispatch({ type: 'DISPLAY_POP_UP', popUp})
    }
}

export const saveReference = (reference) => {
    return (dispatch, getState) => {
        dispatch({type: 'SAVE_REFERENCE', reference})
    }
}