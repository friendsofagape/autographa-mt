import React, { Component } from 'react';
import { Grid, ListItem, Divider } from '@material-ui/core';
import ComponentHeading from './ComponentHeading';
import apiUrl from './GlobalUrl'

export default class TokenList extends Component {
   
    async getVerseText(token) {
        const { sourceId, book } = this.props.data
        console.log(sourceId, book)
        const data = await fetch(apiUrl + '/v1/concordances/' + sourceId + '/' + book + '/' + token, {
            method: 'GET'
        })
        const concordance = await data.json()
        await this.props.data.updateState({ concordance: concordance })
    }

    async getTranslationWords(word) {
        const { sourceId } = this.props.data
        const data = await fetch(apiUrl + '/v1/translationshelps/words/' + sourceId + '/' + word, {
            method: 'GET'
        })
        const translationWords = await data.json()
        if (translationWords) {
            await this.props.data.updateState({ translationWords: translationWords })
        }
    }

    async getTranslatedWords(word){
        const { sourceId, targetLanguageId, updateState } = this.props.data
        console.log("printing", apiUrl + '/v1/translations/' + sourceId + '/' + targetLanguageId + '/' + word)
        const data = await fetch(apiUrl + '/v1/translations/' + sourceId + '/' + targetLanguageId + '/' + word, {
            method:'GET'
        })
        const translatedWords = await data.json()
        if(translatedWords.translation){
            console.log("******************", translatedWords)
            const {translation, senses} = translatedWords
            updateState({tokenTranslation: translation, senses: senses})
        }else{
            updateState({tokenTranslation: '', senses: []})
        }
    }

    handleClick = e => {
        var word = e.target.getAttribute('value')
        this.getTranslationWords(word)
        this.props.data.updateState({ token: word, concordance:'', translationNotes:''})
        this.getTranslatedWords(word)
        this.getVerseText(word)
    }

    getTokens(tokenList) {
        if (this.props.data.tokenList && this.props.data.targetLanguage) {
            return tokenList.map((item, index) => {
                return (
                    <div>
                        <ListItem button
                            key={item + index}
                            name={item}
                            value={item}
                            onClick={this.handleClick}>{item}
                        </ListItem>
                        <Divider />
                    </div>
                )
            })
        } else {
            return <ListItem>Select Target Language to display tokens</ListItem>
        }
    }

    render() {
        const { classes, tokenList } = this.props.data
        return (
            <Grid item xs={12} className={classes.containerGrid}>
                <Grid item xs={12}>
                    <ComponentHeading data={{ classes: classes, text: "Token List" }} />
                </Grid>
                <Grid item xs={12} className={classes.tokenList}>
                    {this.getTokens(tokenList)}
                </Grid>
            </Grid>
        )
    }
}
