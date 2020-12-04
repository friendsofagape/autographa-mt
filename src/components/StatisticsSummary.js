import React, { Component } from 'react'
import { Grid } from '@material-ui/core';
import { Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import apiUrl from './GlobalUrl';
import { displaySnackBar } from '../store/actions/sourceActions';
import { fetchProjects } from '../store/actions/projectActions';
import swal from 'sweetalert';


// const styles = theme => ({
//     statisticsPane: {
//         // backgroundColor: '#626ed4',
//         backgroundColor: '#2e639a',
//         padding: '10px',
//         color: '#fff',
//         border: '1px solid #eee',
//         borderRadius: '5px'
//     },

// });

class StatisticsSummary extends Component {
    // state = {
    //     statistics: null
    // }

    // async getProjectStatistcs() {
    //     try {
    //         const { projectId } = this.props
    //         const data = await fetch(apiUrl + 'v1/autographamt/statistics/projects/' + projectId)
    //         const response = await data.json()
    //         // console.log('statistics response', response)
    //         if (response.success === false) {
    //             swal({
    //                 title: 'Statistics',
    //                 text: 'Unable to fetch statistics information: ' + response.message,
    //                 icon: 'error'
    //             })
    //             // this.props.displaySnackBar({
    //             //     snackBarMessage: response.message,
    //             //     snackBarOpen: true,
    //             //     snackBarVariant: "error"
    //             // })
    //         } else {
    //             this.setState({ statistics: response })
    //         }
    //     }
    //     catch (ex) {
    //         swal({
    //             title: 'Statistics',
    //             text: 'Unable to fetch statistics, check your internet connection or contact admin ' + ex,
    //             icon: 'error'
    //         })
    //         // this.props.displaySnackBar({
    //         //     snackBarMessage: "Server Error",
    //         //     snackBarOpen: true,
    //         //     snackBarVariant: "error"
    //         // })
    //     }
    // }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(fetchProjects());
        // this.getProjectStatistcs()
    }

    render() {
        // const { statistics } = this.state
        const { classes, projects, projectId } = this.props
        // var 
        var project = projects.filter(item => {
            console.log('item', item)
            console.log('projectId', projectId)
            if (item.projectId === parseInt(projectId)){
                return item
            }
        });
        // console.log('before project', project)
        project = project.length > 0 ? project[0] : {}
        // console.log('project', project)
        // console.log('statistics', this.props)
        return (
            <Grid container spacing={2}>
                <Grid item sm={3}>
                    <Typography align="center" variant="h5" style={{fontWeight:'bold'}}>
                        {(project.projectName) ? project.projectName.split("|")[0].toUpperCase() : null}
                    </Typography>
                    {/* <Typography align="center" variant="body1" gutterBottom>
                        {(project.projectName) ? project.version.name : null}
                    </Typography> */}
                </Grid>
                {/* <Grid item xs={3} className={classes.statisticsPane}>
                    <Typography align="center" variant="h5">
                        Project Summary
                    </Typography>
                    <Typography align="center" variant="body1" gutterBottom>
                        {(statistics) ? Object.keys(statistics.bookWiseData).length : null} Books
                    </Typography>
                </Grid> */}
                {/* <Grid item xs={3} className={classes.statisticsPane}>
                    <Typography align="center" variant="h5">
                        Completed
                    </Typography>
                    <Typography  align="center" variant="body1" gutterBottom>
                        {(statistics) ? statistics.projectData.completed : null} %
                    </Typography>
                </Grid> */}
                {/* <Grid item xs={3} className={classes.statisticsPane}>
                    <Typography align="center" variant="h5">
                        Pending
                    </Typography>
                    <Typography align="center" variant="body1" gutterBottom>
                        {(statistics) ? statistics.projectData.pending : null} %
                    </Typography>
                </Grid> */}
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
