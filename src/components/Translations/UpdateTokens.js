import React, { Component } from 'react';
import { Grid, Button, Typography, Divider } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import ComponentHeading from '../ComponentHeading';
import PopUpMessages from '../PopUpMessages';
import Chip from '@material-ui/core/Chip';
import apiUrl from '../GlobalUrl';
// import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { displaySnackBar } from '../../store/actions/sourceActions';
import { getTranslatedWords, updateTransaltion } from '../../store/actions/projectActions';

const accessToken = localStorage.getItem('accessToken')


const styles = theme => ({
    root: {
        display: 'flex',
        flexGrow: 1,
    },
    inputField: {
        width: '90%',
        marginLeft: '10px'
    },
    containerGrid: {
        // width: '97%',
        // marginLeft: '2%',
        // marginRight: '2%',
        border: '1px solid "#2a2a2fbd"',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
        height: '320px',
        backgroundColor: '#fff',
    },
    tokenDetails: {
        height: "100%",
        overflowX: "hidden",
        overflowY: "auto",
        backgroundColor: "#fff",
    },
    containerGridToken: {
      backgroundColor: "#fff",
      height: "130px",
    },
    button: {
        margin: '10px'
    }
});

class UpdateTokens extends Component {
    state = {
        translation: '',
        snackBarOpen: false,
        popupdata: {},
        senses: [],
        sense: '',
        token: ''
    }



    // componentWillReceiveProps(nextProps) {
    //     const { token, project } = nextProps
    //     if (token) {
    //         this.setState({ token, targetLanguageId: project.targetId, sourceId: project.sourceId })
    //         this.getTranslatedWords(token, project.sourceId, project.targetId)
    //     }

    // }

    componentDidUpdate(prevProps) {
        if (prevProps.selectedToken !== this.props.selectedToken) {
            if (this.props.selectedProject.sourceId) {
                const { selectedToken, selectedProject } = this.props;
                this.props.dispatch(getTranslatedWords(selectedToken, selectedProject.sourceId, selectedProject.targetId))
            }
        }
    }

    clearTransaltionState = () => {
        this.setState({
            translation: '',
            sense: ''
        })
    }

    updateTokenTranslation = () => {
        const { selectedProject, selectedToken, dispatch } = this.props;
        const { translation } = this.state;
        const apiData = {
            projectId: selectedProject.projectId,
            token: selectedToken,
            translation: translation,
            senses: []
        }
        dispatch(updateTransaltion(apiData, this.clearTransaltionState))
    }

    updateTokenSense = () => {
        const { selectedProject, selectedToken, dispatch } = this.props;
        const { sense,translation } = this.state;
        const apiData = {
            projectId: selectedProject.projectId,
            token: selectedToken,
            translation: translation,
            senses: [sense]
        }
        dispatch(updateTransaltion(apiData, this.clearTransaltionState))
    }


    displaySenses() {
        const { senses } = this.props
        if (senses) {
            return senses.map(item => {
                return (
                <span>{item}{', '}</span>
                )
            })
        }
    }

    // handleSubmit = e => {
    //     e.preventDefault();
    //     this.updateTransaltion();
    // }

    closeSnackBar = (item) => {
        this.setState(item)
    }

    // submitSenses = () => {
    //     const { senses, sense } = this.state
    //     if (sense) {
    //         senses.push(sense)
    //         this.updateTransaltion()
    //         this.setState({ sense: '' })
    //         this.getTranslatedWords()
    //     }
    // }

    render() {
        const { classes, selectedProject, selectedToken, translation, senses } = this.props
        console.log('update', this.props)
        // const { translation } = this.state
        var displayLanguage = ''
        if (selectedProject.projectName) {
            displayLanguage = selectedProject.projectName.split('|')[0].split('-')[2]
        }
        return (
            <Grid item xs={12} >
                {/* <Grid item xs={12}>
                    <ComponentHeading data={{ classes: classes, text: `${displayLanguage.toUpperCase()} Project`, styleColor: "#2a2a2fbd" }} />
                </Grid> */}
                {/* <PopUpMessages /> */}


                <Typography component="h4" variant="h7" style={{textAlign:"left" ,paddingLeft:"3%", paddingBottom:'1%',paddingTop:'1%'}}>
                    Token Details
				</Typography>
                <Grid className={classes.containerGridToken}>
                <Grid className={classes.tokenDetails}>
              

                <Grid item container sm={12}>
                    <Grid item sm={4} style={{ paddingTop: '3%',paddingLeft:"4%" }}>
                         <Typography variant="inherit" align="left" style={{ color: '#c20a6e' }}>
                             Token:
                         </Typography>
                     </Grid>
                     <Grid item sm={7} style={{paddingLeft:"4%",paddingTop: '3%'}}>
                         {this.props.selectedToken}
                     </Grid>
                </Grid> 

                <Grid item container sm={12}>
                    <Grid item sm={4} style={{ paddingTop: '3%',paddingLeft:"4%" }}>
                         <Typography variant="inherit" align="left" style={{ color: '#c20a6e' }}>
                             Translation:
                         </Typography>
                     </Grid>
                     <Grid item sm={7} style={{paddingLeft:"4%",paddingTop: '3%'}}>
                         {this.props.translation}
                     </Grid>
                </Grid> 

                <Grid item container sm={12}>
                    <Grid item sm={4} style={{ paddingTop: '3%',paddingLeft:"4%"}} >
                         <Typography variant="inherit" align="left" style={{ color: '#c20a6e' }}>
                             Synonyms:
                         </Typography>
                     </Grid>
                     <Grid item sm={7} style={{paddingLeft:"4%",paddingTop: '3%'}}>
                         {this.displaySenses()}
                     </Grid>
                </Grid> 
                </Grid>
                </Grid>















                <Divider />
                <Typography component="h4" variant="h7" style={{textAlign:"left" ,paddingLeft:"3%", paddingBottom:'2%',paddingTop:'1%'}}>
						        Update Selected Token
				</Typography>
                
                <Grid item container xs={12}>
                    <Grid item sm={1}></Grid>
                    <Grid item sm={5}>
                        <TextField
                            disabled
                            margin="dense"
                            variant="outlined"
                            value={selectedToken}
                            label={"Token"}
                            className={classes.inputField}
                        />
                    </Grid>
                    <Grid item sm={5}>
                        <TextField
                            required
                            label="Enter Translation"
                            value={this.state.translation}
                            onChange={(e) => this.setState({ translation: e.target.value })}
                            margin="dense"
                            variant="outlined"
                            className={classes.inputField}
                        />
                    </Grid>
                    <Grid item sm={1}></Grid>
                </Grid>
                
                <Grid container justify="center" alignItems="center">
                    <Typography variant="inherit" align="left" style={{ color: 'rgb(145, 148, 151)', paddingTop:'10px' }}>
                        Add alternate translations, not mandatory
                    </Typography>
                </Grid>

                <Grid item container xs={12}>
                    <Grid item sm={1}></Grid>
                    <Grid item xs={12} sm={10}>
                            <TextField
                                required
                                label="Enter Senses"
                                value={this.state.sense}
                                onChange={(e) => this.setState({ sense: e.target.value })}
                                margin="dense"
                                helperText="Note: Enter each senses seprated by commas(,) "
                                variant="outlined"
                                className={classes.inputField}
                            />
                    </Grid>
                    <Grid item sm={1}></Grid>
                </Grid>

               
                <Grid container justify="center" alignItems="center">
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        disabled={!this.state.translation}
                        className={classes.button}
                        // style={{ marginLeft: '30%', marginTop: '3%' }}
                        // style={{ margin: 'auto' }}
                        onClick={this.updateTokenSense}>Save</Button>
                </Grid>
               
               {/* <Divider /> */}
               {/* ------------------------------------------------------- */}

               {/* <Typography component="h4" variant="h7" style={{textAlign:"left" ,paddingLeft:"3%", paddingBottom:'1%',paddingTop:'1%'}}>
                    Token Details
				</Typography>
                <Grid className={classes.containerGridToken}>
                <Grid className={classes.tokenDetails}>
               <Grid item container sm={12}>
               
                    <Grid item sm={4} style={{ margin: '2%' }}>
                         <Typography variant="inherit" align="left" style={{ color: 'rgb(145, 148, 151)' }}>
                             Token:
                         </Typography>
                     </Grid>
                     <Grid item sm={4} style={{margin: '2%'}}>
                         {this.props.selectedToken}
                     </Grid>
                </Grid> 


                <Grid item container sm={12}>
                    <Grid item sm={4} style={{ margin: '2%' }}>
                         <Typography variant="inherit" align="left" style={{ color: 'rgb(145, 148, 151)' }}>
                             Translation:
                         </Typography>
                     </Grid>
                     <Grid item sm={4} style={{margin: '2%'}}>
                         {this.props.translation}
                     </Grid>
                </Grid> 

                <Grid item container sm={12}>
                    <Grid item sm={4} style={{ margin: '2%' }}>
                         <Typography variant="inherit" align="left" style={{ color: 'rgb(145, 148, 151)' }}>
                             Synonyms:
                         </Typography>
                     </Grid>
                     <Grid item sm={4} style={{margin: '2%'}}>
                         {this.displaySenses()}
                     </Grid>
                </Grid> 
                </Grid>
                </Grid> */}

            </Grid>
               
               
               
               


            
        )
    }
}

const mapStateToProps = (state) => {
    return {
        selectedProject: state.project.selectedProject,
        selectedToken: state.project.selectedToken,
        translation: state.project.translation,
        senses: state.project.senses
    }
}


const mapDispatchToProps = (dispatch) => ({
    dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(UpdateTokens))
