import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Typography, CardContent } from '@material-ui/core';
import apiUrl from '../GlobalUrl';
import { Card } from '@material-ui/core';
import { CardHeader } from '@material-ui/core';
import { selectProject, displaySnackBar } from '../../store/actions/sourceActions';
import { connect } from 'react-redux';
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

class ListUserProjects extends Component {
    state = {
        projects: null,
        userProjectsData: [],
    }

    async getProjectData() {
        try {
            const data = await fetch(apiUrl + 'v1/autographamt/users/projects', {
                method: 'GET',
                headers: {
                    Authorization: 'bearer ' + accessToken
                }
            })
            const response = await data.json()
            if ('success' in response) {
                this.props.displaySnackBar({
                    snackBarMessage: response.message,
                    snackBarOpen: true,
                    snackBarVariant: "error"
                })
            } else {
                this.setState({ projects: response })
            }
        }
        catch (ex) {
            this.props.displaySnackBar({
                snackBarMessage: "Server Error",
                snackBarOpen: true,
                snackBarVariant: "error"
            })
        }
    }


    componentDidMount() {
        this.getProjectData()
    }


    handleProjects = (project) => {
        const { updateState } = this.props
        if (project.books.length > 0) {
            updateState({
                listUserProjectsPane: false,
                displayDashboard: false,
                translationPane: true,
            })
            this.props.selectProject({ project: project })

        } else {
            this.props.displaySnackBar({
                snackBarMessage: "No Books assigned yet",
                snackBarOpen: true,
                snackBarVariant: "error"
            })
        }
    }

    displayProjectCards() {
        const { projects } = this.state
        const { classes } = this.props
        if (projects) {
            return projects.map(project => {
                return (
                    <Grid item xs={12} sm={6} md={3} key={project.projectId} style={{ gridRowGap: '2px' }}>
                        {/* <div className={classes.toolbar} /> */}
                        <Card onClick={() => this.handleProjects(project)} className={classes.cursorPointer}>
                            <CardHeader
                                title={`Organisation: ${project.organisationName}`}
                                subheader={`Organisation: ${project.organisationName}`} />
                            <CardContent>
                                <Typography varian="h5" gutterBottom>
                                    {project.projectName.split("|")[0]}
                                </Typography>
                                <Typography varian="h5" gutterBottom>
                                    {project.version.name}
                                </Typography>
                                <Typography varian="h5" gutterBottom>
                                    {project.projectName.split("|")[1]}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                )
            })
        } else {
            return <Typography variant="h5">No projects assigned</Typography>
        }
    }

    render() {
        const { classes } = this.props;
        return (

            <div className={classes.root}>
                <Grid
                    container
                    spacing={1}
                    style={{ border: '1px solid #eee', padding: '10px' }}
                >
                    {this.displayProjectCards()}
                <PopUpMessages />
                </Grid>
            </div>
        )
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        selectProject: (project) => dispatch(selectProject(project)),
        displaySnackBar: (popUp) => dispatch(displaySnackBar(popUp)),
    }
}

export default connect(null, mapDispatchToProps)(withStyles(styles)(ListUserProjects))
