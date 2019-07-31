const initState = {
    uploadPane: false
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
    }
}

export default dialogReducer;