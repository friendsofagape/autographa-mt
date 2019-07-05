import React from 'react'
import { Typography } from '@material-ui/core';

export default function ButtonText(props) {
    const { classes, variant, color, text } = props.data
    // console.log("button",props.data)
    return (
        <Typography variant="h5" color="inherit">View</Typography>
    )
}
