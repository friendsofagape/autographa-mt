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
import { displaySnackBar, uploadBibleTexts, setCompletedUpload, setUploadError } from '../store/actions/sourceActions';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import swal from 'sweetalert';
import CircleLoader from './loaders/CircleLoader';
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

    componentDidUpdate(prevProps) {
        if (prevProps.completedUpload !== this.props.completedUpload) {
            const { completedUpload, uploadErrorBooks, dispatch } = this.props;
            if (completedUpload) {
                if (uploadErrorBooks.length > 0) {
                    swal({
                        title: 'Upload Bible',
                        text: `${uploadErrorBooks.length} books failed to upload`,
                        icon: 'warning'
                    }).then(msg => {
                        dispatch(setUploadError([]))
                        this.props.close()
                    })
                } else {
                    swal({
                        title: 'Upload Bible',
                        text: `All books uploaded successfully`,
                        icon: 'success'
                    }).then(msg => {
                        dispatch(setUploadError([]))
                        this.props.close()
                    })
                }
            }
        }

    }

    uploadFiles() {
        const { parsedUsfm, fileContent } = this.state
        const { sourceId, dispatch } = this.props
        // let errorFiles = []
        dispatch(setCompletedUpload(false));
        parsedUsfm.map(async (item, index) => {
            // let bookName = item.metadata.id.book
            var apiData = {
                'sourceId': sourceId,
                'wholeUsfmText': fileContent[index],
                'parsedUsfmText': item
            }
            await dispatch(uploadBibleTexts(apiData, parsedUsfm[0].metadata.id.book))
            // this.uploadVersionDetails(apiData)
        })
        // dispatch(completedUpload(true));
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

        // this.setState({ fileContent, parsedUsfm, disableUpload: false, progress: false })
    };

    async handleFileChosen(file) {

        let fileReader = await new FileReader();
        fileReader.onloadend = (e) => {
            const { fileContent, parsedUsfm, errorFiles } = this.state
            const content = fileReader.result;
            var jsonOutput = grammar.parseUSFM(content)
            if (jsonOutput.ERROR) {
                errorFiles.push(file.name)
                // this.props.displaySnackBar({
                //     snackBarMessage: jsonOutput.ERROR,
                //     snackBarOpen: true,
                //     snackBarVariant: "error"
                // })
                this.setState({ errorFiles })
            } else {
                fileContent.push(content)
                parsedUsfm.push(jsonOutput)
                this.setState({ fileContent, parsedUsfm, progress: false })
            }
            // this.setState({ progress: false})
        }
        // await this.setState({text: "Adding"})
        await fileReader.readAsText(file)
        // await this.setState({ text: "completed"})
    };

    addFiles = e => {
        e.preventDefault();
        const filesObj = e.target.files
        const filesKeys = Object.keys(filesObj)
        this.setState({ fileContent: [], parsedUsfm: [], errorFiles: [], progress: true })
        filesKeys.map(async key => {
            await this.setState({ progress: true })
            await this.handleFileChosen(filesObj[key])
        })

        // this.props.displaySnackBar({
        //     snackBarMessage: "added files",
        //     snackBarOpen: true,
        //     snackBarVariant: "error"
        // })
        // this.setState({ progress: false})
    }
    // componentWillReceiveProps(nextProps) {
    //     const { sourceId } = this.state
    //     const newSourceId = nextProps
    //     if (sourceId !== newSourceId) {
    //         this.setState({
    //             fileContent: [],
    //             parsedUsfm: [],
    //             disableUpload: false
    //         })
    //     }
    // }

    handleSubmit = e => {
        // e.preventDe  fault();
        this.uploadFiles()
    };


    render() {
        const { dialogOpen, close, isFetching } = this.props
        console.log('upload', this.props);
        return (
            <Dialog
                open={dialogOpen}
                // onClose={close}
                aria-labelledby="form-dialog-title"
            >
                <PopUpMessages />
                {
                    isFetching &&
                    <CircleLoader />
                }
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
                                <Button disabled={this.state.progress} variant="contained" color="secondary" component="span" >
                                    <AddIcon /> add files
                                </Button>
                            </label>
                        </Grid>
                        <Grid item xs={3}>
                            <Button disabled={this.state.progress} variant="contained" color="inherit" onClick={this.handleSubmit}>Upload</Button>
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

const mapStateToProps = state => ({
    isFetching: state.sources.isFetching,
    uploadErrorBooks: state.sources.uploadErrorBooks,
    completedUpload: state.sources.completedUpload
})

const mapDispatchToProps = (dispatch) => ({
    dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(UploadTexts))
