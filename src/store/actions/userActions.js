import { SET_USERS, SET_IS_FETCHING, SET_ASSIGNED_USERS, SET_USER_BOOKS } from './actionConstants';
import apiUrl from '../../components/GlobalUrl.js';
import swal from 'sweetalert';

const accessToken = localStorage.getItem('accessToken');

export const fetchUsers = () => async dispatch => {
    try {
        dispatch(setIsFetching(true))
        const data = await fetch(apiUrl + 'v1/autographamt/users', {
            method: 'GET',
            headers: {
                "Authorization": 'bearer ' + accessToken
            }
        })
        const userData = await data.json();
        dispatch(setUsers(userData));
    }
    catch (e) {
        swal({
            title: 'Users',
            text: 'Unable to fetch users, check your internet connection or contact admin',
            icon: 'error'
        })
    }
    dispatch(setIsFetching(false))
};

export const updateAdminStatus = (data) => async dispatch => {
    try {
        dispatch(setIsFetching(true))
        const update = await fetch(apiUrl + 'v1/autographamt/approvals/users', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                Authorization: 'bearer ' + accessToken
            }
        });
        const response = await update.json();
        if (response.success) {
            dispatch(fetchUsers());
            swal({
                title: 'User status',
                text: 'User status has been updated successfully',
                icon: 'success'
            })
        } else {
            swal({
                title: 'User status',
                text: 'User status could not be updated. Please try later',
                icon: 'error'
            })
        }
    }
    catch (e) {
        swal({
            title: 'Users',
            text: 'Unable to update users, check your internet connection or contact admin',
            icon: 'error'
        })
    }
    dispatch(setIsFetching(false))
};

export const getAssignedUsers = (projectId) => async dispatch => {
    try {
        dispatch(setIsFetching(true))
        const data = await fetch(apiUrl + 'v1/autographamt/projects/assignments/' + projectId, {
            method: 'GET',
            headers: {
                Authorization: 'bearer ' + accessToken
            }
        })
        const assignedUsers = await data.json()
        if (!assignedUsers.message) {
            // this.setState({ assignedUsers })
            dispatch(setAssignedUsers(assignedUsers))
            dispatch(setIsFetching(false));
        } else {
            dispatch(setIsFetching(false))
            swal({
                title: 'Assigned Users',
                text: assignedUsers.message,
                icon: 'error'
            })

        }
    }
    catch (e) {
        dispatch(setIsFetching(false))
        swal({
            title: 'Assigned Users',
            text: 'Unable to fetch assigned users, check your internet connection or contact admin' + e,
            icon: 'error'
        })
    }
}


export const assignUserToProject = (apiData, close) => async dispatch => {
    dispatch(setIsFetching(true))
    try {
        const data = await fetch(apiUrl + 'v1/autographamt/projects/assignments', {
            method: 'POST',
            body: JSON.stringify(apiData)
        })
        const myJson = await data.json()
        // dispatch(setIsFetching(false))
        if(myJson.success){
            dispatch(getAssignedUsers(apiData.projectId));
            close();
        }
        swal({
            title: 'User assignment',
            text: myJson.message,
            icon: myJson.success ? "success" : "error"
        });
    } catch (ex) {
        swal({
            title: 'User assignment',
            text: 'Unable to update user to project, check your internet connection or contact admin admin ' + ex,
            icon: 'error'
        })
    }
    dispatch(setIsFetching(false))
}

export const deleteUser = (apiData) => async dispatch => {
    dispatch(setIsFetching(true))
    try {

        const data = await fetch(apiUrl + 'v1/autographamt/projects/assignments', {
            method: 'DELETE',
            body: JSON.stringify(apiData)
        })
        const response = await data.json()
        dispatch(setIsFetching(false))
        if (response.success) {
            swal({
                title: 'Remove user',
                text: 'User successfully removed from project',
                icon: 'success'
            })
            dispatch(getAssignedUsers(apiData.projectId));

        } else {
            swal({
                title: 'Remove user',
                text: response.message,
                icon: 'error'
            })

        }
    }
    catch (e) {

        swal({
            title: 'User assignment',
            text: 'Unable to remove user from project, check your internet connection or contact admin',
            icon: 'error'
        })
    }
}

export const deleteUserAccess = (apiData) => async dispatch => {
    dispatch(setIsFetching(true))
    try {
        // console.log("USERACTIONS$$$$$$$",apiData)
        const data = await fetch(apiUrl + 'v1/autographamt/user/delete', {
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
                title: 'Removed user',
                text: 'User successfully removed',
                icon: 'success'
            })
            dispatch(fetchUsers());

        } else {
            swal({
                title: 'User cannot be removed' ,
                text: response.message,
                icon: 'error'
            })

        }
    }
    catch (e) {

        swal({
            title: 'User assignment',
            text: 'Unable to remove user, check your internet connection or contact admin',
            icon: 'error'
        })
    }
}

export const getUserBooks = (userId, projectId) => async dispatch =>{
    try {
        dispatch(setIsFetching(true))
        const data = await fetch(apiUrl + 'v1/sources/projects/books/' + projectId + '/' + userId, {
            method: 'GET',
            headers: {
                Authorization: 'bearer ' + accessToken
            }
        })
        const response = await data.json()
        dispatch(setIsFetching(false))
        console.log('books', response)
        if("success" in response){
            swal({
                title: 'Fetch books',
                text: response.message,
                icon: 'error'
            })
        }else{
            dispatch(setUserBooks(response))
            // swal({
            //     title: 'Fetch books',
            //     text: 'Books fetched successfully',
            //     icon: 'success'
            // });
        }
    }
    catch (ex) {
        dispatch(setIsFetching(false))
        swal({
            title: 'Fetch books',
            text: 'Unable to fetch books of users, check your internet connection or contact admin',
            icon: 'error'
        });
    }
}

export const setUsers = (users) => ({
    type: SET_USERS,
    users
});

export const setAssignedUsers = users => ({
    type: SET_ASSIGNED_USERS,
    users
});

export const setUserBooks = books => ({
    type: SET_USER_BOOKS,
    books
});

export const setIsFetching = (status) => ({
    type: SET_IS_FETCHING,
    status
})