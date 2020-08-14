import { 
    SET_PROJECTS, 
    SET_IS_FETCHING, 
    SET_USER_PROJECTS, 
    SET_SELECTED_BOOK, 
    SET_TOKEN_LIST,
    SET_SELECTED_PROJECT,
    SET_SELECTED_TOKEN,
    SET_CONCORDANCE,
    SET_REFERENCE_NUMBER,
    CLEAR_STATE,
    SET_TRANSLATED_WORD
} from '../actions/actionConstants';

const initialState = {
    projects: [],
    isFetching: false,
    userProjects: [],
    selectedBook: '',
    tokenList: [],
    selectedProject: {},
    selectedToken: '',
    concordance: {},
    reference: '',
    verseNum: {},
    translation: '',
    senses: []
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PROJECTS:
            return {
                ...state,
                projects: action.projects
            };
        case SET_IS_FETCHING:
            return {
                ...state,
                isFetching: action.status
            }
        case SET_USER_PROJECTS:
            return {
                ...state,
                userProjects: action.projects
            }
        case SET_SELECTED_BOOK:
            return {
                ...state,
                selectedBook: action.book
            }
        case SET_TOKEN_LIST:
            return {
                ...state,
                tokenList: action.tokens
            }
        case SET_SELECTED_PROJECT:
            return {
                ...state,
                selectedProject: action.project
            }
        case SET_SELECTED_TOKEN:
            return {
                ...state,
                selectedToken: action.token,
                concordance: {},
                reference: '',
                verseNum: {},
                translation: '',
                senses: []
            }
        case SET_CONCORDANCE:
            return {
                ...state,
                concordance: action.concordance
            }
        case SET_REFERENCE_NUMBER:
            return {
                ...state,
                reference: action.reference.reference,
                verseNum: action.reference.verseNum
            }
        case SET_TRANSLATED_WORD:
            console.log('action', action)
            return {
                ...state,
                translation: action.translation.translation,
                senses: action.translation.senses
            }
        case CLEAR_STATE:
            return {
                ...initialState
            }
        default:
            return {
                ...state
            };
    };
}

export default reducer;