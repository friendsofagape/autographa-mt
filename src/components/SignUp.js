import React, { Component } from 'react';
import {
    Grid,
    TextField,
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
import Header from './Header';
import apiUrl from './GlobalUrl';


function Transition(props) {
    return <Slide direction="up" {...props} />;
}


export default class SignUp extends Component {
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
            <Grid item xs={12}>
            <Header classes={classes} />
            <Container component="main" maxWidth="xs" className={classes.loginPage}>
                {/* <Paper className={classes.loginPage}> */}
                {/* <CssBaseline /> */}
                <Typography component="h1" variant="h5">
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
                                autoFocus
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
                                autoFocus
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
                            autoFocus
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
                            autoFocus
                            onChange={(e) => this.setState({ password: e.target.value })}
                        />
                    </Grid>
                    <FormControlLabel
                        control={<Checkbox value="allowExtraEmails" color="primary" />}
                        label="I want to recieve promotional emails"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                    // className={classes.submit}
                    >
                        Sign Up
                        </Button>
                    <Grid container style={{ marginTop: "7px" }}>
                        <Grid container justify="flex-end">
                            <Link href="/signin" variant="body2">
                                {"Already have an account? Sign in"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
                <Dialog
                    open={this.state.verificationDialogOpen}
                    TransitionComponent={Transition}
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
            </Container>
            </Grid>
        )
    }
}
