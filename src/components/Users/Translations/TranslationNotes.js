import React, { Component } from 'react';
import ComponentHeading from '../../ComponentHeading';
import { Grid } from '@material-ui/core';
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

const ReactMarkdown = require('react-markdown/with-html');

class TranslationNotes extends Component {
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
        // console.log("notes", this.props)
        const { classes } = this.props
        return (
            <Grid item xs={12} className={classes.containerGrid}>
                <Grid container item xs={12}>
                    <Grid item xs={12}>
                        <ComponentHeading data={{
                            classes: classes,
                            text: "Translation Notes",
                            styleColor:"#2a2a2fbd" 
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

export default withStyles(styles)(TranslationNotes);