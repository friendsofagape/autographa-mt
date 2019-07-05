import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Typography, CardContent } from '@material-ui/core';
import apiUrl from '../GlobalUrl';
import { Card } from '@material-ui/core';
import { CardHeader } from '@material-ui/core';


const styles = theme => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing.unit * 2
    },
});

class ListProjects extends Component {
    state = {
        projectLists:[]
    }

    async getProjectsList(){
        const data = await fetch(apiUrl + '/v1/autographamt/projects', {
            method:'GET'
        })
        const projectLists = await data.json()
        this.setState({projectLists})
    }

    componentDidMount(){
        this.getProjectsList()
    }

    handleProjects = (projectId) => {
        const { updateState } = this.props
        const project = this.state.projectLists.find(item => item.projectId === projectId)

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
        const { projectLists } = this.state
        return projectLists.map(project => {
            return (
                <Grid item xs={12} sm={6} md={3} key={project.projectId} style={{gridRowGap:'2px'}}>
                    <Card onClick={() => this.handleProjects(project.projectId)}>
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

    render() {
        const { classes } = this.props;
        return (

        <div className={classes.root}>
            <Grid 
                container
                spacing={16}
                style={{border:'1px solid #eee', padding:'10px'}}
                >
                    {this.displayProjectCards()}

            </Grid>
        </div>
        )
    }
}

export default withStyles(styles)(ListProjects);
