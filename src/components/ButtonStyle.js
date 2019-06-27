import React, { Component } from 'react'
import { Button, Typography } from '@material-ui/core';
import {Redirect, Link} from 'react-router-dom';

export default class ButtonStyle extends Component {
    
    render() {
        const { text, link } = this.props.data
        return (
        <Button color="inherit" style={{ textTransform: "none" }}>
                {/* <Typography variant="subtitle1" color="inherit">{text}</Typography> */}
                <Link to={link} ><Typography variant="subtitle1" color="inherit" >{text}</Typography></Link>
            </Button>
        )
    }
}
