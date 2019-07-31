import React from 'react';
import { AppBar, Typography, Toolbar } from '@material-ui/core';
import SignedInLinks from './SignedInLinks';
import { Link } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        display: 'flex',
    },
    link: {
      margin: theme.spacing(),
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
                <Link color="inherit" variant="body2" href="/">
                    <Typography variant="h5" color="inherit" className={classes.grow}>
                        AutographaMT
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