import React, { Component } from 'react'
import { Grid } from '@material-ui/core';
import ComponentHeading from './ComponentHeading';
import { ListItem } from '@material-ui/core';
import { Divider } from '@material-ui/core';
import apiUrl from './GlobalUrl'

export default class Concordance extends Component {
    state = {
        translationNotes:'',
        concordance: '',
        currentToken: ''
    }

    lengthCheck(item){
        var num = item.toString()
        if(num.length === 1){
            return '0' + num
        }else{
            return num
        }
    }
       
    async getVerseText(token, sourceId, book ) {
        if(book){
            console.log(apiUrl + '/v1/concordances/' + sourceId + '/' + book + '/' + token)
            const data = await fetch(apiUrl + '/v1/concordances/' + sourceId + '/' + book + '/' + token, {
                method: 'GET'
            })
            const concordance = await data.json()
            await this.setState({ concordance: concordance })
        }
    }

    componentWillReceiveProps(nextProps){
        const { token, sourceId, book } = nextProps.data
        if(token){
            this.getVerseText(token, sourceId, book )
        }
    }

    async getTranslationNotes(book, chapter, verse){
        try{
            const data = await await fetch('https://git.door43.org/api/v1/repos/BCS-EXEGETICAL/hi_tN/raw/Content%2F' + book.toUpperCase() +  '%2F' + chapter + '%2F' + verse + '.md', {
                method:'GET',
                header: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
                }
              })
            const result = await data.text()
            const { updateState } = this.props.data
            await this.setState({translationNotes:result})
            updateState({translationNotes: result})
        }
        catch(ex){
            console.log('No data')
            console.log(ex)
            const { updateState } = this.props.data
            await this.setState({translationNotes:"None"})
            updateState({translationNotes: "No data available"})
        }
    }
    

    storeBCV = (book, chapter, verse) => {
        const { updateState } = this.props.data
        // this.getTranslationNotes(book, this.lengthCheck(chapter), this.lengthCheck(verse))
        updateState({
            reference: book + this.lengthCheck(chapter) + this.lengthCheck(verse),
            verseNum:{
                book:book,
                chapter: this.lengthCheck(chapter),
                verse: this.lengthCheck(verse)
            }
        })
    }

    displayConcordance(value, token) {
        if (value) {
            return value.map((item, index) => {
                const bcv = item.book + item.chapterNumber + item.verseNumber
                const { book, chapterNumber, verseNumber, verse, bookCode } = item
                return (
                    <div
                    key={bcv + 'p' + index}>
                    <ListItem button
                    value={bcv}
                    onClick={() => this.storeBCV(bookCode, chapterNumber, verseNumber)}>
                    <p>{book.toUpperCase()} {chapterNumber}:{verseNumber}&nbsp;
                    {verse.split(" ").map((span, index) => {
                        if (span.includes(token)) {
                            return (
                                <span key={bcv + span + index} 
                                className={this.props.data.classes.highlightToken} 
                                >
                                 {span}&nbsp;
                                 </span>
                            )
                        } else {
                            return (
                                <span key={bcv + span + index}> {span}&nbsp; </span>
                            )
                        }
                    }
                    )}
                    </p>
                    </ListItem>
                    <Divider />
                    </div>
                )
            })
        } else {
            return <p>Select Token to Load Data</p>
        }
    }
    render() {
        const { classes, book, token } = this.props.data
        const { concordance } = this.state
        return (
            <Grid container item xs={12} className={classes.containerGrid}>
                {/* <Paper className={classes.tokenList}> */}
                <Grid item xs={12}>
                    <Grid item xs={12}>
                        <ComponentHeading data={{
                            classes: classes,
                            text: `${book.toUpperCase()} Concordance`
                        }} />
                    </Grid>
                    <Grid item xs={12} className={classes.textDisplay}>

                        {this.displayConcordance(concordance[book.toLowerCase()], token)}
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid item xs={12}>
                        <ComponentHeading data={{
                            classes: classes,
                            text: `All Books Concordance`
                        }} />
                    </Grid>
                    <Grid item xs={12} className={classes.textDisplay}>
                        {this.displayConcordance(concordance.all, token)}
                    </Grid>
                </Grid>
                {/* </Paper> */}
            </Grid>
        )
    }
}
