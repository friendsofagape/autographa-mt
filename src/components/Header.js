import React from 'react';
import {Grid } from '@material-ui/core';
import SignedInLinks from './SignedInLinks';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        display: 'flex',
        backgroundColor: 'black',
        color: 'white',
        zIndex: 9
    },
    link: {
        margin: '0',
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
        <Grid container style={{position: 'fixed', width: '100%', zIndex: 1201, backgroundColor: 'black' }}  >
            <Grid item xs={3} style={{padding: '10px'}}>
                <span style={{fontSize: '25px', color:"white", fontWeight:'bold'}}>AutographaMT</span>  
            </Grid>
            <Grid item xs={9} style={{padding:'10px', textAlign: 'right'}}>
                <SignedInLinks classes={classes} />
            </Grid>
        </Grid>
    )
}
export default withStyles(styles)(Header);