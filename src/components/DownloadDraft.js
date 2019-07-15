
// import { connect } from 'react-redux';
import React, { Component } from 'react'
import { Button, Grid, FormControl, Select, InputLabel } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import Header from './Header';
import PopUpMessages from './PopUpMessages';
var FileSaver = require('file-saver');


export default class DownloadDraft extends Component {
    state = {
            languageVersionData: {},
            languagesList:[],
            language: '',
            languageDetails:[],
            version: '',
            bookList: '',
            book: '',
            targetLanguage:'',
            targetLanguageId:'',
            sourceId:'',
            open:false,
            checked:false,
            translatedTokenInfo:{},
            versionDetails:[],
            targetBooksChecked: {},
            targetBooks: [],
            varian:'',
            snackBarOpen:false,
            message:''
    }

    async getTranslatedTokenInfo(){
        const data = await fetch('http://localhost:8000/v1/info/translatedtokens', {
            method:'GET'
        })
        const translatedTokenInfo = await data.json()
        this.setState({translatedTokenInfo})
    }

    async getVersionData() {
        const data = await fetch('http://localhost:8000/v1/versiondetails', {
            method: 'GET'
        })
        const versionDetails = await data.json()
        this.setState({ versionDetails })
    }


    async getLanguagesData() {
        // const data = await fetch('http://localhost:8000/v1/languages', {
        //     method: 'GET'
        // })
        const lang = await fetch('http://localhost:8000/v1/languages', {
            method: 'GET'
        })
        const languageDetails = await lang.json()
        // const languages = await lang.json()
        this.setState({ languageDetails })
    }

    componentDidMount(){
        this.getVersionData()
        this.getTranslatedTokenInfo()
        this.getLanguagesData()
    }

    async getTranslatedText(){
        const { sourceId, targetLanguage, targetBooksChecked, targetBooks, version, targetLanguageId } = this.state
        var bookList = []
        targetBooks.map(book => {
            if (targetBooksChecked[book]['checked']){
                bookList.push(book)
            }
        })
        const apiData = {
            sourceId: sourceId,
            targetLanguageId: targetLanguageId,
            bookList: bookList
        }
        console.log(apiData)
        try{
            const data = await fetch('http://localhost:8000/v1/downloaddraft', {
                method:'POST',
                body: JSON.stringify(apiData)
            })
            const myJson = await data.json()
            var blob = new Blob([myJson.translatedUsfmText], {type: "text/plain;charset=utf-8"});
            FileSaver.saveAs(blob, targetLanguage + "_" + version + "_.usfm");
        }
        catch(ex){
            this.setState({variant:"error", message:"server Error", snackBarOpen:true})
        }
    }

    handleClick = e => {
        e.preventDefault();
        this.getTranslatedText()
    }

    selectBooks = () => {
        this.setState({open:true})
    }

    handleClose = () => {
        this.setState({open:false})
    }



    displayLanguage = () => {
        const languages =  Object.keys(this.state.translatedTokenInfo)
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

    displayTargetLanguages(){
        if(!this.state.version){
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
        const version =  this.state.versionDetails.filter((ver) => {
            return ver.languageName === this.state.language && ver.versionContentCode === this.state.version && ver.contentType === 'bible'
        })
        const sourceId = version[0].sourceId
        console.log("targ", targetLanguageId)
        console.log('http://127.0.0.1:8000/v1/translatedbooks/' + sourceId + '/' + targetLanguageId)
        var book = await fetch('http://127.0.0.1:8000/v1/translatedbooks/' + sourceId + '/' + targetLanguageId, {
            method: 'GET'
        })
        this.setState({targetLanguageId})
        const targetBooks = await book.json();
        const targetBooksChecked = this.state.targetBooksChecked
        targetBooks.forEach(item => targetBooksChecked[item] = {checked:false})
        this.setState({targetBooks, targetBooksChecked, sourceId})
    }
    
    onTargetLanguageSelection = () => {
        const { targetLanguage,languageDetails  } = this.state
        console.log("DONE", targetLanguage)
        console.log("langDetails", languageDetails)
        const selectedLanguage = languageDetails.find((item) => {
            return item.languageName === targetLanguage
        })
        console.log("selected", selectedLanguage.languageId)
        const targetLanguageId = selectedLanguage.languageId
        // this.setState({targetLanguageId})
        this.getTargetBooks(targetLanguageId)
        // this.props.data.updateState({targetLanguage: value})
        // this.props.data.updateState({targetLanguageId: selectedLanguage.languageId})
        // ({ languagename: value, languageid: value[0].languageId })
    }

    async setChecked(targetBooksChecked){
        this.setState({targetBooksChecked})
    }

    handleChange = (book) => {
        const targetBooksChecked = this.state.targetBooksChecked
        console.log('book', book)
        console.log("check", targetBooksChecked[book]['checked'])
        // const temp = targetBooksChecked.book
        targetBooksChecked[book]['checked'] = !targetBooksChecked[book]['checked']
        this.setState({targetBooksChecked})
        // this.setChecked(targetBooksChecked)
    }
    getBooksCheckbox(){
        const { targetBooks, targetBooksChecked } = this.state
        // console.log('targ',targetBooks)
        if(targetBooks){
            return targetBooks.map((book, index) => {
                // console.log(index)
                return (
                    <FormControlLabel key={book}
                        control={
                            <Checkbox 
                            checked={targetBooksChecked[book]['checked']}
                            onChange={() => this.handleChange(book)}
                            value={this.state.book.checked}
                            
                            />
                        }
                        label={book}
                        />
                )
            })
        }
    }

    closeSnackBar = (value) => {
        this.setState(value)
    }

    render() {
        // console.log("state",this.state)
        const { classes } = this.props
        return (
            // <Grid container item xs={12}>
                <Grid item xs={12} container>
                <Header classes={classes} />
                <PopUpMessages data={{varian:this.state.variant, snackBarOpen:this.state.snackBarOpen, message:this.state.message, closeSnackBar:this.closeSnackBar }} />
                    <FormControl className={classes.translationSelectionPane}>
                    <InputLabel htmlFor="select-language">Language</InputLabel>
                        <Select className={classes.selectMenu}
                        inputProps={{
                            id:'select-language'
                        }}
                        value={this.state.language}
                        onChange={e => this.setState({language:e.target.value})}
                        >
                        {this.displayLanguage()}
                        </Select>
                    </FormControl>
                    <FormControl className={classes.translationSelectionPane}>
                    <InputLabel htmlFor="select-version">Version</InputLabel>
                        <Select className={classes.selectMenu}
                        inputProps={{
                            id:'select-version'
                        }}
                        value={this.state.version}
                        onChange={e => this.setState({version:e.target.value})}
                        >
                        {this.displayVersions(this.state.language)}
                        </Select>
                    </FormControl>
                    <FormControl className={classes.translationSelectionPane}>
                    <InputLabel htmlFor="select-target">Target</InputLabel>
                        <Select className={classes.selectMenu}
                        inputProps={{
                            id:'select-target'
                        }}
                        value={this.state.targetLanguage}
                        onChange={e => this.setState({targetLanguage:e.target.value}, () => this.onTargetLanguageSelection())}
                        >
                            {this.displayTargetLanguages()}
                        </Select>
                    </FormControl>
                    <Button onClick={this.selectBooks} size="small" variant="contained" color="secondary" className={classes.translationSelectionPane}>Select Books</Button>
                    <Button onClick={this.handleClick} size="small" variant="contained" color="primary" className={classes.translationSelectionPane}>Generate Draft</Button>
                    <Dialog
                        open={this.state.open}
                        onClose={this.handleClose}
                        value={this.state.value}
                    >
                        <DialogContent>
                            {this.getBooksCheckbox()}


                        </DialogContent>
                        <DialogActions>
                            {/* <Button onClick={this.handleClose} variant="raised" color="primary">Close</Button> */}
                            <Button onClick={this.handleClose} variant="contained" color="primary" >OK</Button>
                        </DialogActions>
                    </Dialog>
                    {/* <br /> */}
                </Grid>
        )
    }
}


// const mapStateToProps = (state) => {
//     return {
//         language: state.language
//     }
// }

// const mapDispatchToProps = (dispatch) => {
//     return {
//         setLanguage: () => { dispatch({type:'SET_LANGUAGE'})}
//     }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(DownloadDraft);