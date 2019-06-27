import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import MenuBar from './MenuBar';
import TokenList from './TokenList';
import Concordance from './Concordance';
import TranslationsNotes from './TranslationNotes';
import TranslationsWords from './TranslationWords';
import UpdateTokens from './UpdateTokens';
import { Switch } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import Header from './Header';

export default class HomePage extends Component {
    state = {
        language: '',
        version: '',
        book: '',
        tokenList: '',
        token: '',
        concordance: '',
        targetLanguage: '',
        sourceId: '',
        targetLanguageId: '',
        translationWords: '',
        tNswitchChecked: false,
        tWswitchChecked:false,
        tokenPane: 3,
        translationPane: 4,
        concordancePane: 5,
        displayConcordancePane:'block',
        translationWordsPane: 4,
        displayTranslationWords: 'none',
        translationNotesPane: 3,
        displayTranslationNotes: 'none',
        translationNotes: '',
        displayTranslationWordSwitch: 'none',
        tokenTranslation:'',
        senses:[]
    }

    updateState = (value) => {
        this.setState(value)
    }
    
    handleTNSwitchChange = e => {
        const { tNswitchChecked, tWswitchChecked } = this.state
        if (tNswitchChecked) {
            this.setState({
                tNswitchChecked: !tNswitchChecked,
                tokenPane: 3,
                translationPane: 4,
                concordancePane: 5,
                displayTranslationNotes: 'none',
                displayTranslationWordSwitch: 'none',
                displayTranslationWords:'none',
                displayConcordancePane:'block',
                tWswitchChecked:false

            })
        } else {
            this.setState({
                tNswitchChecked: !tNswitchChecked,
                tokenPane: 2,
                translationPane: 3,
                concordancePane: 4,
                displayTranslationNotes: 'block',
                displayTranslationWordSwitch: 'block'
            })

        }

    }

    handleTWSwitchChange = e => {
        const { 
            tWswitchChecked,
        } = this.state
        if(!tWswitchChecked){
            this.setState({
                tWswitchChecked:!tWswitchChecked,
                displayConcordancePane:'none',
                displayTranslationWords:'block',
                // displayTranslationWordSwitch:'block'
            })
        }else{
            this.setState({
                tWswitchChecked:!tWswitchChecked,
                displayConcordancePane:'block',
                displayTranslationWords:'none',
                // displayTranslationWordSwitch:'none'
            })
        }
    }

    render() {
        const { classes } = this.props
        // console.log("Notes", this.state.translationNotes)
        console.log("Home STate", this.state)
        const {
            tokenPane,
            translationPane,
            concordancePane,
            displayConcordancePane,
            translationWordsPane,
            translationWords,
            translationNotesPane,
            translationNotes,
            displayTranslationWordSwitch
        } = this.state
        return (
            <Grid container item xs={12}>
                {/* <Grid item xs={2}> */}
                <Header classes={classes} />
                <MenuBar data={{
                    updateState: this.updateState,
                    classes: classes,
                    language: this.state.language,
                    version: this.state.version,
                    book: this.state.book
                }} />
                <Grid container item xs={12}>
                    <Grid container alignItems="flex-start" justify="flex-end" item xs={7}>
                    </Grid>
                    <Grid container alignItems="flex-start" justify="flex-end" item xs={2}
                    >
                        <Typography color="textSecondary" style={{display: displayTranslationWordSwitch}}>
                            Toggle Translation Words
                        </Typography>
                        <div style={{display: displayTranslationWordSwitch}}>
                            <Switch
                                checked={this.state.tWswitchChecked}
                                onChange={this.handleTWSwitchChange}
                                value={this.handleTWSwitchChange}
                            >
                                Toggle
                            </Switch>
                        </div>
                    </Grid>
                    <Grid container alignItems="flex-start" justify="flex-end" item xs={3}>
                        <Typography color="textSecondary">
                            Toggle Translation Helps
                        </Typography>
                        <Switch
                            checked={this.state.tNswitchChecked}
                            onChange={this.handleTNSwitchChange}
                            value={this.handleTNSwitchChange}
                        >
                            Toggle
                        </Switch>
                    </Grid>
                </Grid>
                <Grid container item xs={12}>
                    <Grid item xs={tokenPane}>
                        <TokenList data={{
                            updateState: this.updateState,
                            tokenList: this.state.tokenList,
                            book: this.state.book,
                            classes: classes,
                            language: this.state.language,
                            version: this.state.version,
                            targetLanguage: this.state.targetLanguage,
                            sourceId: this.state.sourceId,
                            targetLanguageId: this.state.targetLanguageId
                        }} />
                    </Grid>
                    <Grid item xs={translationPane}>
                        <UpdateTokens data={{
                            classes: classes,
                            token: this.state.token,
                            sourceId: this.state.sourceId,
                            targetLanguageId: this.state.targetLanguageId,
                            book: this.state.book,
                            tokenTranslation: this.state.tokenTranslation,
                            senses: this.state.senses,
                            updateState:this.updateState
                        }} />
                    </Grid>
                    <Grid item xs={concordancePane}
                    style={{display: displayConcordancePane}}
                    >
                        <Concordance data={{
                            classes: classes,
                            book: this.state.book,
                            concordance: this.state.concordance,
                            token: this.state.token,
                            updateState: this.updateState
                        }} />
                    </Grid>
                    <Grid item xs={translationWordsPane} style={{ display: this.state.displayTranslationWords }}>
                        {/* <Grid item xs={12}> */}
                        <TranslationsWords data={{
                            classes: classes,
                            translationWords: translationWords
                        }} />
                        {/* </Grid> */}
                        {/* <Grid item xs={12}> */}
                        {/* <TranslationsNotes /> */}
                        {/* </Grid> */}

                    </Grid>
                    <Grid item xs={translationNotesPane} style={{ display: this.state.displayTranslationNotes }}>
                        {/* <Grid item xs={12}> */}
                        <TranslationsNotes data={{
                            classes: classes,
                            translationNotes: translationNotes
                        }} />
                        {/* </Grid> */}
                        {/* <Grid item xs={12}> */}
                        {/* <TranslationsNotes /> */}
                        {/* </Grid> */}

                    </Grid>
                </Grid>
                {/* <Translations data={{
                    classes: classes
                }} /> */}
            </Grid>
        )
    }
}

// const mapDispatchToProps = (dispatch) => {
//     return {
//         createLanguages: (languages) => dispatch(createLanguages(languages))
//     }
// }

// export default connect(null, mapDispatchToProps)(HomePage);