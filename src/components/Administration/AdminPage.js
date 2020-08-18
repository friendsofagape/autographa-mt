import React from 'react';
import jwt_decode from 'jwt-decode';
// import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Header from '../Header';
import { Component } from 'react';
import DrawerPane from './DrawerPane';
import ListUsers from './ListUsers';
import ListOrganisations from './ListOrganisations';
import CreateProjects from '../Assignments/CreateProjects';
import ListProjects from './ListProjects';
import AssignUser from '../Assignments/AssignUser';
import CreateOrganisations from '../Assignments/CreateOrganisations';
import ListUserProjects from '../Users/ListUserProjects'
import HomePage from '../Translations/HomePage'
// import ProjectStatistics from '../Reports/ProjectStatistics'


let decoded;
// let tokenAliveFlag = false
var accessToken = localStorage.getItem('accessToken')
if (accessToken) {
    decoded = jwt_decode(accessToken)
    let currentDate = new Date().getTime()
    let expiry = decoded.exp * 1000
    // var firstName = decoded.firstName
    var hours = (expiry - currentDate) / 36e5
    if(hours > 0){
        // tokenAliveFlag = true
        console.log("logged in")
    }else{
        console.log("logged out")
    }
}

const drawerWidth = 240;

const styles = theme => ({
    root: {
        display:'flex',
        flexGrow: 1,
        // backgroundColor: '#ededf4',
        backgroundColor: '#f2f2f2ab'
    },
    exp: {
        backgroundColor: '#100f0ffa',
        '&:hover': {
            background: "#f00",
        },
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: '#262f3d'
    },
    content: {
        flexGrow: 1,
        minHeight: '100vh'
        // padding: theme.spacing(1),
    },
    toolbar: theme.mixins.toolbar,
});

class AdminPage extends Component {
    state = {
        userData: [],
        userStatus: {},
        userId: '',
        organisationsData: [],
        organisationsStatus: {},
        projectId: '',
        projectDetails: {},
        projectLists: [],
        listUsersPane: false,
        listOrganisationsPane: false,
        createOrganisationsPane: false,
        createProjectsPane: false,
        listProjectsPane: false,
        assignmentsPane: false,
        listUserProjectsPane: true,
        displayDashboard: true,
        translationPane: false,
        // projectStatisticsPane: true,
        userProjectsData: [],
        selectedProject: {},
    }

    updateState = (item) => {
        this.setState(item)
    }
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                {/* <CssBaseline /> */}
                <AppBar position="fixed" className={classes.appBar}>
                    <Header />
                </AppBar>
                {
                    (this.state.displayDashboard) ? (
                        <DrawerPane data={{
                            classes: classes,
                            updateState: this.updateState,
                            userStatus: this.state.userStatus,
                            organisationsData: this.state.organisationsData,
                            organisationsStatus: this.state.organisationsStatus
                        }} />
                    ) : null
                }
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    {(this.state.listUsersPane) ? (<ListUsers data={{
                        // classes: classes,
                        updateState: this.updateState,
                        userStatus: this.state.userStatus,
                        userData: this.state.userData
                    }} />) : null}
                    {(this.state.listOrganisationsPane) ? (<ListOrganisations data={{
                        // classes: classes,
                        updateState: this.updateState,
                        organisationsData: this.state.organisationsData,
                        organisationsStatus: this.state.organisationsStatus
                    }} />) : null}
                    <CreateProjects data={{
                        // classes: classes,
                        createProjectsPane: this.state.createProjectsPane,
                        updateState: this.updateState,
                        role: decoded.role
                    }} />
                    <CreateOrganisations
                        // classes={classes}
                        createOrganisationsPane={this.state.createOrganisationsPane}
                        updateState={this.updateState}
                    />
                    {(this.state.listProjectsPane) ? (
                        <ListProjects
                            projectLists={this.state.projectLists}
                            updateState={this.updateState}
                        />) : null}
                    {(this.state.listUserProjectsPane) ? (<ListUserProjects userProjectsData={this.state.userProjectsData} updateState={this.updateState} />) : null}
                    {(this.state.assignmentsPane) ?
                        (
                            <AssignUser
                                updateState={this.updateState}
                                projectId={this.state.projectId}
                                projectDetails={this.state.projectDetails}
                                userData={this.state.userData} />) : null
                    }
                    {
                        (this.state.translationPane) ? (
                            <HomePage selectedProject={this.state.selectedProject}
                                 />
                        ) : null
                    }
                    {/* {
                        (this.state.projectStatisticsPane) ? (
                            <ProjectStatistics />
                        ) : null
                    } */}
                </main>
            </div>
        );
    }
}

// AdminPage.propTypes = {
//     classes: PropTypes.object.isRequired,
// };

export default withStyles(styles)(AdminPage);