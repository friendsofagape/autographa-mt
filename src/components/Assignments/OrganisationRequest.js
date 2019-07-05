import React, { Component } from 'react';
import {
    Grid,
    TextField,
    Paper,
    Button,
    FormControlLabel,
    Checkbox,
    Link,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Slide
} from '@material-ui/core';
import Container from '@material-ui/core/Container';
import { Redirect } from 'react-router-dom';
import Header from '../Header';
import ComponentHeading from '../ComponentHeading';
import apiUrl from '../GlobalUrl';
import PopUpMessages from '../PopUpMessages';

export default class OrganisationRequest extends Component {
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

    render() {
        const { classes } = this.props
        return (
            <Grid item xs={12}>
                <Header classes={classes} />
                <Container component="main" maxWidth="xs" className={classes.loginPage}>
                <ComponentHeading data={{ classes: classes, text: "Request to Create Organisation" }} />
                <Paper className={classes.paper}>
                {(this.state.snackBarOpen) ? (<PopUpMessages data={this.state.popupdata} />) : null}
                    <form className={classes.form} onSubmit={this.handleSubmit}>
                        <Grid container spacing={8}>
                            <Grid item xs={12} sm={6}>
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
                            <Grid item xs={12} sm={6}>
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
                            {/* </Grid> */}
                            <Grid item xs={12} sm={6}>
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
                            <Grid item xs={12} sm={6}>
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
                        <Grid item xs={12} direction="column" alignItems="center">
                        <Grid container spacing={1} direction="column" alignItems="center">
                        <Button
                            type="submit"
                            // fullWidth
                            variant="contained"
                            color="primary"
                            
                        // className={classes.submit}
                        >
                            Submit Details
                        </Button>
                        </Grid>
                        </Grid>
                    </form>
                </Paper>
                </Container>
            </Grid>
        )
    }
}
