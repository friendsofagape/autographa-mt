import React, { Component } from 'react'
import { Grid } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import PopUpMessages from './PopUpMessages';
import apiUrl from './GlobalUrl';
import { connect } from 'react-redux'
import { displaySnackBar, selectProject } from '../store/actions/sourceActions';
import { withStyles } from '@material-ui/core/styles';
import { Card } from '@material-ui/core';
import { CardHeader } from '@material-ui/core';
import { Typography, CardContent } from '@material-ui/core';
import { booksDialog } from '../store/actions/dialogActions';
import BooksDownloadable from './BooksDownloadable';

var accessToken = localStorage.getItem('accessToken')

const styles = theme => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(2)
    },
    cursorPointer: {
      cursor: 'pointer',
    },
});

class DownloadDraft extends Component {
    state = {
        projects: null,
        translatedTokenInfo: [],
        booksDialogOpen: false, 
        selectedProject: {}
    }

    async getTranslatedTokenInfo() {
        try {
            const data = await fetch(apiUrl + 'v1/info/translatedtokens', {
                method: 'GET',
                headers: {
                    Authorization: 'bearer ' + accessToken
                }
            })
            const translatedTokenInfo = await data.json()
            if ('success' in translatedTokenInfo) {
                this.props.displaySnackBar({
                    snackBarMessage: translatedTokenInfo.message,
                    snackBarOpen: true,
                    snackBarVariant: "error"
                })
            } else {

                this.setState({ translatedTokenInfo })
            }
        }
        catch (ex) {
            this.props.displaySnackBar({
                snackBarMessage: "Server Error",
                snackBarOpen: true,
                snackBarVariant: "error"
            })

        }
    }

    async getVersionData() {
        const data = await fetch(apiUrl + 'v1/versiondetails', {
            method: 'GET'
        })
        const versionDetails = await data.json()
        this.setState({ versionDetails })
    }

    async getLanguagesData() {
        const lang = await fetch(apiUrl + 'v1/languages', {
            method: 'GET'
        })
        const languageDetails = await lang.json()
        this.setState({ languageDetails })
    }

    async getProjectData() {
        try {
            const data = await fetch(apiUrl + 'v1/autographamt/users/projects', {
                method: 'GET',
                headers: {
                    Authorization: 'bearer ' + accessToken
                }
            })
            const response = await data.json()
            if ('success' in response) {
                this.props.displaySnackBar({
                    snackBarMessage: response.message,
                    snackBarOpen: true,
                    snackBarVariant: "error"
                })
            } else {
                this.setState({ projects: response })
            }
        }
        catch (ex) {
            this.props.displaySnackBar({
                snackBarMessage: "Server Error",
                snackBarOpen: true,
                snackBarVariant: "error"
            })
        }
    }

    componentDidMount() {
        this.getProjectData()
        this.getTranslatedTokenInfo()
    }

    handleClick = e => {
        e.preventDefault();
        this.getTranslatedText()
    }

    selectBooks = () => {
        this.setState({ open: true })
    }

    handleClose = () => {
        this.setState({ open: false })
    }

    displayLanguage = () => {
        const languages = Object.keys(this.state.translatedTokenInfo)
        return languages.map(lang => {
            return (
                <MenuItem key={lang} value={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</MenuItem>
            )
        })
    }

    displayVersions(language) {
        if (!language) {
            return <MenuItem key="" value="" disabled>Loading Versions</MenuItem>
        }
        const versions = Object.keys(this.state.translatedTokenInfo[this.state.language])
        return versions.map(item => {
            return <MenuItem key={item} value={item}>{item.toUpperCase()}</MenuItem>
        })
    }

    displayTargetLanguages() {
        if (!this.state.version) {
            return <MenuItem key="" value="" disabled>Loading Target</MenuItem>
        }
        const targetLanguages = this.state.translatedTokenInfo[this.state.language][this.state.version]
        return targetLanguages.map(lang => {
            return (
                <MenuItem key="lang" value={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</MenuItem>
            )
        })
    }

    async getTargetBooks(targetLanguageId) {
        const version = this.state.versionDetails.filter((ver) => {
            return ver.languageName === this.state.language && ver.versionContentCode === this.state.version && ver.contentType === 'bible'
        })
        const sourceId = version[0].sourceId
        var book = await fetch(apiUrl + 'v1/translatedbooks/' + sourceId + '/' + targetLanguageId, {
            method: 'GET'
        })
        this.setState({ targetLanguageId })
        const targetBooks = await book.json();
        const targetBooksChecked = this.state.targetBooksChecked
        targetBooks.forEach(item => targetBooksChecked[item] = { checked: false })
        this.setState({ targetBooks, targetBooksChecked, sourceId })
    }

    onTargetLanguageSelection = () => {
        const { targetLanguage, languageDetails } = this.state
        const selectedLanguage = languageDetails.find((item) => {
            return item.languageName === targetLanguage
        })
        const targetLanguageId = selectedLanguage.languageId
        this.getTargetBooks(targetLanguageId)
    }

    async setChecked(targetBooksChecked) {
        this.setState({ targetBooksChecked })
    }

    handleCardClick = (project) => {
        this.props.selectProject({project: project})
        this.props.booksDialog({booksPane: true})
    }

    displayDraftCards(){
        const { projects } = this.state
        const { classes } = this.props
        if(projects){
            return projects.map(project => {
                return (
                    <Grid item xs={12} sm={6} md={3} key={project.projectId} style={{gridRowGap:'2px'}}>
                        <Card onClick={() => this.handleCardClick(project)} className={classes.cursorPointer}>
                            <CardHeader
                                subheader={`Organisation: ${project.organisationName}`} />
                            <CardContent>
                                <Typography varian="h5" gutterBottom>
                                    {project.projectName.split("|")[0]}
                                </Typography>
                                <Typography varian="h5" gutterBottom>
                                    {project.version.name}
                                </Typography>
                                <Typography varian="h5" gutterBottom>
                                    {project.projectName.split("|")[1]}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                )
            })
        }else{
            return <Typography variant="h5">No Project available for download</Typography>
        }
    }

    render() {
        return (
            <Grid item xs={12} container>
                <BooksDownloadable />
                <Grid 
                    container
                    spacing={1}
                    style={{border:'1px solid #eee', padding:'10px', margin: '5px'}}
                    >
                    {this.displayDraftCards()}
                    <PopUpMessages />
                </Grid>
            </Grid>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        displaySnackBar: (popUp) => dispatch(displaySnackBar(popUp)),
        selectProject: (project) => dispatch(selectProject(project)),
        booksDialog: (status) => dispatch(booksDialog(status))
    }
}

export default connect(null, mapDispatchToProps)(withStyles(styles)(DownloadDraft));