import {
  SET_BIBLE_LANGUAGES,
  SET_ALL_LANGUAGES,
  SET_IS_FETCHING,
  CLEAR_STATE,
  SET_SOURCE_BOOKS,
  SET_UPLOAD_ERROR_BOOKS,
  COMPLETED_UPLOAD,
} from "../actions/actionConstants";
const initState = {
  bibleLanguages: [],
  allLanguages: [],
  isFetching: false,
  sourceBooks: [],
  uploadErrorBooks: [],
  completedUpload: true,
};

const sourceReducer = (state = initState, action) => {
  switch (action.type) {
    case SET_BIBLE_LANGUAGES:
      return {
        ...state,
        bibleLanguages: action.bibleLanguages,
      };
    case SET_ALL_LANGUAGES:
      return {
        ...state,
        allLanguages: action.allLanguages,
      };
    case SET_UPLOAD_ERROR_BOOKS:
      return {
        ...state,
        uploadErrorBooks: [...state.uploadErrorBooks, action.book],
      };
    case SET_SOURCE_BOOKS:
      return {
        ...state,
        sourceBooks: action.books,
      };
    case COMPLETED_UPLOAD:
      return {
        ...state,
        completedUpload: action.status,
      };
    case SET_IS_FETCHING:
      return {
        ...state,
        isFetching: action.status,
      };
    case CLEAR_STATE:
      return {
        ...initState,
      };
    case "GET_SOURCES":
      return {
        ...state,
        sourceId: action.source.sourceId,
        book: action.source.book,
        targetLanguage: action.source.targetLanguage,
        targetLanguageId: action.source.targetLanguageId,
      };
    case "SELECT_PROJECT":
      return {
        ...state,
        project: action.project.project,
      };
    case "SELECT_BOOK":
      return {
        ...state,
        book: action.project.book,
        token: null,
      };
    case "SELECTED_BOOKS":
      return {
        ...state,
        selectedBooks: action.selection.selectedBooks,
      };
    case "SELECT_TOKEN":
      return {
        ...state,
        token: action.token.token,
        reference: null,
        verseNum: null,
      };
    case "GET_SOURCES_ERROR":
      return {
        ...state,
        sourceError: "Source Fetch Failed",
      };
    case "GET_TOKEN":
      return {
        ...state,
        token: action.token.token,
        reference: null,
        verseNum: null,
      };
    case "DISPLAY_POP_UP":
      return {
        ...state,
        snackBarMessage: action.popUp.snackBarMessage,
        snackBarOpen: action.popUp.snackBarOpen,
        snackBarVariant: action.popUp.snackBarVariant,
      };
    case "SAVE_REFERENCE":
      return {
        ...state,
        reference: action.reference.reference,
        verseNum: action.reference.verseNum,
      };
    default:
      return state;
  }
};

export default sourceReducer;
