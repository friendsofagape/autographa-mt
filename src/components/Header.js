import React, { Fragment } from 'react';
import { AppBar, Typography, Toolbar, Grid } from '@material-ui/core';
import SignedInLinks from './SignedInLinks';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'

const styles = theme => ({
    root: {
        display: 'flex',
        backgroundColor: 'black',
        color: 'white',
        zIndex: 9
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
        
        <Fragment>
            {/* <Grid item xs={12} style={{position: 'fixed', width: '100%'}} className={classes.root}> */}
            <Grid container style={{position: 'fixed', width: '100%'}} className={classes.root} >
            <Grid item xs={3} style={{paddingLeft: '10px'}}>
                <Link to="/" className={classes.link}>
                    <Typography variant="h5" className={classes.grow}>
                        AutographaMT
                    </Typography>
                </Link>
            </Grid>
            <Grid item xs={9} style={{textAlign: 'right'}}>
                <SignedInLinks classes={classes} />
            </Grid>
        </Grid>
        </Fragment>
        // <AppBar className={classes.h1}>
        //     <Toolbar>
        //         {/* <Link color="inherit" variant="body2" href="/"> */}
        //         <Link to="/" className={classes.link}>
        //             <Typography variant="h5" className={classes.grow}>
        //                 AutographaMT
        //             </Typography>
        //         </Link>
        //     <div className={classes.grow}>
        //         </div>
        //         <SignedInLinks classes={classes} />
        //     </Toolbar>
        // </AppBar>
    )
}

export default withStyles(styles)(Header);