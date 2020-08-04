import React, { Component } from 'react';
import jwt_decode from 'jwt-decode';
import { Menu, MenuItem } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { setAccessToken, clearState } from '../store/actions/authActions';

// let decoded;
// let tokenAliveFlag = false
// var accessToken = localStorage.getItem('accessToken')
// if (accessToken) {
//     decoded = jwt_decode(accessToken)
//     let currentDate = new Date().getTime()
//     let expiry = decoded.exp * 1000
//     var firstName = decoded.firstName
//     var hours = (expiry - currentDate) / 36e5
//     if (hours > 0) {
//         tokenAliveFlag = true
//     } else {
//         console.log("logged out")
//     }
// }


// const SignedInLinks = ({ classes }) => {
class SignedInLinks extends Component {
    state = {
        anchorEl: null
    }

    logOut = () => {
        this.props.dispatch(clearState())
        // this.props.setAccessToken({accessToken: null})
        localStorage.removeItem('accessToken')
        window.location = "/"
    }

    handleMenu = (event) => {
        // setAnchorEl(event.currentTarget)
        this.setState({ anchorEl: event.currentTarget })
    }

    handleClose = () => {
        // setAnchorEl(null)
        this.setState({ anchorEl: null })
    }

    getMenuItems() {
        const { anchorEl } = this.state
        return (
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={this.handleClose}
            >
                <MenuItem>
                    <Link style={{textDecoration:'none', color:'black'}} to="/" onClick={this.logOut} variant="contained" size="small" color="primary" /*className={this.props.classes.link}*/>Log Out</Link>
                </MenuItem>
            </Menu>
        )
    }
    render() {
        const { classes } = this.props
        const { anchorEl } = this.state
        const isMenuOpen = Boolean(anchorEl)
        let tokenAliveFlag = false
        let decoded;
        const { accessToken } = this.props
        if (accessToken) {
            decoded = jwt_decode(accessToken)
            let currentDate = new Date().getTime()
            let expiry = decoded.exp * 1000
            var firstName = decoded.firstName
            var hours = (expiry - currentDate) / 36e5
            if (hours > 0) {
                tokenAliveFlag = true
            } else {
                console.log("logged out")
            }
        }
        console.log('Header', this.props)
        const { current_user } = this.props;
        return (

            <div>
                {
                    current_user.firstName ?  (
                        <div>
                            <label color="inherit" style={{ padding: '5px', color: 'white' }}>Welcome, {current_user.firstName.charAt(0).toUpperCase() + current_user.firstName.slice(1)}</label>
                        <IconButton
                            aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                            aria-haspopup="true"
                            onClick={this.handleMenu}
                            className={classes.link}
                            // color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        {this.getMenuItems()}
                    </div>
                    ) 
                    : (
                    <div style={{paddingTop: '20px', paddingRight: '10px'}}>
                    <Link to="/signin" className={classes.link}>Sign In</Link>
                    <Link to="/signup" className={classes.link}>Sign Up</Link>
                    </div>)
                }
                
            </div>
        )
    }
}

const mapStateToProps = state => ({
    current_user: state.auth.current_user
})

// const mapDispatchToProps = dispatch => {
//     return {
//         setAccessToken: (accessToken) => dispatch(setAccessToken(accessToken))
//     }
// }

const mapDispatchToProps = dispatch => ({
    dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(SignedInLinks);