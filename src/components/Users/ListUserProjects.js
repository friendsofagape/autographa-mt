import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Typography, CardContent } from '@material-ui/core';
import apiUrl from '../GlobalUrl';
import { Card } from '@material-ui/core';
import { CardHeader } from '@material-ui/core';


const accessToken = localStorage.getItem('access_token')

const styles = theme => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing.unit * 2
    },
    cursorPointer: {
      cursor: 'pointer',
    },
});

class ListUserProjects extends Component {
    state = {
        projectLists:[]
    }

    async getUserProjects() {
        const { updateState } = this.props
        const data = await fetch(apiUrl + '/v1/autographamt/users/projects', {
            method: 'GET',
            headers: {
                "Authorization": 'bearer ' + accessToken
            }
        })
        const userProjectsData = await data.json()
        console.log(userProjectsData)
        if (userProjectsData !== false) {
            updateState({ userProjectsData })
        }
    }
    
    async getProjectsList(){
        const data = await fetch(apiUrl + '/v1/autographamt/projects', {
            method:'GET'
        })
        const projectLists = await data.json()
        this.setState({projectLists})
    }

    componentDidMount() {
        this.getUserProjects()
        // this.getProjectsList()
    }


    handleProjects = (project) => {
        const { updateState } = this.props
        // console.log(project)
        updateState({
            selectedProject: project,
            listUserProjectsPane: false,
            displayDashboard: false,
            translationPane: true,
        })

    }

    displayProjectCards(){
        // const { projectLists } = this.state
        const { userProjectsData, classes } = this.props
        return userProjectsData.map(project => {
            return (
                <Grid item xs={12} sm={6} md={3} key={project.projectId} style={{gridRowGap:'2px'}}>
                    {/* <div className={classes.toolbar} /> */}
                    <Card onClick={() => this.handleProjects(project)} className={classes.cursorPointer}>
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

export default withStyles(styles)(ListUserProjects);
