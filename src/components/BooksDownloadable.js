import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { booksDialog } from '../store/actions/dialogActions';
import { displaySnackBar, selectProject } from '../store/actions/sourceActions';
import ComponentHeading from './ComponentHeading';
import apiUrl from './GlobalUrl';
import PopUpMessages from './PopUpMessages';
import { getTranslatedText } from '../store/actions/projectActions';
import CircleLoader from './loaders/CircleLoader';
var FileSaver = require('file-saver');

var accessToken = localStorage.getItem('accessToken')

const styles = theme => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(2)
    },
});

class BooksDownloadable extends Component {
    state = {
        value: true,
        targetBooks: [],
        targetBooksChecked: {}
    }


    // componentWillReceiveProps(nextProps){
    //     const { project } = nextProps
    //     // const { project } =  this.props
    //     if(project){
    //         let targetBooks = project.books
    //         let targetBooksChecked = {}
    //         targetBooks.map(book => targetBooksChecked[book] = {"checked": false})
    //         this.setState({ targetBooks, targetBooksChecked})
    //     }
    // }

    // componentDidUpdate(prevProps) {
    //     const { selectedProject } = this.props;
    //     if(prevProps.selectedProject !== selectedProject){

    //     }
    // }

    // async getTranslatedText(projectId, bookList) {
    // const { selectedProject } =  this.props
    // const { targetBooksChecked, targetBooks } = this.state
    // var bookList = []
    // targetBooks.map(book => {
    //     if (targetBooksChecked[book]['checked']) {
    //         bookList.push(book)
    //     }
    // })
    //     const apiData = {
    //         projectId,
    //         bookList
    //     }
    //     try {
    //         const data = await fetch(apiUrl + 'v1/downloaddraft', {
    //             method: 'POST',
    //             body: JSON.stringify(apiData),
    //             headers: {
    //                 Authorization: 'bearer ' + accessToken
    //             }
    //         })
    //         const myJson = await data.json()
    //         if("translatedUsfmText" in myJson){
    //             const usfmTexts = myJson.translatedUsfmText
    //             Object.keys(usfmTexts).map(book => {
    //                 let blob = new Blob([usfmTexts[book]], { type: "text/plain;charset=utf-8" });
    //                 FileSaver.saveAs(blob, book + "_" + project.projectName.split("|")[0] + "_.usfm");
    //             })
    //         }
    //     }
    //     catch (ex) {
    //         this.props.displaySnackBar({
    //             snackBarMessage: "server Error",
    //             snackBarOpen: true,
    //             snackBarVariant: "error"
    //         })
    //         // this.setState({ variant: "error", message: "server Error", snackBarOpen: true })
    //     }
    // }


    handleChange = (book) => {
        var { targetBooks } = this.state
        // const temp = targetBooksChecked.book
        const isChecked = targetBooks.includes(book);
        if (isChecked) {
            targetBooks = targetBooks.filter(item => item !== book)
        } else {
            targetBooks.push(book)
        }
        // targetBooksChecked[book]['checked'] = !targetBooksChecked[book]['checked']
        this.setState({ targetBooks })
    }

    getBooksCheckbox = () => {
        const { targetBooks, targetBooksChecked } = this.state
        const { project } = this.props
        if (project.books) {
            return project.books.map((book, index) => {
                return (
                    <FormControlLabel key={book}
                        control={
                            <Checkbox
                                checked={targetBooks.includes(book)}
                                onChange={() => this.handleChange(book)}
                                value={targetBooks.includes(book)}
                            />
                        }
                        label={book}
                    />
                )
            })
        }
    }
    handleDownload = () => {
        const { project, dispatch } = this.props;
        const { targetBooks } = this.state;
        if (project.projectId) {
            dispatch(getTranslatedText(project.projectId, targetBooks, project.projectName))
        }
    }

    handleClose = () => {
        const { updateState } = this.props;
        this.setState({
            targetBooks: [],
            targetBooksChecked: {}
        })
        updateState({booksPane: false})
    }

    render() {
        const { updateState, booksPane, classes, project, isFetching } = this.props
        return (
            <Dialog
                open={booksPane}
                onClose={this.handleClose}
            // value={this.state.value}
            >
                {/* <PopUpMessages /> */}
                {
                    isFetching &&
                    <CircleLoader />
                }
                <ComponentHeading data={{ classes: classes, text: "Select Books to Download", styleColor: '#2a2a2fbd' }} />
                {/* <DialogTitle id="form-dialog-title">Select Books to Download</DialogTitle> */}
                <DialogContent>
                    {this.getBooksCheckbox()}

                </DialogContent>
                <DialogActions>
                    {/* <Button onClick={this.handleClose} variant="raised" color="primary">Close</Button> */}
                    <Button onClick={this.handleClose} size="small" variant="contained" color="secondary" >Close</Button>
                    <Button onClick={this.handleDownload} variant="contained" color="primary" >Download</Button>
                </DialogActions>
            </Dialog>
        )
    }
}


const mapStateToProps = (state) => ({
    selectedProject: state.project.selectedProject
})


const mapDispatchToProps = (dispatch) => ({
    dispatch
})


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(BooksDownloadable));