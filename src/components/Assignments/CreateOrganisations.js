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
    Typography
} from '@material-ui/core';
import apiUrl from '../GlobalUrl';
import ComponentHeading from '../ComponentHeading';
import PopUpMessages from '../PopUpMessages';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux'
import { displaySnackBar } from '../../store/actions/sourceActions';
import Container from '@material-ui/core/Container';
import { createOrganisation } from '../../store/actions/organisationActions';


var accessToken = localStorage.getItem('accessToken')

const styles = theme => ({
    root:{
        display:'flex',
    },
    pageContainer: {
        marginTop: '5%'
    },
});

class CreateOrganisations extends Component {
    state = {
        organisationName: '',
        organisationAddress: '',
        organisationEmail: '',
        organisationPhone: '',
    }

    

    closeSnackBar = (item) => {
        this.setState(item)
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const {organisationName, organisationAddress, organisationEmail, organisationPhone} = this.state
        const apiData = {
            organisationName: organisationName,
            organisationAddress: organisationAddress,
            organisationEmail: organisationEmail,
            organisationPhone: organisationPhone,
        }
        this.props.dispatch(createOrganisation(apiData, this.clearState));
    }

    // handleOk = () => {
    //     this.setState({ redirect: true })
    // }

    handleClose = () => {
        this.setState({ verificationDialogOpen: false })
    }

    clearState = () => {
        this.setState({
            organisationName: '',
            organisationAddress: '',
            organisationEmail: '',
            organisationPhone: '',
         })
    }

    // handleSend = () => {
    //     this.createOrganisation()
    // }


    // closeSnackBar = (item) => {
    //     this.setState(item)
    // }


    render() {
        // const { popupdata } = this.state
        const { createOrganisationsPane, classes } = this.props
        return (
            <Grid item xs={12}>
                {/* <Header /> */}
                {/* <PopUpMessages /> */}
                <Container component="main" maxWidth="xs" className={classes.pageContainer}>
                    <Typography component="h1" variant="h5">
                        Create Organisation
                </Typography>
                    <form className={classes.form} onSubmit={this.handleLoginSubmit}>
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
                        
                        
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={this.handleSubmit}
                        >
                            Create
                        </Button>
                    </form>
                </Container>
            </Grid>


            
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    dispatch
})

export default connect(null, mapDispatchToProps)(withStyles(styles)(CreateOrganisations))