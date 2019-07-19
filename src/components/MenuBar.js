import React, { Component } from 'react';
import { FormControl, Grid, MenuItem, Select, InputLabel, Button } from '@material-ui/core';
import './css/style.css'
import apiUrl from './GlobalUrl'

class MenuBar extends Component {
    state = {
            language: '',
            languages: [],
            languageDetails:[],
            targetLanguage:'',
            version: '',
            versionDetails:[],
            book: '',
            bookList: '',
            sourceId:''
    }

    async getLanguagesData() {
        const data = await fetch(apiUrl + 'v1/languages', {
            method: 'GET'
        })
        const lang = await fetch(apiUrl + 'v1/languages/1', {
            method: 'GET'
        })
        const languageDetails = await data.json()
        const languages = await lang.json()
        this.setState({ languageDetails, languages })
    }

    componentDidMount() {
        this.getLanguagesData()
    }

    displayLanguage = () => {
        return this.state.languages.map(lang => {
            return (
                <MenuItem key={lang.languageId} value={lang.languageName}>{lang.languageName}</MenuItem>
            )
        })
    }

    async getVersionData(languageId) {
        const data = await fetch(apiUrl + 'v1/versiondetails' + '/1/' + languageId, {
            method: 'GET'
        })
        const versionDetails = await data.json()
        this.setState({ versionDetails })
    }

    onLanguageSelection = () => {
        const { languages, language } = this.state
        const languageData = languages.find(lang => lang.languageName === language)
        const languageId = languageData.languageId
        this.getVersionData(languageId)
        // this.setState({language: language})
        // this.props.data.updateState({language:language})
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


    getTargetLanguage(){
        const { book, languageDetails} = this.state
        if(!book){
            return <MenuItem disabled>Load Book to get Language data</MenuItem>
        }
        if(!languageDetails){
            return <MenuItem disabled>Loading</MenuItem>
        }else{
            return languageDetails.map((lang) => {
                return (
                    <MenuItem key={lang.languageId} value={lang.languageName}>{lang.languageName}</MenuItem>
                )
            })
            
        }
    }

    async getBooks() {
        const { language, version, versionDetails } = this.state
        const source =  versionDetails.find((ver) => {
            return ver.languageName === language && ver.versionContentCode === version && ver.contentType === 'bible'
        })
        const sourceId = source.sourceId
        var book = await fetch(apiUrl +  'v1/sources/books/' + sourceId, {
            method: 'GET'
        })
        const myJson = await book.json();
        this.setState({
            bookList: myJson,
            sourceId:sourceId
        })
        // this.props.data.updateState({version: version, sourceId:sourceId})

    }
    
    onVersionSelection = () => {
        // const { version } = this.state
        this.getBooks()
    }


    onBookSelection = () => {
        const { book } = this.state
        // this.props.data.updateState({book: book})
    }

    getTokens = () => {
        const { language, version, sourceId, book, targetLanguage } = this.state
        const selectedLanguage = this.state.languageDetails.find((item) => {
            return item.languageName === targetLanguage
        })
        this.props.data.updateState({
            book: book,
            sourceId: sourceId,
            targetLanguage: targetLanguage, 
            targetLanguageId: selectedLanguage.languageId
        })
    }


    getBookItems() {
        if (this.state.bookList) {
            return this.state.bookList.map(item => {
                return (
                    <MenuItem key={item} value={item}>{item}</MenuItem>
                )
            })
        } else {
            return (
                <MenuItem key="" value="" disabled>Loading Book</MenuItem>
            )
        }
    }

    render() {
        const { classes } = this.props.data
        const { language, version, book } =  this.state
        return (
            <Grid container item xs={12} className={classes.selectionGrid}>
            <Grid container item xs={8}>
                <Grid item xs={2} md={2}>
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
                                    book: ''
                                }, () => this.onLanguageSelection())
                                }>
                                {this.displayLanguage()}
                            </Select>
                        </FormControl>
                </Grid>
                <Grid item xs={2} md={2}>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="select-version">Version</InputLabel>
                            <Select
                                className={classes.selectMenu}
                                value={version}
                                onChange={(e) => this.setState({
                                    version: e.target.value,
                                    book: ''
                                }, () => { this.onVersionSelection() })}
                                inputProps={{
                                    id: 'select-version',
                                }}
                            >
                                {this.displayVersions()}
                            </Select>
                        </FormControl>
                </Grid>
                <Grid item xs={2} md={2}>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="select-book">Books</InputLabel>
                            <Select
                                className={classes.selectMenu}
                                value={book}
                                onChange={(e) => this.setState({
                                    book: e.target.value
                                }, () => { this.onBookSelection() })}
                                inputProps={{
                                    id: 'select-book',
                                }}
                            >
                                {this.getBookItems()}
                            </Select>
                        </FormControl>
                </Grid>
                <Grid item xs={2} md={2}>
                        <FormControl>
                            <InputLabel htmlFor="select-target-language">Target</InputLabel>
                            <Select
                                className={classes.selectMenu}
                                value={this.state.targetLanguage}
                                onChange={(e) => this.setState({
                                    targetLanguage: e.target.value
                                })}
                                inputProps={{
                                    id: 'select-target-language',
                                }}
                            >
                                {this.getTargetLanguage()}
                            </Select>
                        </FormControl>
                </Grid>
                <Grid xs={2} md={2}>
                    <Button size="small" onClick={this.getTokens} variant="contained" color="primary">Get Tokens</Button>
                </Grid>
                </Grid>
            </Grid>
        )
    }
}



export default MenuBar;