import React, { Component } from 'react'
import { Grid } from '@material-ui/core';
import ComponentHeading from './ComponentHeading';
import { ListItem } from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';



export default class TranslationWords extends Component {
    getTranslationWords = () => {
        const { classes, translationWords } = this.props.data
        // console.log("TW", translationWords)
        if (translationWords) {
            var tWkeys = Object.keys(translationWords)
            console.log(tWkeys[0])
            return tWkeys.map((item, index) => {
                return (
                    <ExpansionPanel
                        key={index}>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography className={classes.heading}>{item}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Typography color="inherit">
                                {translationWords[item]}
                            </Typography>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                )
            })
        } else {
            return <ListItem>No data available</ListItem>
        }
    }

    render() {
        const { classes } = this.props.data
        // console.log("mark", this.state)
        return (
            <Grid item xs={12} className={classes.containerGrid}>
                <Grid container item xs={12}>
                    <Grid item xs={12}>
                        <ComponentHeading data={{
                            classes: classes,
                            text: "Translation Words"
                        }} />
                    </Grid>
                    <Grid item xs={12} className={classes.tokenList}>
                        {this.getTranslationWords()}
                        {/* {this.testGit()} */}
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}
