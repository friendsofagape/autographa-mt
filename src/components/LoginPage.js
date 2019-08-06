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
    DialogTitle
} from '@material-ui/core';
import Container from '@material-ui/core/Container';
import { Redirect } from 'react-router-dom';
import Header from './Header';
import jwt_decode from 'jwt-decode';
import apiUrl from './GlobalUrl';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import { setAccessToken } from '../store/actions/authActions';


const styles = theme => ({
    loginPage: {
      marginTop: '5%'
    },
    forgot: {
      cursor: 'pointer',
    },
});

class LoginPage extends Component {
    state = {
        message: '',
        email: '',
        password: '',
        forgotPasswordDailogOpen: false,
        verificationCodeDialogOpen: false,
        dialogEmail:'',
        verificationCode:'',
        verifiedSuccess: false,
        newPassword: false
    }

    async authenticate() {
        var formData = new FormData();
        var apiData = {
            email: this.state.email,
            password: this.state.password
        }
        for (var name in apiData) {
            formData.append(name, apiData[name])
        }
        const data = await fetch(apiUrl + 'v1/auth', {
            method: "POST",
            body: formData
        })
        const myJson = await data.json()
        // console.log(myJson.message)
        if ('accessToken' in myJson) {
            await localStorage.setItem('accessToken', myJson.accessToken)
            this.props.setAccessToken({
                accessToken: myJson.accessToken
            })
            this.props.updateRedirect();
        } else {
            alert(myJson.message)
        }
    }

    handleLoginSubmit = (e) => {
        e.preventDefault();
        this.authenticate()
    }

    componentDidMount(){
        let decoded;
        var accessToken = localStorage.getItem('access_token')
        if (accessToken) {
            decoded = jwt_decode(accessToken)
            console.log(decoded)
            let currentDate = new Date().getTime()
            let expiry = decoded.exp * 1000
            console.log(currentDate, expiry)
            var hours = (expiry - currentDate) / 36e5
            if(hours > 0){
                console.log(hours)
                console.log("logged in")
                // this.props.redirect = true;
            }else{
                console.log("logged out")
            }
        }
    }

    handleClose = () => {
        this.setState({forgotPasswordDailogOpen:false, verificationCodeDialogOpen:false, verifiedSuccess:false})
    }

    handleOpen = () => {
        this.setState({forgotPasswordDailogOpen: true})
    }

    async forgotPassword(){
        var formData = new FormData();
        var apiData = {
            email:this.state.dialogEmail
        }
        for (var name in apiData) {
            formData.append(name, apiData[name])
        }
        const data = await fetch(apiUrl + 'v1/resetpassword', {
            method:'POST',
            body: formData
        })
        const myJson = await data.json()
        console.log(myJson)
        if (myJson.success){
            this.setState({message:myJson.message, forgotPasswordDailogOpen:false, verificationCodeDialogOpen:true})
        }else{
            alert(myJson.message)
        }
    }

    handleSend = (e) => {
        e.preventDefault();
        this.forgotPassword();
    }

    async resetPassword(){
        var formData = new FormData();
        var apiData = {
            temporaryPassword: this.state.verificationCode,
            password: this.state.newPassword
        }
        for (var name in apiData) {
            formData.append(name, apiData[name])
        }
        const reset = await fetch(apiUrl + 'v1/forgotpassword', {
            method:'POST',
            body: formData
        });
        const myJson = await reset.json()
        if(myJson.success){
            this.setState({verificationCodeDialogOpen:false, verifiedSuccess:true})
        }
    }

    handleVerificationCode = (e) => {
        e.preventDefault();
        this.resetPassword()
    }

    handleOk = () => {
        this.setState({verifiedSuccess:false})
    }

    render() {
        console.log(this.props);
        const { redirect } = this.props;
        if (redirect) {
            console.log("redirect")
            return <Redirect to='/dashboard' />
        }
        //cons
        const { classes } = this.props
        return (
            <Grid item xs={12}>
            <Header />
            <Container component="main" maxWidth="xs" className={classes.loginPage}>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form className={classes.form} onSubmit={this.handleLoginSubmit}>
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
                        onChange={(e) => this.setState({ email: e.target.value })}
                    />
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
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                    >
                        Sign In
                </Button>
                </form>
                <Grid container style={{ marginTop: "7px" }}>
                    <Grid item xs>
                        <Link variant="body2" onClick={this.handleOpen} className={classes.forgot}>
                            Forgot password?
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link href="/signup" variant="body2">
                            {"Don't have an account? Sign Up"}
                        </Link>
                    </Grid>
                </Grid>
                <Dialog
                    open={this.state.forgotPasswordDailogOpen}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Forgot Password</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter your registered email id. An Email with a verification code
                            will be sent to this email id.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Email Address"
                            type="email"
                            fullWidth
                            onChange={(e) => this.setState({dialogEmail:e.target.value})}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Close
                        </Button>
                        <Button onClick={this.handleSend} color="primary">
                            Send
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={this.state.verificationCodeDialogOpen}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Enter Verification Code</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {this.state.message}
                            <br />
                            Enter the code recieved.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Verification Code"
                            fullWidth
                            onChange={(e) => this.setState({verificationCode:e.target.value})}
                        />
                        <DialogContentText>
                            <br />
                            Enter the your new password.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="newpassword"
                            type="password"
                            label="Enter new password"
                            fullWidth
                            onChange={(e) => this.setState({newPassword:e.target.value})}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleVerificationCode} color="primary">
                            Submit
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={this.state.verifiedSuccess}
                    aria-labelledby="form-dialog-title"
                    onClose={this.handleClose}
                >
                    <DialogTitle id="form-dialog-title">Successful</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <br />
                            Your Password has been changed. Login in with the new password
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

const mapDispatchToProps = (dispatch) => {
    return {
        setAccessToken: (token) => dispatch(setAccessToken(token))
    }
}
export default connect(null, mapDispatchToProps)(withStyles(styles)(LoginPage));