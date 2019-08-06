import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Typography, CardContent } from '@material-ui/core';
import apiUrl from '../GlobalUrl';
import { Card } from '@material-ui/core';
import { CardHeader } from '@material-ui/core';
import { displaySnackBar } from '../../store/actions/sourceActions'
import { connect } from 'react-redux'
import PopUpMessages from '../PopUpMessages';


const accessToken = localStorage.getItem('accessToken')

const styles = theme => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(2)
    },
    cursorPointer: {
      cursor: 'pointer',
    },
});

class ListProjects extends Component {
    state = {
        projectLists:[]
    }

    async getProjectsList(){
        try{
            const { updateState } = this.props
            const data = await fetch(apiUrl + '/v1/autographamt/projects', {
                method:'GET',
                headers: {
                    "Authorization": 'bearer ' + accessToken
                }
            })
            const projectLists = await data.json()
            this.setState({projectLists})
            updateState({projectLists: projectLists})
        }
        catch(ex){
            this.props.displaySnackBar({
            snackBarMessage: "Server error",
            snackBarOpen: true,
            snackBarVariant: "error"
            })
        }
    }

    componentDidMount(){
        this.getProjectsList()
    }

    handleProjects = (projectId) => {
        const { updateState, projectLists } = this.props
        const project = projectLists.find(item => item.projectId === projectId)

        updateState({
            listUsersPane: false,
            listOrganisationsPane:false,
            createProjectsPane:false,
            listProjectsPane: false,
            assignmentsPane: true,
            projectId:projectId,
            projectDetails: project
        })
    }

    displayProjectCards(){
        const { classes } = this.props
        const { projectLists } = this.state
        if(projectLists){
            return projectLists.map(project => {
                return (
                    <Grid item xs={12} sm={6} md={3} key={project.projectId} style={{gridRowGap:'3px'}}>
                        <Card onClick={() => this.handleProjects(project.projectId)} className={classes.cursorPointer}>
                            <CardHeader
                                title={`Organisation: ${project.organisationName}`}
                                subheader={`Organisation: ${project.organisationName}`} />
                            <CardContent>
                                <Typography varian="h5" gutterBottom>
                                    {project.projectName.split(" ")[0]}
                                </Typography>
                                <Typography varian="h5" gutterBottom>
                                    {project.projectName.split(" ")[1]}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                )
            })
        }
    }

    render() {
        const { classes } = this.props;
        return (
        <div className={classes.root}>
            <PopUpMessages />
            <Grid 
                container
                spacing={1}
                style={{border:'1px solid #eee', padding:'10px'}}
                >
                    {this.displayProjectCards()}
            </Grid>
        </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return{
        displaySnackBar: (popUp) => dispatch(displaySnackBar(popUp))
    }
}


export default connect(null, mapDispatchToProps)(withStyles(styles)(ListProjects));
