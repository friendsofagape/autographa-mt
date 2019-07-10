import React, { Component } from 'react'
import { Grid } from '@material-ui/core';
import ComponentHeading from '../../ComponentHeading';
import { ListItem } from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
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



class TranslationWords extends Component {
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
        const { translationWords } = this.props.data
        const { classes } = this.props
        // console.log("mark", this.state)
        return (
            <Grid item xs={12} className={classes.containerGrid}>
                <Grid container item xs={12}>
                    <Grid item xs={12}>
                        <ComponentHeading data={{
                            classes: classes,
                            text: "Translation Words",
                            styleColor:"#2a2a2fbd" 
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


export default withStyles(styles)(TranslationWords);