import React, { Component } from 'react'
import { Grid,Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import apiUrl from '../GlobalUrl'
import { connect } from 'react-redux'

const styles = theme => ({
    root: {
        display:'flex',
        flexGrow: 1,
    },
    tokenList: {
        height: '30vh',
        overflowX: 'hidden',
        overflowY: 'auto',
    }
});

class TranslationWords extends Component {
    state = {
        translationWords: '',
        currentToken:'',
        tokenSelected:''
    }

    // check previous value
    componentWillReceiveProps(nextProps) {
		if(this.props.tokenSelected !== nextProps.tokenSelected){
			this.setState({
                tokenSelected:'',			
                translationWords:''
            })
        }
	}

    // fetch token details from database
    async getTranslationWords() {
        if(this.props.tokenSelected !==''){
            if(this.state.tokenSelected !== this.props.tokenSelected){
                const { tokenSelected } = this.props;
                const data = await fetch(apiUrl + 'v1/translationshelps/words/' + this.props.selectedProject.sourceId + '/' + tokenSelected, {
                    method: 'GET'
                });
                const translationWords = await data.json()
                this.setState({ translationWords: translationWords, currentToken: tokenSelected, tokenSelected: tokenSelected })
            }
        }
    }

    // display details 
    displayTranslationWords() {
        const { translationWords } = this.state
        if(String(translationWords.success) === "false"){
            return <p style={{paddingLeft:"3%", fontSize:"75%", color:'#b1b2b3'}} >No data available</p>
        }
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
        } 
        
    }

    render() {
        return (
            <Grid item xs={12}>
                <Grid item sm={12} >
					<Typography component="h4" variant="h6" style={{textAlign:"left" ,padding:"1%"}}>
                   		Dictionary
					</Typography>
				</Grid>
                <Grid item sm={12} style={{height: '120px'}}>
                    <Grid item sm={12} style={{height: "96%",overflowX: "hidden", overflowY: "auto"}}>
                        {!this.state.translationWords &&
                            <Grid style={{paddingTop:'11%', paddingLeft:'38%'}}>
							<Button size={'small'} 
							color={'primary'} 
							variant="contained" 
							disabled={!this.props.tokenSelected}
							onClick={()=>{this.getTranslationWords()}}>
								<span style={{fontSize:'68%'}}>Load</span>
							</Button>
						</Grid>}
                        {this.displayTranslationWords()}
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = (state) => ({
        selectedProject: state.project.selectedProject
})

export default connect(mapStateToProps)(withStyles(styles)(TranslationWords))