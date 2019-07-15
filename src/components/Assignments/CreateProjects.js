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

const accessToken = localStorage.getItem('access_token')

export default class CreateProjects extends Component {
    state = {
        versionDetails: [],
        languageDetails: [],
        language: '',
        version: '',
        targetLanguage: '',
        targetLanguageId:'',
        languageId: '',
        languages: [],
        sourceId:'',
        organisationDetails:[],
        organisation:'',
        organisationId:'',
        snackBarOpen: false,
        popupdata: {},
    }

    async getVersionData(languageId) {
        const data = await fetch(apiUrl + 'v1/versiondetails' + '/1/' + languageId, {
            method: 'GET'
        })
        const versionDetails = await data.json()
        this.setState({ versionDetails })
    }

    async getLanguagesData() {
        const lang = await fetch(apiUrl + 'v1/languages', {
            method: 'GET'
        })
        const data = await fetch(apiUrl + 'v1/languages/1', {
            method: 'GET'
        })
        const languageDetails = await data.json()
        const languages = await lang.json()
        this.setState({ languageDetails, languages })
    }

    async getOrganisations(){
        const org = await fetch(apiUrl + '/v1/autographamt/organisations', {
            method:'GET',
            headers: {
                Authorization: 'bearer ' + accessToken
            }
        })
        const organisationDetails = await org.json()
        if(!organisationDetails.success === false){
            this.setState({organisationDetails})
        }
    }

    componentDidMount() {
        this.getLanguagesData()
        this.getOrganisations()
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
        this.setState({organisationId})
    }

    displayLanguage = () => {
        const { languageDetails } = this.state
        return languageDetails.map(lang => {
            return (
                <MenuItem key={lang.languageId} value={lang.languageName}>{lang.languageName}</MenuItem>
            )
        })
    }

    onLanguageSelection = () => {
        const { languages, language } = this.state
        const languageData = languages.find(lang => lang.languageName === language)
        const languageId = languageData.languageId
        this.getVersionData(languageId)
        this.setState({ languageId })
    }

    displayVersions() {
        const { language, versionDetails } = this.state
        if (!language) {
            return <MenuItem key="" value="" disabled>Loading Versions</MenuItem>
        }
        const versions = versionDetails.filter((ver) => {
            return ver.languageName === language
        })
        return versions.map(item => {
            return <MenuItem key={item.sourceId} value={item.versionContentCode}>{item.versionContentCode.toUpperCase()}</MenuItem>
        })
    }

    onVersionSelection = () => {
        const { language, version, versionDetails } = this.state
        const source =  versionDetails.find((ver) => {
            return ver.languageName === language && ver.versionContentCode === version && ver.contentType === 'bible'
        })
        this.setState({sourceId:source.sourceId})
    }
    
    displayTargetLanguage = () => {
        return this.state.languages.map(lang => {
            return (
                <MenuItem key={lang.languageId} value={lang.languageName}>{lang.languageName}</MenuItem>
            )
        })
    }

    onTargetLanguageSelection(){
        const { languages, targetLanguage } = this.state
        const languageData = languages.find(lang => lang.languageName === targetLanguage)
        const targetLanguageId = languageData.languageId
        this.setState({ targetLanguageId })
    }

    handleClose = () => {
        const { updateState } = this.props.data
        console.log(updateState)
        updateState({ createProjectsPane: false})
        this.setState({language:'', version:'', targetLanguage:'', sourceId:'' })
    }

    
    async getProjectsList(){
        const { updateState } = this.props.data
        const data = await fetch(apiUrl + '/v1/autographamt/projects', {
            method:'GET',
            headers: {
                "Authorization": 'bearer ' + accessToken
            }
        })
        const projectLists = await data.json()
        // this.setState({projectLists})
        updateState({projectLists: projectLists})
    }

    async createProject(){
        const { sourceId, targetLanguageId } = this.state
        const apiData = {
            sourceId: sourceId,
            targetLanguageId: targetLanguageId
        }
        try{
            const data = await fetch(apiUrl + '/v1/autographamt/organisations/projects', {
                method:'POST',
                body: JSON.stringify(apiData),
                headers: {
                    Authorization: 'bearer ' + accessToken
                }
            })
            const myJson = await data.json()
            console.log(myJson)
            if(myJson.success){
                this.setState({ organisation:'', snackBarOpen: true, popupdata: { variant: "success", message: myJson.message, snackBarOpen: true, closeSnackBar: this.closeSnackBar } })
                this.getProjectsList()
                // this.props.data.updateState({listProjectsPane:true,})
            }else{
                this.setState({ snackBarOpen: true, popupdata: { variant: "error", message: myJson.message, snackBarOpen: true, closeSnackBar: this.closeSnackBar } })
            }
        }
        catch(ex){
            this.setState({ snackBarOpen: true, popupdata: { variant: "error", message: "Server Error", snackBarOpen: true, closeSnackBar: this.closeSnackBar } })
        }
        // this.handleClose()
    }

    handleSend = () => {
        this.createProject()
    }


    closeSnackBar = (item) => {
        this.setState(item)
    }


    render() {
        const { language, version, organisation, popupdata } = this.state
        const { createProjectsPane, classes } = this.props.data
        return (

            <Dialog
                open={createProjectsPane}
                // onClose={this.handleClose}
                aria-labelledby="form-dialog-title"
            >
            <PopUpMessages data={popupdata} />
                <ComponentHeading data={{classes:classes, text:"Create Project", styleColor:'#2a2a2fbd'}} />
                <DialogTitle id="form-dialog-title"> </DialogTitle>
                <DialogContent>
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
                                        language:'',
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
                                    }, () => this.onLanguageSelection())
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
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="select-target">Target</InputLabel>
                                <Select className={classes.selectMenu}
                                    inputProps={{
                                        id: 'select-target'
                                    }}
                                    value={this.state.targetLanguage}
                                    onChange={(e) => this.setState({
                                        targetLanguage: e.target.value
                                    }, () => this.onTargetLanguageSelection())
                                    }>
                                    {this.displayTargetLanguage()}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} variant="raised" color="secondary">
                        Close
                </Button>
                    <Button onClick={this.handleSend} variant="raised" color="primary">
                        Create Project
                </Button>
                </DialogActions>
            </Dialog>
        )
    }
}
