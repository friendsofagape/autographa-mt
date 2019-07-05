import React, { Component } from 'react';
import { Grid, Paper, Button, Typography } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import ComponentHeading from './ComponentHeading';
import PopUpMessages from './PopUpMessages';
import Chip from '@material-ui/core/Chip';
import apiUrl from './GlobalUrl';
import Container from '@material-ui/core/Container';

export default class UpdateTokens extends Component {
    state = {
        translation: '',
        snackBarOpen: false,
        popupdata: {},
        senses: [],
        sense: ''
    }

    async updateTransaltion() {
        const { sourceId, targetLanguageId, token, book, tokenTranslation } = this.props.data
        const apiData = {
            sourceId: sourceId,
            targetLanguageId: targetLanguageId,
            token: token,
            translation: tokenTranslation,
            senses: this.state.sense
        }
        // console.log('api', apiData)
        try {

            const update = await fetch(apiUrl + '/v1/updatetokentranslations', {
                method: 'POST',
                body: JSON.stringify(apiData)
            })
            const myJson = await update.json()
            if (myJson.success) {
                this.setState({ snackBarOpen: true, popupdata: { variant: "success", message: myJson.message, snackBarOpen: true, closeSnackBar: this.closeSnackBar } })
            } else {
                this.setState({ snackBarOpen: true, popupdata: { variant: "error", message: myJson.message, snackBarOpen: true, closeSnackBar: this.closeSnackBar } })
            }
        }
        catch (ex) {
            this.setState({ snackBarOpen: true, popupdata: { variant: "error", message: "Server Error", snackBarOpen: true, closeSnackBar: this.closeSnackBar } })
        }
    }


    async getTranslatedWords(word) {
        const { sourceId, targetLanguageId, updateState } = this.props.data
        const data = await fetch(apiUrl + '/v1/translations/' + sourceId + '/' + targetLanguageId + '/' + word, {
            method: 'GET'
        })
        const translatedWords = await data.json()
        if (translatedWords.translation) {
            // console.log("******************", translatedWords)
            const { translation, senses } = translatedWords
            updateState({ tokenTranslation: translation, senses: senses })
        } else {
            updateState({ tokenTranslation: '', senses: [] })
        }
    }

    displaySenses() {
        const { tokenTransaltion, senses } = this.props.data
        if (senses) {
            // this.setState({displaySensesPane:'block'})
            return senses.map(item => {
                return (

                    <Chip
                        label={item}
                        component="a"
                        clickable
                    />
                )
            })
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        this.updateTransaltion();
    }

    closeSnackBar = (item) => {
        this.setState(item)
    }

    enterTransaltion = (value) => {
        this.props.data.updateState({ tokenTranslation: value })
    }

    submitSenses = () => {
        const { senses, sense } = this.state
        if (sense) {
            senses.push(sense)
            // this.setState({ senses })
            this.updateTransaltion()
            this.setState({ sense: '' })
            this.getTranslatedWords(this.props.data.token)
        }
    }

    render() {
        const { classes, token, targetLanguage, tokenTranslation, senses, updateState } = this.props.data
        const displayLanguage = ''
        if (targetLanguage) {
            displayLanguage = targetLanguage
        }
        // console.log("sense", senses)
        return (

            <Grid item xs={12} className={classes.containerGrid}>
                <Grid item xs={12}>
                    <ComponentHeading data={{ classes: classes, text: `Enter ${displayLanguage} Translation` }} />
                    {/* <form onSubmit={this.handleSubmit}> */}
                </Grid>
                {(this.state.snackBarOpen) ? (<PopUpMessages data={this.state.popupdata} />) : null}
                <Grid container item xs={12}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            disabled
                            // defaultValue="Select a Token"
                            margin="normal"
                            variant="outlined"
                            label={token}
                            className={classes.inputField}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            label="Enter Translation"
                            // defaultValue="Select a Token"
                            value={tokenTranslation}
                            onChange={(e) => updateState({ tokenTranslation: e.target.value })}
                            margin="normal"
                            variant="outlined"
                            className={classes.inputField}
                        />
                    </Grid>
                </Grid>

                    {/* <Container> */}
                    <Button
                    variant="contained"
                    color="primary"
                    // className={classes.button}
                    style={{ marginLeft:'30%', marginTop:'3%' }}
                    onClick={this.handleSubmit}>Update Token</Button>


                    {/* </Container> */}
                <Grid container item xs={12}>
                    <Grid item xs={12} style={{marginTop:'5%', marginBottom:'5px'}}>
                        <Typography variant="inherit" align="center" style={{ color: 'rgb(145, 148, 151)' }}>
                            Add alternate translations
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            label="Enter Senses"
                            // defaultValue="Select a Token"
                            value={this.state.sense}
                            onChange={(e) => this.setState({ sense: e.target.value })}
                            margin="normal"
                            variant="outlined"
                            className={classes.inputField}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} style={{ marginTop: '7%' }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            // className={classes.button}
                            onClick={this.submitSenses}>Add Senses</Button>
                    </Grid>
                </Grid>

                <Grid item xs={12} style={{ margin: '2%' }}>
                    {/* {if(tokenTransaltion)} */}
                    <Typography variant="inherit" align="left" style={{ color: 'rgb(145, 148, 151)' }}>
                        Synonyms:
                    </Typography>
                </Grid>
                <Grid item xs={12} style={{
                    margin: '2%',
                    // border:'1px solid',
                    // boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
                }}>

                    {this.displaySenses()}
                </Grid>
                {/* </form> */}
                {/* <input type="file" id="input" multiple onchange="handleFiles(this.files)"></input> */}



            </Grid>
        )
    }
}
