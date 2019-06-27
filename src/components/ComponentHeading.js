import React, { Component } from 'react';
import { Typography } from '@material-ui/core';

export default class ComponentHeading extends Component {
    render() {
        const { classes, text } =  this.props.data
        return (
            <Typography variant="h7" color="inherit" align="center" className={classes.typeG}>
                {text}
            </Typography>
        )
    }
}
