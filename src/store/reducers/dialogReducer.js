const initState = {
    uploadPane: false,
    booksPane: false
}

const dialogReducer = (state=initState, action) => {
    switch(action.type){
        case 'TOGGLE_UPLOAD_PANE':
            return {
                ...state,
                uploadPane: action.status.uploadPane
            }
        default:
            return state
        case 'TOGGLE_BOOKS_CHECKBOX':
            return {
                ...state,
                booksPane: action.status.booksPane
            }
    }
}


export default dialogReducer;