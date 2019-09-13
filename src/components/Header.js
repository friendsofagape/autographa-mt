import React from 'react';
import { AppBar, Typography, Toolbar } from '@material-ui/core';
import SignedInLinks from './SignedInLinks';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'

const styles = theme => ({
    root: {
        display: 'flex',
    },
    link: {
      margin: theme.spacing(),
      textDecoration: 'none', 
      color: 'white'
    },
    h1: {
      backgroundColor: 'black',
    },
    grow: {
      flexGrow: 1,
    },
});

function Header({ classes }) {
    return (
        <AppBar position="static" className={classes.h1}>
            <Toolbar>
                {/* <Link color="inherit" variant="body2" href="/"> */}
                <Link to="/dashboard" className={classes.link}>
                    <Typography variant="h5" className={classes.grow}>
                        AutographaMT new
                    </Typography>
                </Link>
            <div className={classes.grow}>
                </div>
                <SignedInLinks classes={classes} />
            </Toolbar>
        </AppBar>
    )
}

export default withStyles(styles)(Header);