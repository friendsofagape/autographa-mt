import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { Button} from '@material-ui/core';
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


    componentWillReceiveProps(nextProps){
        const { project } = nextProps
        // const { project } =  this.props
        if(project){
            let targetBooks = project.books
            let targetBooksChecked = {}
            targetBooks.map(book => targetBooksChecked[book] = {"checked": false})
            this.setState({ targetBooks, targetBooksChecked})
        }
    }

    async getTranslatedText() {
        const { project } =  this.props
        const { targetBooksChecked, targetBooks } = this.state
        var bookList = []
        targetBooks.map(book => {
            if (targetBooksChecked[book]['checked']) {
                bookList.push(book)
            }
        })
        const apiData = {
            projectId: project.projectId,
            bookList: bookList
        }
        try {
            const data = await fetch(apiUrl + 'v1/downloaddraft', {
                method: 'POST',
                body: JSON.stringify(apiData),
                headers: {
                    Authorization: 'bearer ' + accessToken
                }
            })
            const myJson = await data.json()
            if("translatedUsfmText" in myJson){
                const usfmTexts = myJson.translatedUsfmText
                Object.keys(usfmTexts).map(book => {
                    let blob = new Blob([usfmTexts[book]], { type: "text/plain;charset=utf-8" });
                    FileSaver.saveAs(blob, book + "_" + project.projectName.split("|")[0] + "_.usfm");
                })
            }
        }
        catch (ex) {
            this.props.displaySnackBar({
                snackBarMessage: "server Error",
                snackBarOpen: true,
                snackBarVariant: "error"
            })
            // this.setState({ variant: "error", message: "server Error", snackBarOpen: true })
        }
    }


    handleChange = (book) => {
        const {targetBooksChecked} = this.state
        // const temp = targetBooksChecked.book
        targetBooksChecked[book]['checked'] = !targetBooksChecked[book]['checked']
        this.setState({ targetBooksChecked })
    }

    getBooksCheckbox = () => {
        const { targetBooks, targetBooksChecked } = this.state
        if (targetBooks) {
            return targetBooks.map((book, index) => {
                return (
                    <FormControlLabel key={book}
                        control={
                            <Checkbox
                                checked={targetBooksChecked[book]['checked']}
                                onChange={() => this.handleChange(book)}
                                value={this.state.targetBooksChecked[book].checked}
                            />
                        }
                        label={book}
                    />
                )
            })
        }
    }
    render() {
        const { booksDialog, booksPane, classes } = this.props
        return (
            <Dialog
                    open={booksPane}
                    onClose={() => booksDialog({booksPane: false})}
                    // value={this.state.value}
                >
                    <PopUpMessages />
                <ComponentHeading data={{classes:classes, text:"Select Books to Download", styleColor:'#2a2a2fbd'}} />
                {/* <DialogTitle id="form-dialog-title">Select Books to Download</DialogTitle> */}
                    <DialogContent>
                        {this.getBooksCheckbox()}

                    </DialogContent>
                    <DialogActions>
                        {/* <Button onClick={this.handleClose} variant="raised" color="primary">Close</Button> */}
                        <Button onClick={() => booksDialog({booksPane: false})} size="small" variant="contained" color="secondary" >Close</Button>
                        <Button onClick={() => this.getTranslatedText()} variant="contained" color="primary" >Download</Button>
                    </DialogActions>
                </Dialog>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        booksPane: state.dialog.booksPane,
        project: state.sources.project
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        displaySnackBar: (popUp) => dispatch(displaySnackBar(popUp)),
        selectProject: (project) => dispatch(selectProject(project)),
        booksDialog: (status) => dispatch(booksDialog(status))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(BooksDownloadable));