import React, { Component } from 'react';
import { Grid, Button, Typography } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import ComponentHeading from '../../ComponentHeading';
import PopUpMessages from '../../PopUpMessages';
import Chip from '@material-ui/core/Chip';
import apiUrl from '../../GlobalUrl';
// import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { displaySnackBar } from '../../../store/actions/sourceActions';

const accessToken = localStorage.getItem('accessToken')


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
          border: '1px solid "#2a2a2fbd"',
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
        const { project, token } = this.props
        const { translation, sense } = this.state
        const apiData = {
            projectId: project.projectId,
            token: token,
            translation: translation,
            senses: sense
        }
        console.log(apiData)
        try {
            const update = await fetch(apiUrl + 'v1/autographamt/projects/translations', {
                method: 'POST',
                body: JSON.stringify(apiData),
                headers: {
                    Authorization: 'bearer ' + accessToken
                }
            })
            const myJson = await update.json()
            if (myJson.success) {
                this.setState({
                    translation: ''
                }, () => this.getTranslatedWords())
                this.props.displaySnackBar({
                    snackBarMessage: myJson.message,
                    snackBarOpen: true,
                    snackBarVariant: (myJson.success) ? "success" : "error"
                })
            } else {
                this.props.displaySnackBar({
                    snackBarMessage: myJson.message,
                    snackBarOpen: true,
                    snackBarVariant: (myJson.success) ? "success" : "error"
                })
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

    componentWillReceiveProps(nextProps) {
        const { token, project } = nextProps
        if (token) {
            this.setState({ token, targetLanguageId: project.targetId, sourceId: project.sourceId })
            this.getTranslatedWords(token, project.sourceId, project.targetId)
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
        const { classes, token, project } =  this.props

        const { translation } = this.state
        var displayLanguage = ''
        if (project) {
            displayLanguage = project.projectName.split('|')[0].split('-')[2]
        }
        return (
            <Grid item xs={12} className={classes.containerGrid}>
                <Grid item xs={12}>
                    <ComponentHeading data={{ classes: classes, text: `Enter ${displayLanguage} Translation`, styleColor: "#2a2a2fbd" }} />
                </Grid>
                <PopUpMessages />
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
        project: state.sources.project
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        displaySnackBar: (popUp) => dispatch(displaySnackBar(popUp))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(UpdateTokens))