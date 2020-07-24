import React, { Component } from 'react'
import { Grid } from '@material-ui/core';
import ComponentHeading from '../ComponentHeading';
import { ListItem } from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/core/styles';
import apiUrl from '../GlobalUrl'
import { connect } from 'react-redux'

const styles = theme => ({
    root: {
        display:'flex',
        flexGrow: 1,
      },
      tokenList: {
        textAlign: 'center',
        color: theme.palette.text.secondary,
        height: '30vh',
        overflowX: 'hidden',
        overflowY: 'auto',
        backgroundColor: '#fff',
      },
      containerGrid: {
        // width: '97%',
        // marginLeft: '2%',
        // marginRight: '2%',
        // border: '1px solid #3e51b5',
        border: '1px solid "#2a2a2fbd"',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
        height: '320px',
        backgroundColor: '#fff',
      },
});



class TranslationWords extends Component {
    state = {
        translationWords: '',
        currentToken:''
    }

    async getTranslationWords(sourceId, token) {
        const data = await fetch(apiUrl + 'v1/translationshelps/words/' + sourceId + '/' + token, {
            method: 'GET'
        })
        const translationWords = await data.json()
        if (translationWords) {
            this.setState({ translationWords: translationWords, currentToken: this.props.token })
        }
    }

    componentDidUpdate(prevProps){
        const { selectedProject, selectedToken } = this.props
        // const { currentToken } = this.state
        if(prevProps.selectedToken !== selectedToken){
            this.getTranslationWords(selectedProject.sourceId, selectedToken)
        }
    }

    displayTranslationWords() {
        const { classes } = this.props
        const { translationWords } = this.state
        if (translationWords) {
            var tWkeys = Object.keys(translationWords)
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
        const { classes } = this.props
        return (
            <Grid item xs={12} className={classes.containerGrid}>
                <Grid container item xs={12}>
                    <Grid item xs={12}>
                        <ComponentHeading data={{
                            classes: classes,
                            text: "Translation Words",
                            styleColor: "#2a2a2fbd"
                        }} />
                    </Grid>
                    <Grid item xs={12} className={classes.tokenList}>
                        {this.displayTranslationWords()}
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = (state) => ({
        selectedToken: state.project.selectedToken,
        selectedProject: state.project.selectedProject
})

export default connect(mapStateToProps)(withStyles(styles)(TranslationWords))