import React, { Component } from 'react'
import {
    Grid,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import PopUpMessages from './PopUpMessages';
import ComponentHeading from './ComponentHeading';
import apiUrl from './GlobalUrl'
import { displaySnackBar } from '../store/actions/sourceActions';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
// import { displaySnackBar } from '../store/actions/sourceActions'
var grammar = require('usfm-grammar')


const styles = theme => ({
    progress: {
        margin: theme.spacing(2)
    },
});


class UploadTexts extends Component {
    state = {
        fileContent: [],
        parsedUsfm: [],
        disableUpload: true,
        progress: false,
        text: ""
    }

    async uploadVersionDetails(apiData) {
        try {
            const postVersions = await fetch(apiUrl + 'v1/bibles/upload', {
                method: 'POST',
                body: JSON.stringify(apiData)
            })
            const myJson = await postVersions.json()
            // this.setState({ message: myJson.message })
            // if (myJson.success) {
            //     return true
            // } else {
            //     return false

            // }
            this.props.displaySnackBar({
                snackBarMessage: myJson.message,
                snackBarOpen: true,
                snackBarVariant: (myJson.success) ? "success" : "error"
            })
        }
        catch (ex) {
            // this.setState({ variant: "error", snackBarOpen: true, message: "Upload Process Failed", snackColor: '#d32f2f' })
            this.props.displaySnackBar({
                snackBarMessage: "Upload Process Failed",
                snackBarOpen: true,
                snackBarVariant: "error"
            })
        }
    }

    uploadFiles() {
        const { parsedUsfm, fileContent } = this.state
        const { sourceId } = this.props
        // let errorFiles = []
        parsedUsfm.map((item, index) => {
            // let bookName = item.metadata.id.book
            var apiData = {
                'sourceId': sourceId,
                'wholeUsfmText': fileContent[index],
                'parsedUsfmText': item
            }
            this.uploadVersionDetails(apiData)
        })
        // if (uploadFail) {
        //     this.setState({ variant: "error", snackBarOpen: true, message: this.state.message, snackColor: '#d32f2f' })
        // }
    }

    handleFileRead = (e) => {
        const { fileContent, parsedUsfm } = this.state
        const content = this.fileReader.result;
        var jsonOutput = grammar.parse(content)
        fileContent.push(content)
        parsedUsfm.push(jsonOutput)

        this.setState({ fileContent, parsedUsfm, disableUpload: false })
    };

    async handleFileChosen(file) {

        let fileReader = await new FileReader();
        fileReader.onloadend = (e) => {
            const { fileContent, parsedUsfm, errorFiles } = this.state
            const content = fileReader.result;
            var jsonOutput = grammar.parseUSFM(content)
            if (jsonOutput.ERROR) {
                errorFiles.push(file.name)
                this.props.displaySnackBar({
                    snackBarMessage: jsonOutput.ERROR,
                    snackBarOpen: true,
                    snackBarVariant: "error"
                })
                this.setState({ errorFiles })
            } else {
                fileContent.push(content)
                parsedUsfm.push(jsonOutput)
                this.setState({ fileContent, parsedUsfm })
            }
            this.setState({ progress: false})
        }
        await this.setState({text: "Adding"})
        await fileReader.readAsText(file)
        await this.setState({ text: "completed"})
    };

    addFiles = e => {
        e.preventDefault();
        const filesObj = e.target.files
        const filesKeys = Object.keys(filesObj)
        this.setState({ fileContent: [], parsedUsfm: [], errorFiles: [], progress: true })
        filesKeys.map(key => {
            this.handleFileChosen(filesObj[key])
        })
        this.props.displaySnackBar({
            snackBarMessage: "added files",
            snackBarOpen: true,
            snackBarVariant: "error"
        })
        // this.setState({ progress: false})
    }
    componentWillReceiveProps(nextProps) {
        const { sourceId } = this.state
        const newSourceId = nextProps
        if (sourceId !== newSourceId) {
            this.setState({
                fileContent: [],
                parsedUsfm: [],
                disableUpload: false
            })
        }
    }

    handleSubmit = e => {
        // e.preventDe  fault();
        this.uploadFiles()
    };


    render() {
        const { dialogOpen, close } = this.props
        console.log(this.state.parsedUsfm)
        return (
            <Dialog
                open={dialogOpen}
                // onClose={close}
                aria-labelledby="form-dialog-title"
            >
                <PopUpMessages />
                <ComponentHeading data={{ text: "Upload Sources", styleColor: '#2a2a2fbd' }} />
                <DialogTitle id="form-dialog-title"> </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Select the files to be uploaded and click Upload
                    </DialogContentText>
                    <Grid container spacing={2}>
                        <Grid item xs={2}>

                            <label>
                                {this.state.parsedUsfm.length} {(this.state.parsedUsfm.length > 1) ? 'files' : 'file'}
                            </label>
                        </Grid>
                        <Grid item xs={2}>

                            {(this.state.progress) ? <CircularProgress /> : null}
                            {(this.state.text) ? this.state.text : null}
                        </Grid>
                        <Grid item xs={5}>
                            <input
                                style={{ display: 'none' }}
                                id="raised-button-file"
                                multiple
                                type="file"
                                onChange={this.addFiles}
                            />
                            <label htmlFor="raised-button-file">
                                <Button variant="contained" color="secondary" component="span" >
                                    <AddIcon /> add files
                                </Button>
                            </label>
                        </Grid>
                        <Grid item xs={3}>
                            <Button disabled={this.state.disableUpload} variant="contained" color="inherit" onClick={this.handleSubmit}>Upload</Button>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button size="small" onClick={close} variant="contained" color="secondary">
                        Close
                    </Button>
                    {/* <Button size="small" onClick={this.handleSend} variant="contained" color="primary">
                Submit Details
                </Button> */}
                </DialogActions>
                {/* </form> */}
            </Dialog>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        displaySnackBar: (popUp) => dispatch(displaySnackBar(popUp))
    }
}

export default connect(null, mapDispatchToProps)(withStyles(styles)(UploadTexts))
