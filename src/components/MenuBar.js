import React, { Component } from 'react';
import { FormControl, Grid, Paper, MenuItem, Select, InputLabel } from '@material-ui/core';
import './css/style.css'
import ComponentHeading from './ComponentHeading';
import apiUrl from './GlobalUrl'
import { Link } from 'react-router-dom'

class MenuBar extends Component {
    state = {
            // languageVersionData: {},
            // languagesList:[],
            language: '',
            version: '',
            bookList: '',
            book: '',
            targetLanguage:'',
            versionDetails:[],
            languageDetails:[],
            languages: [],
            sourceId:''
    }

    async getVersionData(languageId) {
        const data = await fetch(apiUrl + 'v1/versiondetails' + '/1/' + languageId, {
            method: 'GET'
        })
        const versionDetails = await data.json()
        this.setState({ versionDetails })
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
        // this.getVersionData()
        this.getLanguagesData()
    }

    displayLanguage = () => {
        console.log("versionDetails", this.state.versionDetails)
        return this.state.languages.map(lang => {
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
        this.props.data.updateState({language:language})
        // updateState({languageId:languageId})
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
        console.log("lang", language)
        const source =  versionDetails.find((ver) => {
            return ver.languageName === language && ver.versionContentCode === version && ver.contentType === 'bible'
        })
        console.log("source", source)
        const sourceId = source.sourceId
        console.log("sourceId", sourceId)
        var book = await fetch('http://127.0.0.1:8000/v1/books/' + sourceId, {
            method: 'GET'
        })
        const myJson = await book.json();
        this.setState({
            bookList: myJson,
            sourceId:sourceId
        })
        this.props.data.updateState({sourceId:sourceId})

    }
    
    onVersionSelection = () => {
        // console.log('state', this.state.sourceId)
        const { version } = this.state
        this.getBooks()
        this.props.data.updateState({version: version})
    }

    async getTokenList() {
        const { sourceId, book } = this.state
        var bookData = await fetch('http://127.0.0.1:8000/v1/tokenlist/' + sourceId + '/' + book, {
            method: 'GET'
        })
        const tokenList = await bookData.json();
        this.props.data.updateState({tokenList: tokenList})
    }

    onBookSelection = () => {
        const { book } = this.state
        this.getTokenList()
        this.props.data.updateState({book: book})
    }

    onTargetLanguageSelection = (value) => {
        const selectedLanguage = this.state.languageDetails.find((item) => {
            return item.languageName === value
        })
        this.props.data.updateState({targetLanguage: value})
        this.props.data.updateState({targetLanguageId: selectedLanguage.languageId})
        // ({ languagename: value, languageid: value[0].languageId })
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
        const { classes, language, version, book } = this.props.data
        // console.log(this.state)
        return (
            <Grid container item xs={12} className={classes.selectionGrid}>
            <Grid container item xs={8}>
                <Grid item xs={2} md={2}>
                    {/* <ComponentHeading data={{classes:classes, text:"Language"}} /> */}
                    {/* <Paper className={classes.selectButtonPaper}> */}
                        {/* <br /> */}
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
                        <br />
                        <br />
                    {/* </Paper> */}
                </Grid>
                <Grid item xs={2} md={2}>
                    {/* <ComponentHeading data={{classes:classes, text:"Version"}} /> */}
                    {/* <Paper className={classes.selectButtonPaper}> */}
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
                        <br />
                        <br />
                    {/* </Paper> */}
                </Grid>
                <Grid item xs={2} md={2}>
                    {/* <ComponentHeading data={{classes:classes, text:"Books"}} /> */}
                    {/* <Paper className={classes.selectButtonPaper}> */}
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
                        <br />
                        <br />
                    {/* </Paper> */}
                </Grid>
                <Grid item xs={2} md={2}>
                    {/* <ComponentHeading data={{classes:classes, text:"Target"}} /> */}
                    {/* <Paper className={classes.selectButtonPaper}> */}
                        <FormControl>
                            <InputLabel htmlFor="select-target-language">Target</InputLabel>
                            <Select
                                className={classes.selectMenu}
                                value={this.state.targetLanguage}
                                onChange={(e) => this.setState({
                                    targetLanguage: e.target.value
                                }, () => { this.onTargetLanguageSelection(e.target.value) })}
                                inputProps={{
                                    id: 'select-target-language',
                                }}
                            >
                                {this.getTargetLanguage()}
                            </Select>
                        </FormControl>
                        <br />
                    {/* </Paper> */}
                        <br />
                </Grid>
                </Grid>
            </Grid>
        )
    }
}



export default MenuBar;