import React, { Component } from 'react';
import jwt_decode from 'jwt-decode';
import { Menu, MenuItem } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { setAccessToken } from '../store/actions/authActions';

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
        this.props.setAccessToken({accessToken: null})
        localStorage.removeItem('accessToken')
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
                    <Link to="/" onClick={this.logOut} className={this.props.classes.link}>Log Out</Link>
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
        return (

            <div>
                {(accessToken && decoded.role === 'sa' && tokenAliveFlag) ? (
                    <div>
                        <Link to="/dashboard" className={classes.link}>Dashboard</Link>
                        {/* <Link to="/upload" className={classes.link}>Upload Souce</Link> */}
                        <Link to="/viewsources" className={classes.link}>View Available Sources</Link>
                        <Link to="/download" className={classes.link}>Download Draft</Link>
                        <label color="inherit" style={{ padding: '5px' }}>Welcome, {firstName.charAt(0).toUpperCase() + firstName.slice(1)}</label>
                        <IconButton
                            aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                            aria-haspopup="true"
                            onClick={this.handleMenu}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        {this.getMenuItems()}
                    </div>
                ) : (
                        (accessToken && decoded.role === 'ad' && tokenAliveFlag) ? (
                            <div>
                                <Link to="/dashboard" className={classes.link}>Dashboard</Link>
                                {/* <Link to="/upload" className={classes.link}>Upload Souce</Link> */}
                                <Link to="/viewsources" className={classes.link}>View Available Sources</Link>
                                <Link to="/download" className={classes.link}>Download Draft</Link>
                                {/* <Link to="/" onClick={() => LogOut()} className={classes.link}>Log Out</Link> */}
                                <label color="inherit" style={{ padding: '5px' }}>Welcome, {firstName.charAt(0).toUpperCase() + firstName.slice(1)}</label>
                                <IconButton
                                    aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                                    aria-haspopup="true"
                                    onClick={this.handleMenu}
                                    color="inherit"
                                >
                                    <AccountCircle />
                                </IconButton>
                                {this.getMenuItems()}
                            </div>
                        ) : (
                                (accessToken && decoded.role === 'm' && tokenAliveFlag) ? (
                                    <div>
                                        <Link to="/dashboard" className={classes.link}>Dashboard</Link>
                                        <Link to="/viewsources" className={classes.link}>View Available Sources</Link>
                                        <Link to="/download" className={classes.link}>Download Draft</Link>
                                        {/* <Link to="/" onClick={() => LogOut()} className={classes.link}>Log Out</Link> */}
                                        <label color="inherit" style={{ padding: '5px' }}>Welcome, {firstName.charAt(0).toUpperCase() + firstName.slice(1)}</label>
                                        <IconButton
                                            aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                                            aria-haspopup="true"
                                            onClick={this.handleMenu}
                                            color="inherit"
                                        >
                                            <AccountCircle />
                                        </IconButton>
                                        {this.getMenuItems()}
                                    </div>
                                ) : (
                                        <div>
                                            <Link to="/signin" className={classes.link}>Sign In</Link>
                                            <Link to="/signup" className={classes.link}>Sign Up</Link>
                                        </div>
                                    )
                            )
                    )}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        accessToken: state.auth.accessToken
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setAccessToken: (accessToken) => dispatch(setAccessToken(accessToken))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignedInLinks);