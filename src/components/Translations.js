import React, { Component } from 'react'
import { Grid, Paper } from '@material-ui/core';

export default class Translations extends Component {


    render() {
        // var fileReader
        const { classes } = this.props.data
        return (
            <Grid container item xs={12}>
                <Grid item xs={3}>
                    <Paper className={classes.paper}>
                        xs-3
                    </Paper>
                </Grid>
                <Grid item xs={3}>
                    <Paper className={classes.paper}>
                        xs-3
                    </Paper>
                </Grid>
                <Grid item xs={3}>
                    <Paper className={classes.paper}>
                        Update Tokens
                        
                    </Paper>
                </Grid>
                <Grid item xs={3}>
                    <Paper className={classes.paper}>
                        xs-3
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}
