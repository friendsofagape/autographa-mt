import React, { Component } from 'react'
import {
    Grid,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    MenuItem,
    FormControl,
    InputLabel,
    Select
} from '@material-ui/core';
import apiUrl from '../GlobalUrl';
import ComponentHeading from '../ComponentHeading';
import PopUpMessages from '../PopUpMessages';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { displaySnackBar } from '../../store/actions/sourceActions'
import VirtualizedSelect from 'react-virtualized-select';
import "react-select/dist/react-select.css";
import "react-virtualized-select/styles.css";
const styles = theme => ({
    root: {
        display: 'flex',
        flexGrow: 1,
    },
    selectMenu: {
        width: '110px',
    },
    // dialog:{
    //     height: 500
    // },
    dialogContent: {
        height: 400,
        // width: '120%'
    },
    virtualSelect: {
        width: '150px'
    }
});


const accessToken = localStorage.getItem('accessToken')

class CreateProjects extends Component {
    state = {
        language: '',
        bibleLanguages: [],
        biblesDetails:[],
        allLanguages:[],
        version: '',
        targetLanguage: '',
        targetLanguageId: '',
        sourceId: '',
        organisationDetails: [],
        organisation: '',
        organisationId: '',
    }

    async getBiblesData() {
        const data = await fetch(apiUrl + 'v1/languages', {
            method: 'GET'
        })
        const bibLang = await fetch(apiUrl + 'v1/bibles/languages', {
            method: 'GET'
        })
        const lang = await fetch(apiUrl + 'v1/bibles', {
            method: 'GET'
        })
        const allLanguages = await data.json()
        const biblesDetails = await lang.json()
        const bibleLanguages = await bibLang.json()
        this.setState({ allLanguages, bibleLanguages, biblesDetails })
    }


    async getOrganisations() {
        console.log('here')
        const org = await fetch(apiUrl + '/v1/autographamt/organisations', {
            method: 'GET',
            headers: {
                Authorization: 'bearer ' + accessToken
            }
        })
        const organisationDetails = await org.json()
        if("success" in organisationDetails){
            if(organisationDetails.success === false){
                this.props.displaySnackBar({
                    snackBarMessage: organisationDetails.message,
                    snackBarOpen: true,
                    snackBarVariant: "error"
                    
                })
            }
        }else{
            this.setState({ organisationDetails })
        }
        // console.log(organisationDetails)
            
    }

    componentDidMount() {
        console.log('here')
        this.getOrganisations()
        this.getBiblesData()
    }

    displayOrganisation = () => {
        const { organisationDetails } = this.state
        console.log("orggg", organisationDetails)
        return organisationDetails.map(org => {
            return (
                <MenuItem key={org.organisationId} value={org.organisationName}>{org.organisationName}</MenuItem>
            )
        })
    }

    onOrganisationSelection = () => {
        const { organisation, organisationDetails } = this.state
        const organisationData = organisationDetails.find(org => org.organisationName === organisation)
        const organisationId = organisationData.organisationId
        this.setState({ organisationId })
    }

    displayLanguage = () => {
        return this.state.bibleLanguages.map(lang => {
            return (
                <MenuItem key={lang.languageId} value={lang.languageName}>{lang.languageName}</MenuItem>
            )
        })
    }

    displayVersions() {
        const { language, biblesDetails } = this.state
        if (!language) {
            return <MenuItem key="" value="" disabled>Loading Versions</MenuItem>
        }
        const versions = biblesDetails.filter((ver) => {
            return ver.language.name === language.toLowerCase()
        })
        return versions.map(item => {
            return <MenuItem key={item.sourceId} value={item.version.longName}>{item.version.longName.toUpperCase()}</MenuItem>
        })
    }

    onVersionSelection = () => {
        const { language, version, biblesDetails } = this.state
        console.log(language, version)
        console.log(biblesDetails)
        const source = biblesDetails.find((ver) => {
            return ver.language.name === language.toLowerCase() && ver.version.longName === version
        })
        this.setState({ sourceId: source.sourceId })
    }

    getTargetLanguage() {
        const { version, allLanguages } = this.state
        if (!version) {
            return <MenuItem disabled>Load Book to get Language data</MenuItem>
        }
        if (!allLanguages) {
            return <MenuItem disabled>Loading</MenuItem>
        } else {
            return allLanguages.map((lang) => {
                return (
                    <MenuItem key={lang.languageId} value={lang.languageName}>{lang.languageName}</MenuItem>
                )
            })
        }
    }

    onTargetLanguageSelection() {
        const { allLanguages, targetLanguage } = this.state
        const languagesData = allLanguages.find(lang => lang.languageName === targetLanguage)
        const targetLanguageId = languagesData.languageId
        this.setState({ targetLanguageId })
    }

    handleClose = () => {
        const { updateState } = this.props.data
        console.log(updateState)
        updateState({ createProjectsPane: false })
        this.setState({ language: '', version: '', targetLanguage: '', sourceId: '' })
    }


    async getProjectsList() {
        const { updateState } = this.props.data
        const data = await fetch(apiUrl + '/v1/autographamt/projects', {
            method: 'GET',
            headers: {
                "Authorization": 'bearer ' + accessToken
            }
        })
        const projectLists = await data.json()
        updateState({ projectLists: projectLists })
    }

    async createProject() {
        const { sourceId, targetLanguageId, organisationId } = this.state
        
        const apiData = {
            sourceId: sourceId,
            targetLanguageId: targetLanguageId,
            organisationId: organisationId
        }
        try {
            const data = await fetch(apiUrl + '/v1/autographamt/organisations/projects', {
                method: 'POST',
                body: JSON.stringify(apiData),
                headers: {
                    Authorization: 'bearer ' + accessToken
                }
            })
            const myJson = await data.json()
            console.log(myJson)
            if (myJson.success) {
                this.props.displaySnackBar({
                    snackBarMessage: myJson.message,
                    snackBarOpen: true,
                    snackBarVariant: "success"
                })
            } else {
                this.props.displaySnackBar({
                    snackBarMessage: myJson.message,
                    snackBarOpen: true,
                    snackBarVariant: "error"
                })
            }
        }
        catch (ex) {
            this.setState({ snackBarOpen: true, popupdata: { variant: "error", message: "Server Error", snackBarOpen: true, closeSnackBar: this.closeSnackBar } })
            this.props.displaySnackBar({
                snackBarMessage: "Server Error",
                snackBarOpen: true,
                snackBarVariant: "error"
                
            })
        }
    }

    handleSend = () => {
        this.createProject()
    }

    closeSnackBar = (item) => {
        this.setState(item)
    }

    render() {
        var languageData = [];
        if (this.state.allLanguages != null) {
			{
				Object.values(this.state.allLanguages).map(lang => {
					languageData.push({
						label: lang.languageName,
						value: lang.languageId,
						code: lang.languageCode,
					});
				});
			}
		}
       
        const { language, version, organisation } = this.state
        const { createProjectsPane } = this.props.data
        const { classes } = this.props
        return (
            <Dialog
                open={createProjectsPane}
                aria-labelledby="form-dialog-title"
                className={classes.dialog}
            >
                <PopUpMessages />
                <ComponentHeading data={{ classes: classes, text: "Create Project", styleColor: '#2a2a2fbd' }} />
                <DialogTitle id="form-dialog-title"> </DialogTitle>
                <DialogContent className={classes.dialogContent}>
                    <DialogContentText>
                        Select the project under the organisation you wish to create, from the below list of options and click Create Project.
                    </DialogContentText>
                    <Grid container item xs={12}>
                        <Grid item xs={2}>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="select-organisation">Organisation</InputLabel>
                                <Select className={classes.selectMenu}
                                    inputProps={{
                                        id: 'select-organisation'
                                    }}
                                    value={organisation}
                                    onChange={(e) => this.setState({
                                        organisation: e.target.value,
                                        language: '',
                                        version: '',
                                        targetLanguage: ''
                                    }, () => this.onOrganisationSelection())
                                    }>
                                    {this.displayOrganisation()}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={2}>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="select-language">Language</InputLabel>
                                <Select className={classes.selectMenu}
                                    inputProps={{
                                        id: 'select-language'
                                    }}
                                    value={language}
                                    onChange={(e) => this.setState({
                                        language: e.target.value,
                                        version: '',
                                        targetLanguage: ''
                                    })
                                    }>
                                    {this.displayLanguage()}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={2}>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="select-version">Version</InputLabel>
                                <Select className={classes.selectMenu}
                                    inputProps={{
                                        id: 'select-version'
                                    }}
                                    value={version}
                                    onChange={(e) => this.setState({
                                        version: e.target.value,
                                        targetLanguage: ''
                                    }, () => this.onVersionSelection())
                                    }>
                                    {this.displayVersions()}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={2}>
                                <InputLabel htmlFor="select-target">Target</InputLabel>
                                <VirtualizedSelect className={classes.virtualSelect}   
                                options={languageData}
                                onChange={(e) => this.setState({ targetLanguage: e.label,
                                    targetLanguageId:e.value})}
                                value={this.state.targetLanguageId} 
                                />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button size="small" onClick={this.handleClose} variant="contained" color="secondary">
                        Close
                </Button>
                    <Button size="small" onClick={this.handleSend} variant="contained" color="primary">
                        Create Project
                </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        accessToken: state.auth.accessToken,
        sourceId: state.sources.sourceId,
        book: state.sources.book,
        targetLanguage: state.sources.targetLanguage,
        targetLanguageId: state.sources.targetLanguageId
    }
}

const mapDispatchToProps = (dispatch) => {
    return{
        displaySnackBar: (popUp) => dispatch(displaySnackBar(popUp))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CreateProjects))