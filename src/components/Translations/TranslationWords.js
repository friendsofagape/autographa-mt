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
        // textAlign: 'center',
        // color: theme.palette.text.secondary,
        height: '30vh',
        overflowX: 'hidden',
        overflowY: 'auto',
        // backgroundColor: '#fff',
      },
      containerGrid: {
        // width: '97%',
        // marginLeft: '2%',
        // marginRight: '2%',
        // border: '1px solid #3e51b5',
        // border: '1px solid "#2a2a2fbd"',
        // boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
        // height: '320px',
        // backgroundColor: '#fff',
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
        console.log("wdccccccccccccccccccccc",translationWords)
        if (translationWords.definition) {
            if (translationWords.strongs){
                var tW = translationWords.strongs
                var tWS = tW.replace(/,/g,', ')
            }
            return (
                <Grid>
                    <Grid>
                        <p style={{textAlign:'left', paddingLeft:"2%", fontWeight:'bold', fontSize:'75%', margin:'2px',color:'#a6024b'}}>Defination</p>
                        <p style={{paddingLeft:"4%",paddingRight:"5%", fontSize:'75%',textAlign:'left', margin:'0'}}>{translationWords.definition}</p>
                    </Grid>
                    
                    <Grid>
                        <p style={{textAlign:'left', paddingLeft:"2%", fontWeight:'bold', fontSize:'75%', margin:'2px',color:'#a6024b'}}>Keyword</p>
                        <p style={{paddingLeft:"4%",paddingRight:"5%", fontSize:'75%',textAlign:'left', margin:'0'}}>{translationWords.keyword}</p>
                    </Grid>

                    <Grid>
                        
                        <p style={{textAlign:'left', paddingLeft:"2%", fontWeight:'bold', fontSize:'75%', margin:'2px',color:'#a6024b'}}>Strongs Number</p>
                        <p style={{paddingLeft:"4%",paddingRight:"5%", fontSize:'75%',textAlign:'left', margin:'0'}}>{tWS}</p>
                    </Grid>

                    <Grid>
                        <p style={{textAlign:'left', paddingLeft:"2%", fontWeight:'bold', fontSize:'75%', margin:'2px',color:'#a6024b'}}>Translation Help</p>
                        <p style={{paddingLeft:"4%",paddingRight:"5%", fontSize:'75%',textAlign:'left', margin:'0'}}>{translationWords.translationhelp}</p>
                    </Grid>

                    <Grid>
                        <p style={{textAlign:'left', paddingLeft:"2%", fontWeight:'bold', fontSize:'75%', margin:'2px',color:'#a6024b'}}>Word Forms</p>
                        <p style={{paddingLeft:"4%",paddingRight:"5%", fontSize:'75%',textAlign:'left', margin:'0', paddingBottom:'1%'}}>{translationWords.wordforms}</p>
                    </Grid>
                </Grid>
                )
        } else {
            return <p style={{paddingLeft:"3%", fontSize:"75%", color:'#b1b2b3'}} >No details available for the selected token</p>
        }
    }

    render() {
        const { classes } = this.props
        return (
            <Grid item xs={12} className={classes.containerGrid}>
                <Grid item sm={12} >
					<Typography component="h4" variant="h7" style={{textAlign:"left" ,padding:"1%"}}>
                   		Dictionary
					</Typography>
				</Grid>
                <Grid item sm={12} style={{height: '120px'}}>
                    <Grid item sm={12} style={{height: "96%",overflowX: "hidden", overflowY: "auto"}}>
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