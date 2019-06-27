import React from 'react';
import { AppBar, Typography, Toolbar } from '@material-ui/core';
import SignedInLinks from './SignedInLinks';
import { Link } from '@material-ui/core';

function Header({ classes }) {
    return (
        <AppBar position="static" className={classes.h1}>
            <Toolbar>
                <Link color="inherit" variant="body2" href="/homepage">
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

export default Header;