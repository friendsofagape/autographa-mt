import React, { Component } from 'react'
import {
    Grid,
    TextField,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@material-ui/core';
import apiUrl from '../GlobalUrl';
import ComponentHeading from '../ComponentHeading';
import PopUpMessages from '../PopUpMessages';

export default class CreateOrganisations extends Component {
    state = {
        organisationName: '',
        organisationAddress: '',
        organisationEmail: '',
        organisationPhone: '',
        message: '',
        redirect: false,
        verificationDialogOpen: false,
        snackBarOpen: false,
        popupdata: {},
    }

    async createOrganisation(){
        const {organisationName, organisationAddress, organisationEmail, organisationPhone} = this.state
        const apiData = {
            organisationName: organisationName,
            organisationAddress: organisationAddress,
            organisationEmail: organisationEmail,
            organisationPhone: organisationPhone,
        }
        const data = await fetch(apiUrl + '/v1/autographamt/organisations', {
            method:'POST',
            body: JSON.stringify(apiData)
        })
        const myJson = data.json()
        console.log(myJson)
        if(myJson.success){
            this.setState({ snackBarOpen: true, popupdata: { variant: "success", message: myJson.message, snackBarOpen: true, closeSnackBar: this.closeSnackBar } })
        }else{
            this.setState({ snackBarOpen: true, popupdata: { variant: "error", message: myJson.message, snackBarOpen: true, closeSnackBar: this.closeSnackBar } })
        }
    }

    closeSnackBar = (item) => {
        this.setState(item)
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.createOrganisation()
    }

    handleOk = () => {
        this.setState({ redirect: true })
    }

    handleClose = () => {
        this.setState({ verificationDialogOpen: false })
    }

    handleClose = () => {
        const { updateState } = this.props
        console.log(updateState)
        updateState({ createOrganisationsPane: false})
        this.setState({
            organisationName: '',
            organisationAddress: '',
            organisationEmail: '',
            organisationPhone: '',
         })
    }

    handleSend = () => {
        this.createOrganisation()
    }


    closeSnackBar = (item) => {
        this.setState(item)
    }


    render() {
        const { popupdata } = this.state
        const { createOrganisationsPane, classes } = this.props
        return (

            <Dialog
                open={createOrganisationsPane}
                // onClose={this.handleClose}
                aria-labelledby="form-dialog-title"
            >
            <PopUpMessages data={popupdata} />
                <ComponentHeading data={{classes:classes, text:"Create Organisation", styleColor:'#2a2a2fbd'}} />
                <form className={classes.form} onSubmit={this.handleSubmit}>
                <DialogTitle id="form-dialog-title"> </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter details for request to create an Organisation
                    </DialogContentText>
                    <Grid item xs={12}>
                        <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="organisationName"
                                    label="Organisation Name"
                                    name="organisationName"
                                    autoComplete="organisationName"
                                    autoFocus
                                onChange={(e) => this.setState({ organisationName: e.target.value })}
                                />
                        </Grid>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="organisationAddress"
                                    label="Address"
                                    name="organisationAddress"
                                    autoComplete="organisationAddress"
                                    autoFocus
                                onChange={(e) => this.setState({ organisationAddress: e.target.value })}
                                />
                        </Grid>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="organisationEmail"
                                    label="Email"
                                    type="email"
                                    name="organisationEmail"
                                    autoComplete="organisationEmail"
                                    autoFocus
                                onChange={(e) => this.setState({ organisationEmail: e.target.value })}
                                />
                        </Grid>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="organisationPhone"
                                    label="Phone"
                                    name="organisationPhone"
                                    autoComplete="organisationPhone"
                                    autoFocus
                                onChange={(e) => this.setState({ organisationPhone: e.target.value })}
                                />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button size="small" onClick={this.handleClose} variant="raised" color="secondary">
                        Close
                </Button>
                    <Button size="small" onClick={this.handleSend} variant="raised" color="primary">
                    Submit Details
                </Button>
                </DialogActions>
                    </form>
            </Dialog>
        )
    }
}
