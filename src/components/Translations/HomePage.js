import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import MenuBar from './MenuBar';
import TokenList from './TokenList';
import Concordance from './Concordance';
import TranslationsNotes from './TranslationNotes';
import TranslationsWords from './TranslationWords';
import UpdateTokens from './UpdateTokens';
import { Switch } from '@material-ui/core';
import { Typography } from '@material-ui/core';
// import StatisticsSummary from '../StatisticsSummary';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { setSelectedProject, fetchUserProjects } from '../../store/actions/projectActions';
import CircleLoader from '../loaders/CircleLoader';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';
// import Header from '../Header';

const styles = theme => ({
    root: {
        // backgroundColor: '#ededf4',
        paddingTop: '8px',
        margin: 0,
        width: '100%'
    }
});

class HomePage extends Component {
    state = {
        book: '',
        tokenList: '',
        token: '',
        concordance: '',
        targetLanguageId: 20,
        translationWords: '',
        tNswitchChecked: false,
        tWswitchChecked: false,
        tokenPane: 3,
        translationPane: 4,
        concordancePane: 5,
        displayConcordancePane: 'block',
        translationWordsPane: 4,
        displayTranslationWords: 'none',
        translationNotesPane: 3,
        displayTranslationNotes: 'none',
        translationNotes: '',
        displayTranslationWordSwitch: 'none',
        tokenTranslation: '',
        senses: []
    }

    updateState = (value) => {
        this.setState(value)
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(fetchUserProjects());
    }

    componentDidUpdate(prevProps) {
        if(prevProps.userProjects !== this.props.userProjects){
            const projectId = this.props.location.pathname.split('/').pop();
            const selectedProject = this.props.userProjects.filter(item => item.projectId === parseInt(projectId))
            if(selectedProject.length > 0){
                this.props.dispatch(setSelectedProject(selectedProject[0]));
            }
        }
    }

    handleTNSwitchChange = e => {
        const { tNswitchChecked } = this.state
        if (tNswitchChecked) {
            this.setState({
                tNswitchChecked: !tNswitchChecked,
                tokenPane: 3,
                translationPane: 4,
                concordancePane: 5,
                displayTranslationNotes: 'none',
                displayTranslationWordSwitch: 'none',
                displayTranslationWords: 'none',
                displayConcordancePane: 'block',
                tWswitchChecked: false

            })
        } else {
            this.setState({
                tNswitchChecked: !tNswitchChecked,
                tokenPane: 2,
                translationPane: 3,
                concordancePane: 4,
                displayTranslationNotes: 'block',
                displayTranslationWordSwitch: 'block'
            })
        }
    }

    handleTWSwitchChange = e => {
        const {
            tWswitchChecked,
        } = this.state
        if (!tWswitchChecked) {
            this.setState({
                tWswitchChecked: !tWswitchChecked,
                displayConcordancePane: 'none',
                displayTranslationWords: 'block',
                // displayTranslationWordSwitch:'block'
            })
        } else {
            this.setState({
                tWswitchChecked: !tWswitchChecked,
                displayConcordancePane: 'block',
                displayTranslationWords: 'none',
                // displayTranslationWordSwitch:'none'
            })
        }
    }

    render() {
        const { classes, isFetching } = this.props
        const {
            // book,
            // token,
            // tokenTranslation,
            // senses,
            // concordance,
            tokenPane,
            // tokenList,
            translationPane,
            concordancePane,
            displayConcordancePane,
            translationWordsPane,
            // translationWords,
            translationNotesPane,
            // translationNotes,
            displayTranslationWordSwitch
        } = this.state
        console.log('homepage', this.props)
        return (
            <Grid container spacing={2} className={classes.root}>
                {/* <Grid container> */}
                { isFetching && <CircleLoader />}
                <Grid item xs={3} style={{minHeight: '480px'}}>
                    <Grid item xs={12}>
                        <MenuBar
                            updateState={this.updateState}
                        />
                    </Grid>
                    {/* <Grid container alignItems="center" justify="center" item xs={2}> */}
                    {/* <Grid item xs={3}>
                        <Grid container>
                            <Grid itm xs={8}>
                                
                                <Typography variant="subtitle2" color="textSecondary" style={{ display: displayTranslationWordSwitch }}>
                                Translation Words
                                </Typography>
                            </Grid>
                            <Grid itm xs={4}>
                                <div style={{ display: displayTranslationWordSwitch }}>
                                    <Switch
                                        checked={this.state.tWswitchChecked}
                                        onChange={this.handleTWSwitchChange}
                                    />
                                </div>
                            </Grid>
                        </Grid>
                        
                        
                    </Grid> */}
                    {/* <Grid container alignItems="center" justify="flex-end" item xs={3}> */}
                    {/* <Grid item xs={3}>
                        <Grid container>
                            <Grid itm xs={8}>
                                
                                <Typography variant="subtitle2" color="textSecondary" >
                                    Translation Helps
                                </Typography>
                            </Grid>
                            <Grid itm xs={4}>
                                <Switch
                                checked={this.state.tNswitchChecked}
                                onChange={this.handleTNSwitchChange}
                                />
                            </Grid>
                        </Grid>
                        
                    </Grid> */}
                {/* </Grid> */}
                {/* <Grid container item xs={12}> */}
                    {/* <Grid item xs={12}> */}
                        <TokenList />
                    {/* </Grid> */}
                    </Grid>
                    <Grid item xs={4}>
                    {/* <Grid item xs={12}> */}
                        <UpdateTokens />
                    {/* </Grid> */}
                    {/* <Grid item xs={12} > */}
                        <TranslationsWords />
                    {/* </Grid> */}
                    </Grid>

                    <Grid item xs={5}>
                    <Grid item xs={12}
                        // style={{ display: displayConcordancePane }}
                    >
                        <Concordance />
                    </Grid>
                    <Grid item xs={12} >
                        <TranslationsNotes />
                    </Grid>
                    </Grid>
                {/* </Grid> */}
            </Grid>
        )
    }
}

const mapStateToProps = (state) => ({
    projects: state.project.projects,
    isFetching: state.project.isFetching,
    userProjects: state.project.userProjects
})

const mapDispatchToProps = (dispatch) => ({
    dispatch
})

// export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(HomePage))
export default compose(
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps)
 )(withRouter(HomePage))