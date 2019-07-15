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
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import AddIcon from '@material-ui/icons/Add';
import Container from '@material-ui/core/Container';
import Header from './Header';
import ComponentHeading from './ComponentHeading';
import apiUrl from './GlobalUrl';
import { withStyles } from '@material-ui/core/styles';
var grammar = require('usfm-grammar');


const styles = theme => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing.unit * 2
    },
    cursorPointer: {
      cursor: 'pointer',
    },
    uploadPane:{
      marginTop:'4%'
    },
    textField: {
        // width: 100,
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
        contentDetails: [],
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
        snackBarOpen: false,
        variant: false,
        message: '',
        snackColor: '',
        loading: false,
        display: 'none',
        counter: 0,
        // message:[]
    }


    async getVersionData() {
        const data = await fetch('http://localhost:8000/v1/versiondetails', {
            method: 'GET'
        })
        const versionDetails = await data.json()
        this.setState({ versionDetails })
    }

    async getLanguagesData() {
        const data = await fetch('http://localhost:8000/v1/languages', {
            method: 'GET'
        })
        const languageDetails = await data.json()
        this.setState({ languageDetails })
    }

    async getcontentTypesData() {
        const data = await fetch('http://localhost:8000/v1/contentdetails', {
            method: 'GET'
        })
        const contentDetails = await data.json()
        this.setState({ contentDetails })
    }

    componentDidMount() {
        this.getVersionData()
        this.getLanguagesData()
        this.getcontentTypesData()
    }

    displayLanguage = () => {
        return this.state.languageDetails.map(lang => {
            return (
                <MenuItem key={lang.languageId} value={lang.languageName}>{lang.languageName}</MenuItem>
            )
        })
    }

    displaycontentType = () => {
        return this.state.contentDetails.map(cont => {
            return (
                <MenuItem key={cont.contentId} myVal={"Hello"} value={cont.contentType}>{cont.contentType}</MenuItem>
            )
        })
    }

    setLanguage = e => {
        const value = this.state.languageDetails.filter((item) => {
            return item.languageName === e.target.value
        })
        this.setState({ languageName: e.target.value, languageCode: value[0].languageCode, languageid: value[0].languageId })
        // c
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
            const postVersions = await fetch(apiUrl + 'v1/uploadsources', {
                method: 'POST',
                body: JSON.stringify(apiData)
            })
            const myJson = await postVersions.json()
            this.setState({ message: myJson.message })
            if (myJson.success) {
                return true
            } else {
                return false

            }
        }
        catch (ex) {
            this.setState({ variant: "error", snackBarOpen: true, message: "Upload Process Failed", snackColor: '#d32f2f' })
        }
    }

    submitVersionDetails() {
        const { parsedUsfm, fileContent } = this.state

        // let errorFiles = []
        let uploadFail = []
        let message = []
        parsedUsfm.map((item, index) => {
            console.log(item)
            let bookName = item.metadata.id.book
            var apiData = {
                'languageCode': this.state.languageCode,
                'contentType': this.state.contentType,
                'versionContentCode': this.state.versionContentCode,
                'versionContentDescription': this.state.versionContentDescription,
                'year': this.state.year,
                'revision': this.state.revision,
                'license': this.state.license,
                'wholeUsfmText': fileContent[index],
                'parsedUsfmText': item
            }
            let result = this.uploadVersionDetails(apiData)
            console.log("APIIIIIIIII", result)
            if (!result) {
                // this.setState({ variant: "success", snackBarOpen: true, message: result.message, snackColor: '#43a047' })
                uploadFail.push(bookName)
                message.push(result.message)
            }
            // console.log(result)
        })
        if (uploadFail) {
            this.setState({ variant: "error", snackBarOpen: true, message: this.state.message, snackColor: '#d32f2f' })
        }
    }
    // else{
    //     this.setState({ variant: "error", snackBarOpen: true, message: "File Error", snackColor: '#d32f2f' })
    // }
    // })
    // }


    handleFileRead = (e) => {
        const { fileContent, parsedUsfm } = this.state
        const content = this.fileReader.result;
        var jsonOutput = grammar.parse(content)
        fileContent.push(content)
        parsedUsfm.push(jsonOutput)

        this.setState({ fileContent, parsedUsfm })
    };

    async handleFileChosen(file) {

        let fileReader = await new FileReader();
        fileReader.onloadend = (e) => {
            const { fileContent, parsedUsfm, errorFiles } = this.state
            const content = fileReader.result;
            var jsonOutput = grammar.parse(content)
            console.log('nice')
            if (jsonOutput.ERROR) {
                console.log('here')
                errorFiles.push(file.name)
                this.setState({ errorFiles })
            } else {
                console.log('fin')
                fileContent.push(content)
                parsedUsfm.push(jsonOutput)
                this.setState({ fileContent, parsedUsfm })
            }
        }
        console.log('Inside')
        fileReader.readAsText(file)
    };

    uploadFile = e => {
        e.preventDefault();
        const filesObj = e.target.files
        const filesKeys = Object.keys(filesObj)
        this.setState({ fileContent: [], parsedUsfm: [], errorFiles: [] })
        filesKeys.map(key => {
            console.log('I shall')
            this.handleFileChosen(filesObj[key])
        })
    }

    handleSubmit = e => {
        // e.preventDe  fault();
        this.submitVersionDetails()
    };

    snackBarHandleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ snackBarOpen: false });
    };


    render() {
        console.log(this.state)
        // const { fileContent, parsedUsfm } = this.state
        const { classes } = this.props
        // var jsonOutput = grammar.parse(this.state.fileContent)
        // console.log(jsonOutput)
        return (
            // <div>
            <Grid item xs={12}>
                {/* <Grid item xs={12}> */}
                <Header classes={classes} />
                {/* </Grid> */}
                {/* <Grid item xs={12}> */}
                <Container component="main" maxWidth="xs" className={classes.uploadPane}>
                    <ComponentHeading data={{ classes, text: "Enter details" }} />
                    <Paper className={classes.paper}>
                        {/* <Typography variant="h5" color="primary" align="center" >
                                Enter details
                        </Typography> */}

                        {/* <Divider /> */}
                        <Snackbar
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            open={this.state.snackBarOpen}
                            autoHideDuration={4000}
                            onClose={this.snackBarHandleClose}
                        >
                            <SnackbarContent
                                style={{ backgroundColor: this.state.snackColor }}
                                onClose={this.snackBarHandleClose}
                                variant={this.state.variant}
                                message={this.state.message}
                            />
                        </Snackbar>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <TextField
                                    onChange={(e) => this.setState({ versionContentDescription: e.target.value })}
                                    id="version-content-description"
                                    label="Version Content Description"
                                    className={classes.textField}
                                    margin="normal"
                                    variant="outlined"
                                    style={{height:'40px'}}
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
                        {/* </Grid> */}
                        {/* <Grid container item xs={12}> */}
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
                        {/* </Grid> */}
                        {/* <Grid container item xs={12}> */}
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
                            <Grid item xs={6}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="select-content">Content Type</InputLabel>
                                    <Select
                                        value={this.state.contentType}
                                        variant="outlined"
                                        onChange={this.setContent}
                                        inputProps={{
                                            name: 'content',
                                            id: 'select-content',
                                        }}
                                    >
                                        {this.displaycontentType()}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <br />
                        </Grid>
                        <Divider />

                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <input
                                    style={{ display: 'none' }}
                                    id="raised-button-file"
                                    multiple
                                    type="file"
                                    onChange={this.uploadFile}
                                />
                                <label htmlFor="raised-button-file">
                                    <Button variant="contained" color="secondary" component="span" >
                                        <AddIcon /> add files
                                    </Button>
                                </label>

                            </Grid>
                            <Grid item xs={6}>
                                <Button variant="contained" color="inherit" onClick={this.handleSubmit}>Upload</Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Container>
            </Grid>
        )
    }
}

export default  withStyles(styles)(UploadSource);