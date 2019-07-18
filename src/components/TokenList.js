import React, { Component } from 'react';
import { Grid, ListItem, Divider } from '@material-ui/core';
import ComponentHeading from './ComponentHeading';
import apiUrl from './GlobalUrl'

export default class TokenList extends Component {
    state = {
        tokenList: [],
        currentBook: '',
        currentToken: ''
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

    async getTokenList(currentBook, sourceId) {
        console.log(apiUrl + 'v1/tokenlist/' + sourceId + '/' + currentBook)
        var bookData = await fetch(apiUrl + 'v1/tokenlist/' + sourceId + '/' + currentBook, {
            method: 'GET'
        })
        const tokenList = await bookData.json();
        this.setState({ tokenList: tokenList })
    }

    componentDidMount(){
        this.getTokens()
    }

    componentWillReceiveProps(nextProps) {
        const { book, sourceId, token } = nextProps.data
        this.setState({ currentBook: book, sourceId: sourceId, currentToken:token})
        if(book){
            this.getTokenList(book, sourceId)
        }
    }

    async getTranslatedWords(word) {
        const { sourceId, targetLanguageId, updateState } = this.props.data
        console.log("printing", apiUrl + '/v1/translations/' + sourceId + '/' + targetLanguageId + '/' + word)
        const data = await fetch(apiUrl + '/v1/translations/' + sourceId + '/' + targetLanguageId + '/' + word, {
            method: 'GET'
        })
        const translatedWords = await data.json()
        if (translatedWords.translation) {
            console.log("******************", translatedWords)
            const { translation, senses } = translatedWords
            updateState({ tokenTranslation: translation, senses: senses })
        } else {
            updateState({ tokenTranslation: '', senses: [] })
        }
    }

    handleClick = e => {
        var word = e.target.getAttribute('value')
        const { currentToken } =  this.state
        if(word !== currentToken){
            console.log('passing to home')
            this.props.data.updateState({ token: word, reference:'', verseNum: '' })
        }
    }

    getTokens() {
        const { tokenList } = this.state
        if (tokenList) {
            return tokenList.map((item, index) => {
                return (
                    <div
                        key={item + index}>
                        <ListItem button
                            name={item}
                            value={item}
                            onClick={this.handleClick}>{item}
                        </ListItem>
                        <Divider />
                    </div>
                )
            })
        }else{
            return <ListItem>No tokens</ListItem>
        }
    }

    render() {
        const { classes } = this.props.data
        console.log("Tokens", this.state)
        // const { tokenList } = this.state
        return (
            <Grid item xs={12} className={classes.containerGrid}>
                <Grid item xs={12}>
                    <ComponentHeading data={{ classes: classes, text: "Token List" }} />
                </Grid>
                <Grid item xs={12} className={classes.tokenList}>
                    {this.getTokens()}
                </Grid>
            </Grid>
        )
    }
}
