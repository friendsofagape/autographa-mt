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
    const currUrl = window.location.href
    return (
        <Grid container style={{position: 'fixed', width: '100%', zIndex: 1201, backgroundColor: 'black' }}  >
           { 
           currUrl.split('/').pop() =='' ? (
               <Grid item xs={3} style={{padding: '10px'}}>
                      <span style={{fontSize: '25px', color:"white", fontWeight:'bold'}}>AutographaMT</span>  
                </Grid>
                ):(
                <Grid item xs={3} style={{padding: '10px'}}>
                    <Link to="/" className={classes.link}>
                          <span style={{fontSize: '25px', color:"white", fontWeight:'bold'}}>AutographaMT</span>  
                    </Link>
                </Grid>)
            }
            <Grid item xs={9} style={{padding:'10px', textAlign: 'right'}}>
                <SignedInLinks classes={classes} />
            </Grid>

        </Grid>
    )
}
export default withStyles(styles)(Header);