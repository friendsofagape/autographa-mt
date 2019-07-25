const initState = {
    sourceId:null,
    book: '',
    targetLanguage: null,
    targetLanguageId: null,
    token: null,
    reference: null,
    verseNum: '',
    snackBarMessage: null,
    snackBarOpen: false,
    snackBarVariant: null
}

const sourceReducer = (state=initState, action) => {
    console.log(action)
    switch(action.type){
        case 'GET_SOURCES':
        return {
            ...state,
            sourceId:action.source.sourceId,
            book: action.source.book,
            targetLanguage: action.source.targetLanguage,
            targetLanguageId: action.source.targetLanguageId
        }
        case 'GET_SOURCES_ERROR':
        return {
            ...state, 
            sourceError: 'Source Fetch Failed'
        }
        case 'GET_TOKEN':
        return {
            ...state,
            token: action.token.token,
            reference: null,
            verseNum: null
        }
        case 'DISPLAY_POP_UP':
        return {
            ...state,
            snackBarMessage: action.popUp.snackBarMessage,
            snackBarOpen: action.popUp.snackBarOpen,
            snackBarVariant: action.popUp.snackBarVariant
        }
        case 'SAVE_REFERENCE':
        return {
            ...state,
            reference: action.reference.reference,
            verseNum: action.reference.verseNum
        }
        default:
        return state
    }
}

export default sourceReducer