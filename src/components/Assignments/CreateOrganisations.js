import React, { Component } from 'react'
import {
    Grid,
    TextField,
    Button,
    Paper,
    Typography
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux'
import Container from '@material-ui/core/Container';
import { createOrganisation } from '../../store/actions/organisationActions';



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

    canBeSubmitted() {
        const { organisationName, organisationAddress,  organisationEmail, organisationPhone } = this.state;
        return organisationName.toString().length > 0 && organisationAddress.toString().length > 0 && organisationEmail.toString().length > 0 && organisationPhone.toString().length > 0;
	}


    render() {
        const { classes } = this.props
        const isEnabled = this.canBeSubmitted();
        return (
            <Grid item xs={12}>
                <Container component="main" maxWidth="xs" className={classes.pageContainer}>
                <Paper elevation='3' style={{padding:'8%'}}>
                    <Typography component="h1" variant="h5" style={{textAlign:"center" ,paddingBottom:"4%"}}>
                        Create Organisation
                </Typography>
                    <form className={classes.form} onSubmit={this.handleLoginSubmit} style={{padding:'3%'}}>
                            <Grid container spacing={0}>
                            <Grid item sm={12}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="organisationName"
                                    label="Organisation Name"
                                    name="organisationName"
                                    autoComplete="organisationName"
                                    size="small"
                                onChange={(e) => this.setState({ organisationName: e.target.value })}
                                />
                                </Grid>
                                <Grid item sm={12}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="organisationAddress"
                                    label="Address"
                                    name="organisationAddress"
                                    autoComplete="organisationAddress"
                                    size="small"
                                onChange={(e) => this.setState({ organisationAddress: e.target.value })}
                                />
                                </Grid>
                                <Grid item sm={12}>
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
                                    size="small"
                                onChange={(e) => this.setState({ organisationEmail: e.target.value })}
                                />
                                </Grid>
                                <Grid item sm={12}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="organisationPhone"
                                    label="Phone"
                                    name="organisationPhone"
                                    autoComplete="organisationPhone"
                                    size="small"
                                onChange={(e) => this.setState({ organisationPhone: e.target.value })}
                                />
                                </Grid>
                        <Grid container style={{ marginTop: "10%" }}>
                            <Grid item sm={8} style={{ margin: '2%' }}></Grid>
                            <Grid item style={{ textAlign: "right", paddingBottom:'5%'}}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                disabled={!isEnabled}
                                onClick={this.handleSubmit}
                            >
                            Create
                            </Button>
                        </Grid>
                        </Grid>
                        </Grid>
                    </form>
                    </Paper>
                </Container>
            </Grid>


            
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    dispatch
})

export default connect(null, mapDispatchToProps)(withStyles(styles)(CreateOrganisations))