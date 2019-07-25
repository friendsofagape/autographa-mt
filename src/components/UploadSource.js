import React, { Component } from 'react';
import {
    Grid,
    Paper,
    TextField,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Button,
    Divider,

} from '@material-ui/core';
// import Snackbar from '@material-ui/core/Snackbar';
// import SnackbarContent from '@material-ui/core/SnackbarContent';
import Container from '@material-ui/core/Container';
import Header from './Header';
import ComponentHeading from './ComponentHeading';
import apiUrl from './GlobalUrl';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { displaySnackBar } from '../store/actions/sourceActions'
import PopUpMessages from './PopUpMessages';


const styles = theme => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(2)
    },
    cursorPointer: {
        cursor: 'pointer',
    },
    uploadPane: {
        marginTop: '4%'
    },
    textField: {
        height: 10
    }
});



class UploadSource extends Component {
    constructor(props) {
        super(props)
        var fileReader;
        this.fileReader = fileReader

    }
    state = {
        versionDetails: [],
        languageDetails: [],
        // contentDetails: [],
        versionContentCode: 'irv',
        versionContentDescription: 'Indian Revised Version',
        contentType: '',
        year: '2019',
        license: 'CC BY SA',
        revision: '3.0',
        languageid: '2302',
        contentid: '',
        languageName: 'hindi',
        fileContent: [],
        parsedUsfm: [],
        languageCode: 'hin',
        loading: false,
        display: 'none',
        counter: 0,
        // message:[]
    }


    async getVersionData() {
        const data = await fetch(apiUrl + 'v1/bibles', {
            method: 'GET'
        })
        const versionDetails = await data.json()
        this.setState({ versionDetails })
    }

    async getLanguagesData() {
        const data = await fetch(apiUrl + 'v1/languages', {
            method: 'GET'
        })
        const languageDetails = await data.json()
        this.setState({ languageDetails })
    }

    componentDidMount() {
        this.getVersionData()
        this.getLanguagesData()
        // this.getcontentTypesData()
    }

    displayLanguage = () => {
        return this.state.languageDetails.map(lang => {
            return (
                <MenuItem key={lang.languageId} value={lang.languageName}>{lang.languageName}</MenuItem>
            )
        })
    }

    setLanguage = e => {
        const value = this.state.languageDetails.filter((item) => {
            return item.languageName === e.target.value
        })
        this.setState({ languageName: e.target.value, languageCode: value[0].languageCode, languageid: value[0].languageId })
    }

    setContent = e => {
        const value = this.state.contentDetails.filter((item) => {
            return item.contentType === e.target.value
        })
        console.log(value[0]);
        this.setState({ contentid: value[0].contentId, contentType: e.target.value });
    }




    async uploadVersionDetails(apiData) {
        try {
            const postVersions = await fetch(apiUrl + 'v1/sources/bibles', {
                method: 'POST',
                body: JSON.stringify(apiData)
            })
            const myJson = await postVersions.json()
            // this.setState({ message: myJson.message })
            
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


    handleSubmit = e => {
        var apiData = {
            'languageCode': this.state.languageCode,
            'contentType': this.state.contentType,
            'versionContentCode': this.state.versionContentCode,
            'versionContentDescription': this.state.versionContentDescription,
            'year': this.state.year,
            'revision': this.state.revision,
            'license': this.state.license,
        }
        this.uploadVersionDetails(apiData)
        // console.log("APIIIIIIIII", result)
    }

    render() {
        console.log(this.state)
        const { classes } = this.props
        return (
            // <div>
            <Grid item xs={12}>
                <Header />
                <Container component="main" maxWidth="xs" className={classes.uploadPane}>
                    <ComponentHeading data={{ classes, text: "Create Source" }} />
                    <Paper className={classes.paper}>
                        <PopUpMessages />
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <TextField
                                    onChange={(e) => this.setState({ versionContentDescription: e.target.value })}
                                    id="version-content-description"
                                    label="Version Content Description"
                                    className={classes.textField}
                                    margin="normal"
                                    variant="outlined"
                                    style={{ height: '40px' }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    onChange={(e) => this.setState({ versionContentCode: e.target.value })}
                                    id="version-code"
                                    label="Version Content Code"
                                    // className={classes.textField}
                                    margin="normal"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    onChange={(e) => this.setState({ year: e.target.value })}
                                    id="year"
                                    label="Year"
                                    // className={classes.input}
                                    margin="normal"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    onChange={(e) => this.setState({ revision: e.target.value })}
                                    id="revision"
                                    label="Revision"
                                    // className={classes.textField}
                                    margin="normal"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    onChange={(e) => this.setState({ license: e.target.value })}
                                    id="licence"
                                    label="License"
                                    // className={classes.textField}
                                    margin="normal"
                                    variant="outlined"
                                    defaultValue="CC BY SA"
                                />
                            </Grid>
                        </Grid>
                        <Divider />
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="select-language">Language</InputLabel>
                                    <Select
                                        value={this.state.languageName}
                                        variant="outlined"
                                        onChange={this.setLanguage}
                                        inputProps={{
                                            name: 'language',
                                            id: 'select-language'
                                        }}
                                    >
                                        {this.displayLanguage()}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <br />
                        </Grid>
                        <Divider />

                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <Button variant="contained" color="primary" onClick={this.handleSubmit}>Create Source</Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Container>
            </Grid>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        displaySnackBar: (popUp) => dispatch(displaySnackBar(popUp))
    }
}

export default connect(null, mapDispatchToProps)(withStyles(styles)(UploadSource));