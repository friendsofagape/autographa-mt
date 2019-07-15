import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import { Checkbox, Paper } from '@material-ui/core';
import ComponentHeading from '../ComponentHeading';
import apiUrl from '../GlobalUrl'
import PopUpMessages from '../PopUpMessages'

const accessToken = localStorage.getItem('access_token')

export default class ListUsers extends Component {
    state = {
        userId: '',
        admin: '',
        snackBarOpen: false,
        popupdata: {},
    }


    async getUsers(){
        const {updateState, userStatus} = this.props.data
        const data = await fetch(apiUrl + '/v1/autographamt/users', {
            method:'GET',
            headers: {
                "Authorization": 'bearer ' + accessToken
            }
        })
        const userData = await data.json()
        userData.map(item => {
            if(item.roleId > 1){
                userStatus[item.userId] = {
                    "admin":true,
                    "verified":item.verified
                }
            }else{
                userStatus[item.userId] = {
                    "admin":false,
                    "verified":item.verified
                }
            }
        })
        updateState({userData:userData, userStatus:userStatus})
    }

    async userAdminAssignment(admin, userId){
        try{
            const apiData = {
                userId: userId,
                admin: admin
            }
            const data = await fetch(apiUrl + 'v1/autographamt/approvals/users', {
                method: 'POST',
                body: JSON.stringify(apiData),
                headers: {
                    Authorization: 'bearer ' + accessToken
                }
            })
            const response = await data.json()
            if(response.success){
                this.getUsers()
                this.setState({ snackBarOpen: true, popupdata: { variant: "success", message: response.message, snackBarOpen: true, closeSnackBar: this.closeSnackBar } })
                // this.getOrganisations()

            }else{
                this.setState({ snackBarOpen: true, popupdata: { variant: "error", message: response.message, snackBarOpen: true, closeSnackBar: this.closeSnackBar } })
            }
        }
        catch(ex){
            this.setState({ snackBarOpen: true, popupdata: { variant: "error", message: "Server Error", snackBarOpen: true, closeSnackBar: this.closeSnackBar } })
        }
    }

    handleChange = (userId) => {
        const { userStatus, updateState } = this.props.data
        const admin = !userStatus[userId]["admin"]
        this.userAdminAssignment(admin, userId)
        userStatus[userId]["admin"] = admin
        this.setState({ userId, admin: !admin })
        updateState({ userStatus: userStatus })
    }

    closeSnackBar = (item) => {
        this.setState(item)
    }


    getTableRows() {
        const { userData, userStatus } = this.props.data
        console.log(userData, userStatus)
        return userData.map(user => {
            console.log(user)
            return (
                <TableRow key={user.userId}>
                    <TableCell align="right">{user.firstName + " " + user.lastName}</TableCell>
                    <TableCell align="right">{user.emailId}</TableCell>
                    <TableCell align="right">
                        <Checkbox
                            checked={userStatus[user.userId]["admin"]}
                            onChange={(e) => this.handleChange(user.userId)}
                        // value={}
                        />
                    </TableCell>
                    <TableCell align="right">
                        <Checkbox
                            disabled
                            checked={userStatus[user.userId]["verified"]}
                            onChange={(e) => this.handleChange(user.userId)}
                        // value={}
                        />
                    </TableCell>
                </TableRow>
            )
        })
    }
    render() {
        const { classes } = this.props.data
        return (
            <Paper>
                <ComponentHeading data={{ classes: classes, text: "Users List", styleColor:"#2a2a2fbd" }} />
                {(this.state.snackBarOpen) ? (<PopUpMessages data={this.state.popupdata} />) : null}
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">Name</TableCell>
                            <TableCell align="right">Email Id</TableCell>
                            <TableCell align="right">Administrator</TableCell>
                            <TableCell align="right">Verified User</TableCell>
                            {/* <TableCell align="right">Upload</TableCell> */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.getTableRows()}
                    </TableBody>
                </Table>
            </Paper>
        )
    }
}
