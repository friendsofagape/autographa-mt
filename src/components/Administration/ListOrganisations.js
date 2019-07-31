import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import { Checkbox, Paper } from '@material-ui/core';
import ComponentHeading from '../ComponentHeading';
import { withStyles } from '@material-ui/styles';
import apiUrl from '../GlobalUrl';
import PopUpMessages from '../PopUpMessages';
import { connect } from 'react-redux';
import { displaySnackBar } from '../../store/actions/sourceActions';

const styles = theme => ({
    root: {
        display: 'flex',
        flexGrow: 1,
    },
});

const accessToken = localStorage.getItem('accessToken')

class ListOrganisations extends Component {
    state = {
        organisationId: '',
        admin: '',
        snackBarOpen: false,
        popupdata: {},
    }

    async getOrganisations(){
        const {updateState, organisationsStatus} = this.props.data

        const data = await fetch(apiUrl + '/v1/autographamt/organisations', {
            method:'GET',
            headers: {
                Authorization: 'bearer ' + accessToken
            }
        })
        const organisationsData = await data.json()
        console.log(organisationsData, organisationsStatus)
        organisationsData.map(item => {
            organisationsStatus[item.organisationId] = {
                "verified":item.verified
            }
        })
        updateState({
            organisationsStatus:organisationsStatus, 
            organisationsData: organisationsData, 
            listOrganisationsPane:true, 
            listUsersPane: false,
            createProjectsPane:false,
            listProjectsPane: false,
            assignmentsPane: false,
            listUserProjectsPane: false,
        })
    }

    async verifyOrganisation(verified, organisationId){
        try{
            const apiData = {
                organisationId: organisationId,
                verified: verified
            }
            console.log(organisationId)
            console.log(apiUrl + 'v1/autographamt/approvals/organisations')
            const data = await fetch(apiUrl + 'v1/autographamt/approvals/organisations', {
                method: 'POST',
                body: JSON.stringify(apiData),
                headers: {
                    Authorization: 'bearer ' + accessToken
                }
            })
            const response = await data.json()
            if(response.success){
                this.getOrganisations()
                this.props.displaySnackBar({
                    snackBarMessage: response.message,
                    snackBarOpen: true,
                    snackBarVariant: "success"
                })
                // this.setState({ snackBarOpen: true, popupdata: { variant: "success", message: response.message, snackBarOpen: true, closeSnackBar: this.closeSnackBar } })
            }else{
                this.props.displaySnackBar({
                    snackBarMessage: response.message,
                    snackBarOpen: true,
                    snackBarVariant: "error"
                })
                // this.setState({ snackBarOpen: true, popupdata: { variant: "error", message: response.message, snackBarOpen: true, closeSnackBar: this.closeSnackBar } })
            }
        }
        catch(ex){
            this.props.displaySnackBar({
                snackBarMessage: "Server error",
                snackBarOpen: true,
                snackBarVariant: "error"
            })
            // this.setState({ snackBarOpen: true, popupdata: { variant: "error", message: "Server Error", snackBarOpen: true, closeSnackBar: this.closeSnackBar } })
        }
    }

    closeSnackBar = (item) => {
        this.setState(item)
    }

    handleChange = (organisationId) => {
        const { organisationsStatus, updateState } = this.props.data
        const verified = !organisationsStatus[organisationId]["verified"]
        this.verifyOrganisation(verified, organisationId)
        organisationsStatus[organisationId]["verified"] = verified
        this.setState({ organisationId })
        updateState({ organisationsStatus: organisationsStatus })
    }

    getTableRows() {
        const { organisationsData, organisationsStatus } = this.props.data
        return organisationsData.map(org => {
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
                        />
                    </TableCell>
                </TableRow>
            )
        })
    }
    render() {
        const {  classes } = this.props.data
        console.log(this.state)
        return (
            <Paper>
            <ComponentHeading data={{classes:classes, text:"Organisations List", styleColor:"#2a2a2fbd"}} />
            <PopUpMessages />
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">Name</TableCell>
                            <TableCell align="right">Address</TableCell>
                            <TableCell align="right">Email Id</TableCell>
                            <TableCell align="right">Phone</TableCell>
                            <TableCell align="right">User Id</TableCell>
                            <TableCell align="right">Verified</TableCell>
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

const mapDispatchToProps = (dispatch) => {
    return {
        displaySnackBar: (popUp) => dispatch(displaySnackBar(popUp))
    }
}

export default connect(null, mapDispatchToProps)(withStyles(styles)(ListOrganisations))