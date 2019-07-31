import React, { Component } from 'react';
import { FormControl, Grid, MenuItem, Select, InputLabel, Button } from '@material-ui/core';
import './css/style.css'
import apiUrl from './GlobalUrl'
import { connect } from 'react-redux';
import { createSource } from '../store/actions/sourceActions'
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
    root: {
        display:'flex',
        flexGrow: 1,
      },
      selectMenu: {
        width: '120px',
      },
      selectionGrid: {
        marginLeft: '4%',
        marginTop: '1%'
      }
});

class MenuBar extends Component {
    state = {
            language: '',
            bibleLanguages: [],
            allLanguages:[],
            targetLanguage:'',
            version: '',
            book: '',
            bookList: '',
            sourceId:'',
            biblesDetails:[],
    }

    async getLanguagesData() {
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
        // this.setState({ biblesDetails })
    }

    componentDidMount() {
        // this.getLanguagesData()
        this.getBiblesData()
    }

    displayLanguage = () => {
        return this.state.bibleLanguages.map(lang => {
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
        const { bibleLanguages, language } = this.state
        const languageData = bibleLanguages.find(lang => lang.languageName === language)
        const languageId = languageData.languageId
        // this.getVersionData(languageId)
    }

    displayVersions() {
        const { language, biblesDetails } = this.state
        if (!language) {
            return <MenuItem key="" value="" disabled>Loading Versions</MenuItem>
        }
        const versions = biblesDetails.filter((ver) => {
            return ver.language.name === language.toLowerCase()
        })
        // console.log(versions)
        return versions.map(item => {
            return <MenuItem key={item.sourceId} value={item.version.longName}>{item.version.longName.toUpperCase()}</MenuItem>
        })
    }


    getTargetLanguage(){
        const { book, allLanguages} = this.state
        if(!book){
            return <MenuItem disabled>Load Book to get Language data</MenuItem>
        }
        if(!allLanguages){
            return <MenuItem disabled>Loading</MenuItem>
        }else{
            return allLanguages.map((lang) => {
                return (
                    <MenuItem key={lang.languageId} value={lang.languageName}>{lang.languageName}</MenuItem>
                )
            })
            
        }
    }

    async getBooks() {
        const { language, version, biblesDetails } = this.state
        const source =  biblesDetails.find((ver) => {
            return ver.language.name === language.toLowerCase() && ver.version.longName === version
        })
        const sourceId = source.sourceId
        var book = await fetch(apiUrl +  'v1/bibles/' + sourceId +  '/books' , {
            method: 'GET'
        })
        const myJson = await book.json();
        this.setState({
            bookList: myJson,
            sourceId:sourceId
        })
    }
    
    onVersionSelection = () => {
        // const { version } = this.state
        this.getBooks()
    }


    onBookSelection = () => {
        const { book } = this.state
    }

    getTokens = () => {
        const { language, version, sourceId, book, targetLanguage } = this.state
        const selectedLanguage = this.state.allLanguages.find((item) => {
            return item.languageName === targetLanguage
        })
        this.props.createSource({
            book: book,
            sourceId: sourceId,
            targetLanguage: targetLanguage, 
            targetLanguageId: selectedLanguage.languageId
        })
    }


    getBookItems() {
        if (this.state.bookList) {
            return this.state.bookList[0].books.map(item => {
                return (
                    <MenuItem key={item.bibleBookID} value={item.abbreviation}>{item.abbreviation}</MenuItem>
                )
            })
        } else {
            return (
                <MenuItem key="" value="" disabled>Loading Book</MenuItem>
            )
        }
    }

    render() {
        const { classes } = this.props
        const { language, version, book } =  this.state
        console.log("menu", this.state)
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
                <Grid item xs={2} md={2}>
                    <Button size="small" onClick={this.getTokens} variant="contained" color="primary">Get Tokens</Button>
                </Grid>
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        sourceId: state.sources.sourceId,
        book: state.sources.book,
        targetLanguage: state.sources.targetLanguage,
        targetLanguageId: state.sources.targetLanguageId
    }
}
const mapDispatchToProps = (dispatch) => {
    return{
        createSource: (source) => dispatch(createSource(source))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MenuBar));