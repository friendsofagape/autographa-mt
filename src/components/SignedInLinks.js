import React, { useState } from 'react';
import jwt_decode from 'jwt-decode';
import {  Menu, MenuItem } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom'

let decoded;
let tokenAliveFlag = false
var accessToken = localStorage.getItem('accessToken')
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


const SignedInLinks = ({ classes }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl)

    function LogOut(event) {
        localStorage.removeItem('accessToken')
    }

    function handleMenu(event) {
        setAnchorEl(event.currentTarget)
    }

    function handleClose() {
        setAnchorEl(null)
    }

    function getMenuItems() {
        return (
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem>
                    <Link to="/" onClick={LogOut} className={classes.link}>Log Out</Link>
                </MenuItem>
            </Menu>
        )
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
                        aria-label="Account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>
                    {getMenuItems()}
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
                                aria-label="Account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            {getMenuItems()}
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
                                        aria-label="Account of current user"
                                        aria-controls="menu-appbar"
                                        aria-haspopup="true"
                                        onClick={handleMenu}
                                        color="inherit"
                                    >
                                        <AccountCircle />
                                    </IconButton>
                                    {getMenuItems()}
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

export default SignedInLinks;