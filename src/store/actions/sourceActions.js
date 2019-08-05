export const createSource = (source) => {
    return (dispatch, getState) => {
        dispatch({ type: 'GET_SOURCES', source })
    }
};

export const selectProject = (project) => {
    return (dispatch, getState) => {
        dispatch({ type: 'SELECT_PROJECT', project })
    }
}

export const selectedBooks = (selection) => {
    return (dispatch, getState) => {
        dispatch({ type: 'SELECTED_BOOKS', selection })
    }
}

export const selectToken = (token) => {
    return (dispatch, getState) => {
        dispatch({ type: 'SELECT_TOKEN', token })
    }
}

export const selectBook = (project) => {
    return (dispatch, getState) => {
        dispatch({type:"SELECT_BOOK", project})
    }
}

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