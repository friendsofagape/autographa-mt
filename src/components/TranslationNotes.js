import React, { Component } from 'react';
import ComponentHeading from './ComponentHeading';
import { Grid } from '@material-ui/core';

const ReactMarkdown = require('react-markdown/with-html');

export default class TranslationNotes extends Component {
    displayTranslationNotes = () => {
        // this.getApiData()
        const { translationNotes } = this.props.data
        if(translationNotes){
            return (
                <ReactMarkdown
                source={translationNotes}
                escapeHtml={true}
                />
            )
        }
    }
    render() {
        console.log("notes", this.props)
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
