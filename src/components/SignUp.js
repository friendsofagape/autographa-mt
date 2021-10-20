import React, { Component } from 'react';
import {
    Grid,
    TextField,
    Button,
    Link,
    Paper,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@material-ui/core';
import Container from '@material-ui/core/Container';
import { Redirect } from 'react-router-dom';
import Header from './Header';
import apiUrl from './GlobalUrl';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    loginPage: {
      marginTop: '120px'
    },
    form: {
      padding: '3% 10%'
    },
});

class SignUp extends Component {
    state = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        message: '',
        redirect: false,
        verificationDialogOpen: false,
    }

    async registerUser() {
        var formData = new FormData();
        var apiData = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            password: this.state.password
        }
        for (var name in apiData) {
            formData.append(name, apiData[name])
        }
        const data = await fetch(apiUrl +  'v1/registrations', {
            method: "POST",
            body: formData
        })
        const myJson = await data.json()

        if (myJson.success) {
            this.setState({ message: myJson.message, verificationDialogOpen: true })
        } else {
            alert(myJson.message)
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.registerUser()
    }

    handleOk = () => {
        this.setState({ redirect: true })
    }

    handleClose = () => {
        this.setState({ verificationDialogOpen: false })
    }

    render() {
        const { redirect } = this.state
        if (redirect) {
            return <Redirect to='/signin' />
        }
        const { classes } = this.props
        return (
            <Grid container>
            <Header />
            <Container component="main" maxWidth="xs" className={classes.loginPage}>
            <Paper elevation={3} >
                <Typography component="h1" variant="h5" style={{textAlign:"center" ,paddingBottom:"4%", paddingTop:"5%"}}>
                    Sign Up
                </Typography>
                <form className={classes.form} onSubmit={this.handleSubmit}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                name="firstName"
                                autoComplete="fname"
                                size="small"
                                onChange={(e) => this.setState({ firstName: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="lname"
                                size="small"
                                onChange={(e) => this.setState({ lastName: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            type="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            size="small"
                            onChange={(e) => this.setState({ email: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="password"
                            label="Password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            size="small"
                            onChange={(e) => this.setState({ password: e.target.value })}
                        />
                    </Grid>                    
                    <Grid container style={{ marginTop: "20%" }}>
                        <Grid item  xs style={{ margin: '2%' }}>
                            <Link href="/signin" variant="body2">
                                {"Sign in instead"}
                            </Link>
                        </Grid>
                        <Grid item style={{ textAlign: "right", paddingBottom:'10%'}}>
                            <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            >
                            Sign Up
                            </Button>
                        </Grid>
                    </Grid>
                </form>
                <Dialog
                    open={this.state.verificationDialogOpen}
                    keepMounted
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">
                        {"Verification Mail Sent"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            An Email with a verification link has been sent to your mail Id. Please
                            click on the link in your email to activate your account
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleOk} color="primary">
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
                </Paper>
            </Container>
            </Grid>
        )
    }
}

export default  withStyles(styles)(SignUp)