import React, { Component } from 'react';
import ComponentHeading from './ComponentHeading';
import { Grid } from '@material-ui/core';

const ReactMarkdown = require('react-markdown/with-html');

export default class TranslationNotes extends Component {
    state = {
        translationNotes: 'Select Concordance to Fetch Notes',
        currentRefse: ''
    }


    async getTranslationNotes(book, chapter, verse){
        try{
            const data = await fetch('https://git.door43.org/api/v1/repos/BCS-EXEGETICAL/hi_tN/raw/Content%2F' + book.toUpperCase() +  '%2F' + chapter + '%2F' + verse + '.md', {
                method:'GET',
                header: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
                }
              })
            const result = await data.text()
            // const { updateState } = this.props.data
            this.setState({translationNotes:result})
            // updateState({translationNotes: result})
        }
        catch(ex){
            console.log('No data')
            console.log(ex)
            // const { updateState } = this.props.data
            this.setState({translationNotes:"No Data available"})
            // updateState({translationNotes: "No data available"})
        }
    }

    componentWillReceiveProps(nextProps){
        const { reference, verseNum } = nextProps.data
        const { currentRef } = this.state
        
        if(reference && currentRef !== reference){
            const { book, chapter, verse } = verseNum
            this.getTranslationNotes(book, chapter, verse)
        }else{
            this.setState({translationNotes: 'Select Concordance to Fetch Notes'})
        }
    }
    
    displayTranslationNotes = () => {
        // this.getApiData()
        const { translationNotes } = this.state
        // if(translationNotes){
            return (
                <ReactMarkdown
                source={translationNotes}
                escapeHtml={true}
                />
            )
        // }
    }
    render() {
        console.log("notes", this.state)
        const { classes } = this.props.data
        return (
            <Grid item xs={12} className={classes.containerGrid}>
                <Grid container item xs={12}>
                    <Grid item xs={12}>
                        <ComponentHeading data={{
                            classes: classes,
                            text: "Translation Notes"
                        }} />
                    </Grid>
                    <Grid item xs={12} className={classes.tokenList}>
                        {this.displayTranslationNotes()}
                        {/* {this.testGit()} */}
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}
