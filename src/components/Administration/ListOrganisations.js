import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import { Checkbox, Button, Paper } from '@material-ui/core';
import ComponentHeading from '../ComponentHeading';

export default class ListOrganisations extends Component {
    state = {
        organisationId: '',
        admin: ''
    }

    handleChange = (organisationId) => {
        const { organisationsStatus, updateState } = this.props.data
        const verified = organisationsStatus[organisationId]["verified"]
        organisationsStatus[organisationId]["verified"] = !verified
        this.setState({ organisationId })
        updateState({ organisationsStatus: organisationsStatus })
    }

    getTableRows() {
        const { organisationsData, organisationsStatus } = this.props.data
        console.log(organisationsData, organisationsStatus)
        return organisationsData.map(org => {
            console.log(org)
            return (
                <TableRow key={org.organisationId}>
                    <TableCell align="right">{org.organisationName}</TableCell>
                    <TableCell align="right">{org.organisationAddress}</TableCell>
                    <TableCell align="right">{org.organisationEmail}</TableCell>
                    <TableCell align="right">{org.organisationPhone}</TableCell>
                    <TableCell align="right">{org.userId}</TableCell>
                    <TableCell align="right">
                        <Checkbox
                            checked={organisationsStatus[org.organisationId]["verified"]}
                            onChange={(e) => this.handleChange(org.organisationId)}
                        // value={}
                        />
                    </TableCell>
                </TableRow>
            )
        })
    }
    render() {
        const { organisationsData, classes } = this.props.data
        return (
            <Paper>
            <ComponentHeading data={{classes:classes, text:"Organisations List", styleColor:"#2a2a2fbd"}} />
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">Name</TableCell>
                            <TableCell align="right">Address</TableCell>
                            <TableCell align="right">Email Id</TableCell>
                            <TableCell align="right">Phone</TableCell>
                            <TableCell align="right">User Id</TableCell>
                            <TableCell align="right">Verified</TableCell>
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
