import React, { Component } from 'react'
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { connect } from 'react-redux'
import { displaySnackBar } from '../store/actions/sourceActions'

class PopUpMessages extends Component {

    snackBarHandleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        // this.setState({ snackBarOpen: false }, () => this.props.data.updatePopUpState({popup:false}));
        // this.setState({snackBarOpen:false}, () => this.props.data.closeSnackBar({snackBarOpen: false}))
        this.props.displaySnackBar({
            snackBarOpen: false,
            snackBarMessage: null,
            snackBarVariant: null
        })
    };
    render() {
        const { snackBarVariant, snackBarOpen, snackBarMessage} = this.props
        let snackColor;
        if(snackBarVariant === "success"){
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
                    message={snackBarMessage}
                />
            </Snackbar>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        snackBarOpen: state.sources.snackBarOpen,
        snackBarMessage: state.sources.snackBarMessage,
        snackBarVariant: state.sources.snackBarVariant
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        displaySnackBar: (popUp) => dispatch(displaySnackBar(popUp))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PopUpMessages)