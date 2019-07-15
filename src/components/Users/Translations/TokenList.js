import React, { Component } from 'react';
import { Grid, ListItem, Divider } from '@material-ui/core';
import ComponentHeading from '../../ComponentHeading';
import apiUrl from '../../GlobalUrl'
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        display: 'flex',
    },
    tokenList: {
      textAlign: 'center',
      color: theme.palette.text.secondary,
      height: 360,
      overflowX: 'hidden',
      overflowY: 'auto',
      backgroundColor: '#fff',
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

class TokenList extends Component {
   
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
        const { updateState, projectId } = this.props.data
        // console.log("printing", apiUrl + '/v1/translations/' + sourceId + '/' + targetLanguageId + '/' + word)
        const data = await fetch(apiUrl + '/v1/autographamt/projects/translations/' + word + '/' + projectId, {
            method:'GET'
        })
        const translatedWords = await data.json()
        if(translatedWords.translation){
            // console.log("******************", translatedWords)
            const {translation, senses} = translatedWords
            await updateState({tokenTranslation: translation, senses: senses})
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
        if (this.props.data.tokenList) {
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
        } else {
            return <ListItem>Select Target Language to display tokens</ListItem>
        }
    }

    render() {
        const { tokenList } = this.props.data
        const { classes } = this.props
        return (
            <Grid item xs={12} className={classes.containerGrid}>
                <Grid item xs={12}>
                    <ComponentHeading data={{ classes: classes, text: "Token List",
                            styleColor:"#2a2a2fbd"  }} />
                </Grid>
                <Grid item xs={12} className={classes.tokenList}>
                    {this.getTokens(tokenList)}
                </Grid>
            </Grid>
        )
    }
}


export default withStyles(styles)(TokenList);