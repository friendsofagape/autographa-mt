import React, { Component } from 'react';
import ComponentHeading from '../ComponentHeading';
import { Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
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
        //   width: '97%',
        //   marginLeft: '2%',
        //   marginRight: '2%',
        //   border: '1px solid "#2a2a2fbd"',
        //   boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
        //   height: '320px',
        //   backgroundColor: '#fff',
      },
});

const ReactMarkdown = require('react-markdown/with-html');




class TranslationNotes extends Component {
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
            this.setState({translationNotes:result, currentRef: this.props.reference})
        }
        catch(ex){
            this.setState({translationNotes:"No Data available"})
        }
    }

    componentWillReceiveProps(nextProps){
        const { reference, verseNum } = nextProps
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
        const { classes } = this.props
        return (
            <Grid item sm={12} className={classes.containerGrid}>
                <Grid item sm={12} >
					<Typography component="h4" variant="h7" style={{textAlign:"left" ,padding:"1%"}}>
                   		Translation Notes
					</Typography>
				</Grid>
				<Grid item sm={12} style={{height: '100px'}}>
					<Grid item sm={12} style={{height: "100%",overflowX: "hidden", overflowY: "auto"}}>
                    {this.displayTranslationNotes()}
					</Grid>
				</Grid>
            </Grid>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        reference: state.project.reference,
        verseNum: state.project.verseNum
    }
}

const mapDispatchToProps = (dispatch) => ({
    dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TranslationNotes));