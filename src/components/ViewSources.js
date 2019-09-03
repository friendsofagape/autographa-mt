import React, { Component } from 'react'
import jwt_decode from 'jwt-decode';
import {
    Grid,
    Paper,
    Button,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    Divider,
    Link,
    Typography,

} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Header from './Header';
import UploadTexts from './UploadTexts';
import apiUrl from './GlobalUrl';
import { withStyles } from '@material-ui/core/styles';
import ComponentHeading from './ComponentHeading';
import { uploadDialog } from '../store/actions/dialogActions';
import { connect } from 'react-redux'
import CreateSources from './CreateSources';
import { displaySnackBar } from '../store/actions/sourceActions';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    versionDisplay: {
        width: '98%',
        marginLeft: '1%',
        marginTop: '1%'
    },
    typeG: {
        backgroundColor: '#3e51b5',
        color: 'white',
        padding: '10px 0px'
    },
    cursorPointer: {
        margin: 10,
        cursor: 'pointer',
    },
});

class ViewSources extends Component {
    state = {
        biblesDetails: [],
        dialogOpen: false,
        sourceId: '',
        decoded: {},
        accessToken: '',
        availableBooksData: [],
        listBooks: false,
    }

    closeDialog = () => {
        this.setState({ dialogOpen: false })
    }

    async getBiblesData() {
        const data = await fetch(apiUrl + 'v1/bibles', {
            method: 'GET'
        })
        const biblesDetails = await data.json()
        this.setState({ biblesDetails })
    }

    componentDidMount() {
        this.getBiblesData()
        var accessToken = localStorage.getItem('accessToken')
        if (accessToken) {
            this.setState({ decoded: jwt_decode(accessToken), accessToken })
        }
    }

    async getBooks(){
        try{
            const { sourceId } = this.state
            const data = await fetch(apiUrl + 'v1/sources/books/' + sourceId, {
                method:'GET'
            })
            const response = await data.json()
            this.setState({ 
                listBooks:true, 
                availableBooksData: response,
            })
            this.props.displaySnackBar({
                snackBarMessage: "Books Fetched",
                snackBarOpen: true,
                snackBarVariant: "success"
            })
        }
        catch(ex){
            this.props.displaySnackBar({
                snackBarMessage: "Server Error",
                snackBarOpen: true,
                snackBarVariant: "error"
            })

        }
    }

    displayBooks = () => {
        const { availableBooksData } = this.state
        // const allBooks = Object.keys(availableBooksData)
        return availableBooksData.map(book => {
            return (
                <Grid item xs={2} key={book}>
                    <Typography>{book}</Typography>
                </Grid>
            )
        })
    }


    closeBookListing = () => {
        this.setState({userId: '', projectId:'', listBooks:false})
    }

    handleSelect = (sourceId) => (e) => {
        console.log(sourceId)
        this.setState({ dialogOpen: true, sourceId })
    }

    handleBookSelect = (sourceId) => (e) => {
        console.log(sourceId)
        this.setState({ listBooks: true, sourceId }, () => this.getBooks())
    }
    render() {
        const { classes } = this.props
        console.log(this.state)
        return (
            <Grid item xs={12} md={12} container>
                <Header />
                {
                    (this.state.decoded && this.state.decoded.role !== 'm') ? (
                        <Grid container justify="flex-end">
                            <Link className={classes.cursorPointer} variant="body2" onClick={() => this.props.uploadDialog({ uploadPane: true })}>
                                {"Can't find source from the listed? Create new."}
                            </Link>
                        </Grid>
                    ) : null
                }
                <CreateSources />
                {/* <Link onClick={this.createSourceDialog}>Can't find source from the listed? Create new.</Link> */}
                <Paper >
                    <ComponentHeading data={{ text: "View Sources", styleColor: '#2a2a2fbd' }} />
                    <Divider />
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="right">Version Name</TableCell>
                                <TableCell align="right">Version Code</TableCell>
                                <TableCell align="right">Version Long Name</TableCell>
                                <TableCell align="right">Updated Date</TableCell>
                                <TableCell align="right">Script</TableCell>
                                <TableCell align="right">Language Name</TableCell>
                                <TableCell align="right">Language Code</TableCell>
                                {
                                    (this.state.decoded && this.state.decoded.role !== 'm') ? (
                                        <TableCell align="right">Books</TableCell>
                                    ) : null
                                }
                                {
                                    (this.state.decoded && this.state.decoded.role !== 'm') ? (
                                        <TableCell align="right">Action</TableCell>
                                    ) : null
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.biblesDetails.map(items => (
                                items["languageVersions"].map(row => (
                                    <TableRow key={row.sourceId}>
                                        <TableCell align="right">{row.version.name}</TableCell>
                                        <TableCell align="right">{row.version.code}</TableCell>
                                        <TableCell align="right">{row.version.longName}</TableCell>
                                        <TableCell align="right">{row.updatedDate}</TableCell>
                                        <TableCell align="right">{row.script}</TableCell>
                                        <TableCell align="right">{row.language.name}</TableCell>
                                        <TableCell align="right">{row.language.code}</TableCell>
                                        {
                                            (this.state.decoded && this.state.decoded.role !== 'm') ? (
                                                
                                                    <TableCell align="right">
                                                        <Button size="small" variant="contained" color="primary" onClick={this.handleBookSelect(row.sourceId)}>Books</Button>
                                                    </TableCell>
                                            ) : null
                                        }
                                        {
                                            (this.state.decoded && this.state.decoded.role !== 'm') ? (
                                                    <TableCell align="right">
                                                        <Button size="small" variant="contained" color="primary" onClick={this.handleSelect(row.sourceId)}>Upload</Button>
                                                    </TableCell>
                                            ) : null
                                        }
                                    </TableRow>

                                ))
                            ))}
                        </TableBody>
                    </Table>
                <Dialog
                        open={this.state.listBooks}
                    >
                        <DialogContent>
                            <Grid container item>
                                {this.displayBooks()}
                            </Grid>


                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.closeBookListing} variant="contained" color="secondary">Close</Button>
                        </DialogActions>
                    </Dialog>
                    <UploadTexts sourceId={this.state.sourceId} dialogOpen={this.state.dialogOpen} close={this.closeDialog} />
                </Paper>
            </Grid>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        uploadDialog: (status) => dispatch(uploadDialog(status)),
        displaySnackBar: (popUp) => dispatch(displaySnackBar(popUp))
    }
}

export default connect(null, mapDispatchToProps)(withStyles(styles)(ViewSources));