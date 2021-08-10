import React, { Component } from 'react'
import { Grid } from '@material-ui/core';
import { Typography } from '@material-ui/core'
import { connect } from 'react-redux';
import { fetchProjects } from '../store/actions/projectActions';

class StatisticsSummary extends Component {

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(fetchProjects());
    }

    render() {
        const { projects, projectId } = this.props
        var project = projects.filter(item => {
            if (item.projectId === parseInt(projectId)){
                return item
            }
        });
        project = project.length > 0 ? project[0] : {}
        return (
            <Grid container spacing={2}>
                <Grid item sm={3}>
                    <Typography align="center" variant="h5" style={{fontWeight:'bold'}}>
                        {(project.projectName) ? project.projectName.split("|")[0].toUpperCase() : null}
                    </Typography>
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = state => {
    return {
        projects: state.project.projects
    }
}

const mapDispatchToProps = dispatch => ({
    dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)((StatisticsSummary))
