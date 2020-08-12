import React, { Component } from 'react';
import jwt_decode from 'jwt-decode';
import { Menu, MenuItem, Grid, Popover} from '@material-ui/core';
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
        const open = Boolean(anchorEl);
        const id = open ? 'simple-popover' : undefined;
        return (
            // <Menu
            //     anchorEl={anchorEl}
            //     open={Boolean(anchorEl)}
            //     onClose={this.handleClose}
            // >
            <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={this.handleClose}
            
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
                <MenuItem>
                    <Link style={{"color":"red", "text-decoration": "none"}} to="/" onClick={this.logOut} className={this.props.classes.link}>Log Out</Link>
                </MenuItem>
            {/* // </Menu> */}
            </Popover>
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

            <Grid>
                {
                    current_user.firstName ?  (
                        <div>
                            <label color="inherit" style={{ padding: '5px',paddingRight:'2%', color: '#09b4bd' }}>Welcome, {current_user.firstName.charAt(0).toUpperCase() + current_user.firstName.slice(1)}</label>
                            <IconButton
                                aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                                aria-haspopup="true"
                                onClick={this.handleMenu}
                                size="small"
                                className={classes.link}
                            >
                            <AccountCircle />
                            </IconButton>
                            {this.getMenuItems()}
                        </div>
                    ) 
                    :(  <Grid>
                            <Link to="/signin" className={classes.link}>Sign In</Link>
                            <Link style={{ paddingLeft:'2%', paddingRight:"1%"}} to="/signup" className={classes.link}>Sign Up</Link>
                        </Grid>
                    )
                }
                
            </Grid>
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