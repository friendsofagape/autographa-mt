import React, { Component } from 'react'
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

export default class PopUpMessages extends Component {

    state = {
        snackBarOpen: false,
    }

    snackBarHandleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        // this.setState({ snackBarOpen: false }, () => this.props.data.updatePopUpState({popup:false}));
        this.setState({snackBarOpen:false}, () => this.props.data.closeSnackBar({snackBarOpen: false}))
        
    };
    render() {

        const { variant, snackBarOpen, message} = this.props.data
        let snackColor;
        if(variant === "success"){
            snackColor = '#43a047'
        }else{
            snackColor = '#d32f2f'
        }
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                open={snackBarOpen}
                autoHideDuration={4000}
                onClose={this.snackBarHandleClose}
            >
                <SnackbarContent
                    style={{ backgroundColor: snackColor }}
                    onClose={this.snackBarHandleClose}
                    // variant={variant}
                    message={message}
                />
            </Snackbar>
        )
    }
}
