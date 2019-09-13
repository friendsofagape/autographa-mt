import React, { Component } from 'react'
import { Grid } from '@material-ui/core';
import { Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import apiUrl from './GlobalUrl';


const styles = theme => ({
    statisticsPane: {
        // backgroundColor: '#626ed4',
        backgroundColor: '#2e639a',
        padding: '10px',
        color: '#fff',
        border: '1px solid #eee',
        borderRadius: '5px'
    },

});

class StatisticsSummary extends Component {
    state = {
        statistics: null
    }

    async getProjectStatistcs() {
        try {
            const { project } = this.props
            console.log(project)
            const data = await fetch(apiUrl + 'v1/autographamt/statistics/projects/' + project.projectId)
            const response = await data.json()
            if (response.success === false) {
                this.props.displaySnackBar({
                    snackBarMessage: response.message,
                    snackBarOpen: true,
                    snackBarVariant: "error"
                })
            } else {
                this.setState({ statistics: response })
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
        this.getProjectStatistcs()
    }

    render() {
        const { statistics } = this.state
        const { classes, project } = this.props
        console.log(statistics)
        return (
            <Grid container spacing={2}>
                <Grid item xs={3} className={classes.statisticsPane}>
                    <Typography align="center" variant="h5">
                        {(project) ? project.projectName.split("|")[0] : null}
                    </Typography>
                    <Typography align="center" variant="body1" gutterBottom>
                        {(project) ? project.version.name : null}
                    </Typography>
                </Grid>
                <Grid item xs={3} className={classes.statisticsPane}>
                    <Typography align="center" variant="h5">
                        Project Summary
                    </Typography>
                    <Typography align="center" variant="body1" gutterBottom>
                        {(statistics) ? Object.keys(statistics.bookWiseData).length : null} Books
                    </Typography>
                </Grid>
                <Grid item xs={3} className={classes.statisticsPane}>
                    <Typography align="center" variant="h5">
                        Completed
                    </Typography>
                    <Typography  align="center" variant="body1" gutterBottom>
                        {(statistics) ? statistics.projectData.completed : null} %
                    </Typography>
                </Grid>
                <Grid item xs={3} className={classes.statisticsPane}>
                    <Typography align="center" variant="h5">
                        Pending
                    </Typography>
                    <Typography align="center" variant="body1" gutterBottom>
                        {(statistics) ? statistics.projectData.pending : null} %
                    </Typography>
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = state => {
    return {
        project: state.sources.project
    }
}

export default connect(mapStateToProps)(withStyles(styles)(StatisticsSummary))
