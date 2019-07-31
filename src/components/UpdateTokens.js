import React, { Component } from 'react';
import { Grid, Button, Typography } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import ComponentHeading from './ComponentHeading';
import PopUpMessages from './PopUpMessages';
import Chip from '@material-ui/core/Chip';
import apiUrl from './GlobalUrl';
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
    root: {
        display:'flex',
        flexGrow: 1,
      },
      inputField: {
        width: '90%',
        marginLeft: '10px'
      },
      containerGrid: {
        width: '97%',
        marginLeft: '2%',
        marginRight: '2%',
        border: '1px solid #3e51b5',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
        height: '100%',
        backgroundColor: '#fff',
      },
});

 class UpdateTokens extends Component {
    state = {
        translation: '',
        snackBarOpen: false,
        popupdata: {},
        senses: [],
        sense: '',
        token: ''
    }

    async updateTransaltion() {
        const { sourceId, targetLanguageId, token } = this.props
        const { translation, sense } = this.state
        const apiData = {
            sourceId: sourceId,
            targetLanguageId: targetLanguageId,
            token: token,
            translation: translation,
            senses: sense
        }
        try {
            const update = await fetch(apiUrl + 'v1/updatetokentranslations', {
                method: 'POST',
                body: JSON.stringify(apiData)
            })
            const myJson = await update.json()
            if (myJson.success) {
                this.setState({
                    translation: '',
                    snackBarOpen: true,
                    popupdata: {
                        variant: "success",
                        message: myJson.message,
                        snackBarOpen: true,
                        closeSnackBar: this.closeSnackBar
                    }
                }, () => this.getTranslatedWords())
            } else {
                this.setState({ snackBarOpen: true, popupdata: { variant: "error", message: myJson.message, snackBarOpen: true, closeSnackBar: this.closeSnackBar } })
            }
        }
        catch (ex) {
            this.setState({ snackBarOpen: true, popupdata: { variant: "error", message: "Server error", snackBarOpen: true, closeSnackBar: this.closeSnackBar } })
        }
    }

    componentWillReceiveProps(nextProps) {
        const { token, targetLanguageId, sourceId } = nextProps
        if (token) {
            this.setState({ token, targetLanguageId, sourceId })
            this.getTranslatedWords(token, sourceId, targetLanguageId)
        }

    }

    async getTranslatedWords(token = this.state.token, sourceId = this.state.sourceId, targetLanguageId = this.state.targetLanguageId) {
        if (token) {
            const data = await fetch(apiUrl + '/v1/translations/' + sourceId + '/' + targetLanguageId + '/' + token, {
                method: 'GET'
            })
            const translatedWords = await data.json()
            if (translatedWords.translation) {
                const { translation, senses } = translatedWords
                this.setState({ translation: translation, senses: senses })
            } else {
                this.setState({ translation: '', senses: [] })
            }
        }
    }

    displaySenses() {
        const { senses } = this.state
        if (senses) {
            return senses.map(item => {
                return (
                    <Chip
                        key={item}
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

    submitSenses = () => {
        const { senses, sense } = this.state
        if (sense) {
            senses.push(sense)
            this.updateTransaltion()
            this.setState({ sense: '' })
            this.getTranslatedWords()
        }
    }

    render() {
        const { classes, token, targetLanguage } =  this.props
        const { translation } = this.state
        var displayLanguage = ''
        if (targetLanguage) {
            displayLanguage = targetLanguage
        }
        return (
            <Grid item xs={12} className={classes.containerGrid}>
                <Grid item xs={12}>
                    <ComponentHeading data={{ classes: classes, text: `Enter ${displayLanguage} Translation` }} />
                </Grid>
                {(this.state.snackBarOpen) ? (<PopUpMessages data={this.state.popupdata} />) : null}
                <Grid container item xs={12}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            disabled
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
                            value={translation}
                            onChange={(e) => this.setState({ translation: e.target.value })}
                            margin="normal"
                            variant="outlined"
                            className={classes.inputField}
                        />
                    </Grid>
                </Grid>
                <Button
                    variant="contained"
                    color="primary"
                    style={{ marginLeft: '30%', marginTop: '3%' }}
                    onClick={this.handleSubmit}>Update Token</Button>
                <Grid container item xs={12}>
                    <Grid item xs={12} style={{ marginTop: '5%', marginBottom: '5px' }}>
                        <Typography variant="inherit" align="center" style={{ color: 'rgb(145, 148, 151)' }}>
                            Add alternate translations
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            label="Enter Senses"
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
                            onClick={this.submitSenses}>Add Senses</Button>
                    </Grid>
                </Grid>
                <Grid item xs={12} style={{ margin: '2%' }}>
                    <Typography variant="inherit" align="left" style={{ color: 'rgb(145, 148, 151)' }}>
                        Synonyms:
                    </Typography>
                </Grid>
                <Grid item xs={12} style={{
                    margin: '2%',
                }}>
                    {this.displaySenses()}
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.sources.token,
        targetLanguageId: state.sources.targetLanguageId,
        sourceId: state.sources.sourceId,
        targetLanguage: state.sources.targetLanguage
    }
}

export default connect(mapStateToProps)(withStyles(styles)(UpdateTokens))