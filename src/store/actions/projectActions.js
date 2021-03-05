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
    SET_TRANSLATED_WORD
} from './actionConstants';
import apiUrl from '../../components/GlobalUrl.js';
import swal from 'sweetalert';
// import { setDisplayName } from 'recompose';
var FileSaver = require('file-saver');
var JSZip = require("jszip");
// var zip;

const accessToken = localStorage.getItem('accessToken');

export const fetchProjects = () => async (dispatch) => {
    dispatch(setIsFetching(true));
    try {
        const data = await fetch(apiUrl + 'v1/autographamt/projects', {
            method: 'GET',
            headers: {
                "Authorization": 'bearer ' + accessToken
            }
        });
        const projectLists = await data.json();
        if (!('message' in projectLists)) {
            dispatch(setProjects(projectLists));
        }

    }
    catch (e) {
        swal({
            title: 'Projects',
            text: 'Unable to fetch projects, check your internet connection or contact admin',
            icon: 'error'
        });

    }
    dispatch(setIsFetching(false));
}

export const createProject = (apiData, close, clearState) => async dispatch => {
    dispatch(setIsFetching(true))
    try {
        const data = await fetch(apiUrl + '/v1/autographamt/organisations/projects', {
            method: 'POST',
            body: JSON.stringify(apiData),
            headers: {
                Authorization: 'bearer ' + accessToken
            }
        })
        const myJson = await data.json();
        if (myJson.success) {
            clearState()
            dispatch(fetchProjects());
            swal({
                title: 'Projects',
                text: 'Project created successfully',
                icon: 'success'
            }).then(msg => {
                close()
                clearState()
            })
            dispatch(setIsFetching(false));
        } else {
            swal({
                title: 'Projects',
                text: 'Unable to create projects, contact admin or try again later',
                icon: 'error'
            });
            dispatch(setIsFetching(false));

        }
    }
    catch (e) {
        swal({
            title: 'Projects',
            text: 'Unable to create projects, check your internet connection or contact admin',
            icon: 'error'
        });
        dispatch(setIsFetching(false));
    }
}

export const deleteProject = (apiData) => async dispatch => {
    dispatch(setIsFetching(true))
    try {
        // console.log("USERACTIONS$$$$$$$",apiData)
        const data = await fetch(apiUrl + 'v1/autographamt/project/delete', {
            method: 'DELETE',
            headers: {
                Authorization: 'bearer ' + accessToken
            },
            body: JSON.stringify(apiData)
        })
        const response = await data.json()
        // console.log("USERACTIONSSSSSS%",response)
        dispatch(setIsFetching(false))
        if (response.success) {
            swal({
                title: 'Removed Project',
                text: 'User successfully removed',
                icon: 'success'
            })
            dispatch(fetchProjects());

        } else {
            swal({
                title: 'Project cannot be removed' ,
                text: response.message,
                icon: 'error'
            })

        }
    }
    catch (e) {

        swal({
            title: 'Project assignment',
            text: 'Unable to remove Project, check your internet connection or contact admin',
            icon: 'error'
        })
    }
}

export const fetchUserProjects = () => async dispatch => {
    try {
        dispatch(setIsFetching(true))
        const data = await fetch(apiUrl + 'v1/autographamt/users/projects', {
            method: 'GET',
            headers: {
                Authorization: 'bearer ' + accessToken
            }
        })
        const response = await data.json()
        if ('success' in response) {
            swal({
                title: 'Fetch users projects',
                text: response.message,
                icon: 'error'
            });
        } else {
            // this.setState({ projects: response })
            dispatch(setUserProjects(response))
        }
        dispatch(setIsFetching(false))
    }
    catch (ex) {
        dispatch(setIsFetching(false))
        swal({
            title: 'Fetch users projects',
            text: 'Unable to fetch users projects, check your internet connection or contact admin',
            icon: 'error'
        });
    }
}

export const fetchTokenList = (currentBook, sourceId) => async dispatch => {
    dispatch(setIsFetching(true))
    var bookData = await fetch(apiUrl + 'v1/tokenlist/' + sourceId + '/' + currentBook, {
        method: 'GET'
    })
    const tokenList = await bookData.json();
    dispatch(setTokenList(tokenList))
    dispatch(setIsFetching(false))
    // this.setState({ tokenList: tokenList })
}

export const fetchConcordances = (token, sourceId, book) => async dispatch => {
    if (book) {
        dispatch(setIsFetching(true))
        try {
            const data = await fetch(apiUrl + '/v1/concordances/' + sourceId + '/' + book + '/' + token, {
                method: 'GET'
            })
            const concordance = await data.json()
            dispatch(setConcordance(concordance))
            dispatch(setIsFetching(false))
        }
        catch (e) {
            dispatch(setIsFetching(false))
        }
        // await this.setState({ concordance: concordance })
    }
}

export const getTranslatedText = (projectId, bookList, projectName) => async dispatch => {
    const apiData = {
        projectId,
        bookList
    }
    dispatch(setIsFetching(true))
    try {
        const data = await fetch(apiUrl + 'v1/downloaddraft', {
            method: 'POST',
            body: JSON.stringify(apiData),
            headers: {
                Authorization: 'bearer ' + accessToken
            }
        })
        const myJson = await data.json()
        if ("translatedUsfmText" in myJson) {
            const usfmTexts = myJson.translatedUsfmText
            var zip = new JSZip();

            Object.keys(usfmTexts).map(book => {
                // let blob = new Blob([usfmTexts[book]], { type: "text/plain;charset=utf-8" });
                zip.file(book+".usfm",usfmTexts[book])
                // FileSaver.saveAs(blob, book + "_" + projectName.split("|")[0] + "_.usfm");
            })
            zip.generateAsync({type:"blob"})
            .then(function(content) {
            // see FileSaver.js
            FileSaver.saveAs(content, projectName.split("|")[0]+".zip");
            });
        } else {

            swal({
                title: 'Download drafts',
                text: 'Unable to download drafts: ' + myJson.message,
                icon: 'error'
            });
        }
    }
    catch (ex) {
        swal({
            title: 'Fetch users projects',
            text: 'Unable to fetch users projects, check your internet connection or contact admin',
            icon: 'error'
        });
    }
    dispatch(setIsFetching(false))
}
export const updateTransaltion = (apiData, clear) => async (dispatch, getState) => {
    dispatch(setIsFetching(true));
    try {
        const update = await fetch(apiUrl + 'v1/autographamt/projects/translations', {
            method: 'POST',
            body: JSON.stringify(apiData),
            headers: {
                Authorization: 'bearer ' + accessToken
            }
        })
        const myJson = await update.json()
        if (myJson.success) {
            clear()
            dispatch(getTranslatedWords(getState().project.selectedToken, getState().project.selectedProject.sourceId, getState().project.selectedProject.targetId))
            swal({
                title: 'Token translation',
                text: myJson.message,
                icon: 'success'
            });
        } else {
            swal({
                title: 'Token translation',
                text: myJson.message,
                icon: 'error'
            });
        }
    }
    catch (ex) {
        swal({
            title: 'Token translation',
            text: 'Token translation failed, check your internet connection or contact admin',
            icon: 'error'
        });
    }
    dispatch(setIsFetching(false));
}

export const getTranslatedWords = (token, sourceId, targetLanguageId) => async dispatch => {
    dispatch(setIsFetching(true))
    try{
        const data = await fetch(apiUrl + '/v1/translations/' + sourceId + '/' + targetLanguageId + '/' + token, {
            method: 'GET'
        })
        const translatedWords = await data.json()
        if ("translation" in translatedWords) {
            const { translation, senses } = translatedWords
            dispatch(setTranslatedWord(translatedWords))
        } else {
            dispatch(setTranslatedWord({
                translation: '',
                senses: []
            }))
        }
    }
    catch(e){
        swal({
            title: 'Translation fetch error',
            text: 'Failed to fetch token translation, check your internet connection or contact admin',
            icon: 'error'
        });
    }
    dispatch(setIsFetching(false))
}

export const setTranslatedWord = translation => ({
    type: SET_TRANSLATED_WORD,
    translation
});

export const setSelectedProject = project => ({
    type: SET_SELECTED_PROJECT,
    project
})

export const setUserProjects = projects => ({
    type: SET_USER_PROJECTS,
    projects
})

export const setProjects = (projects) => ({
    type: SET_PROJECTS,
    projects
});

export const setIsFetching = (status) => ({
    type: SET_IS_FETCHING,
    status
});

export const setTokenList = tokens => ({
    type: SET_TOKEN_LIST,
    tokens
})

export const setSelectedBook = book => ({
    type: SET_SELECTED_BOOK,
    book
});

export const setSelectedToken = token => ({
    type: SET_SELECTED_TOKEN,
    token
});

export const setConcordance = concordance => ({
    type: SET_CONCORDANCE,
    concordance
})

export const setReference = reference => ({
    type: SET_REFERENCE_NUMBER,
    reference
});