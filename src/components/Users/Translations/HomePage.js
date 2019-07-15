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
// import Header from '../Header';

export default class ProjectHomePage extends Component {
    state = {
        book: '',
        tokenList: '',
        token: '',
        concordance: '',
        targetLanguageId: 20,
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
        const { tNswitchChecked } = this.state
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
        const { classes, selectedProject } = this.props
        const { books, sourceId, targetId, projectId} = selectedProject
        const {
            book,
            token,
            tokenTranslation,
            senses,
            concordance,
            tokenPane,
            tokenList,
            translationPane,
            concordancePane,
            displayConcordancePane,
            translationWordsPane,
            translationWords,
            translationNotesPane,
            translationNotes,
            displayTranslationWordSwitch
        } = this.state
        console.log("home State", this.state)
        return (
            <Grid container item xs={12}>
                {/* <Header classes={classes} /> */}
                <MenuBar
                    updateState={this.updateState}
                    books={books}
                    book={book}
                    sourceId={sourceId}
                 />
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
                                // value={this.handleTWSwitchChange}
                            />
                                {/* Toggle
                            </Switch> */}
                        </div>
                    </Grid>
                    <Grid container alignItems="flex-start" justify="flex-end" item xs={3}>
                        <Typography color="textSecondary">
                            Toggle Translation Helps
                        </Typography>
                        <Switch
                            checked={this.state.tNswitchChecked}
                            onChange={this.handleTNSwitchChange}
                            // value={this.handleTNSwitchChange}
                        />
                            {/* Toggle
                        </Switch> */}
                    </Grid>
                </Grid>
                <Grid container item xs={12}>
                    <Grid item xs={tokenPane}>
                        <TokenList data={{
                            updateState: this.updateState,
                            tokenList: tokenList,
                            book: book,
                            classes: classes,
                            sourceId: sourceId,
                            targetLanguageId: targetId,
                            projectId:projectId

                        }} />
                    </Grid>
                    <Grid item xs={translationPane}>
                        <UpdateTokens data={{
                            classes: classes,
                            token: token,
                            sourceId: sourceId,
                            targetLanguageId: targetId,
                            book: book,
                            tokenTranslation: tokenTranslation,
                            senses: senses,
                            updateState:this.updateState,
                            projectId:projectId
                        }} />
                    </Grid>
                    <Grid item xs={concordancePane}
                    style={{display: displayConcordancePane}}
                    >
                        <Concordance data={{
                            classes: classes,
                            book: book,
                            concordance: concordance,
                            token: token,
                            updateState: this.updateState
                        }} />
                    </Grid>
                    <Grid item xs={translationWordsPane} style={{ display: this.state.displayTranslationWords }}>
                        <TranslationsWords data={{
                            classes: classes,
                            translationWords: translationWords
                        }} />
                    </Grid>
                    <Grid item xs={translationNotesPane} style={{ display: this.state.displayTranslationNotes }}>
                        <TranslationsNotes data={{
                            classes: classes,
                            translationNotes: translationNotes
                        }} />

                    </Grid>
                </Grid>
            </Grid>
        )
    }
}