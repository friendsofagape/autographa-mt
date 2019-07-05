import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import { Checkbox, Button, Paper } from '@material-ui/core';
import ComponentHeading from '../ComponentHeading';

export default class ListUsers extends Component {
    state = {
        userId: '',
        admin: ''
    }

    handleChange = (userId) => {
        const { userStatus, updateState } = this.props.data
        const admin = userStatus[userId]["admin"]
        userStatus[userId]["admin"] = !admin
        this.setState({ userId, admin: !admin })
        updateState({ userStatus: userStatus })
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
        const { userData, classes } = this.props.data
        return (
            <Paper>
                <ComponentHeading data={{ classes: classes, text: "Users List", styleColor:"#2a2a2fbd" }} />
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
