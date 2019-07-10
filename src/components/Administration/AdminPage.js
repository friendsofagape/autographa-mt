import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Header from '../Header';
import { Component } from 'react';
import DrawerPane from './DrawerPane';
import ListUsers from './ListUsers';
import ListOrganisations from './ListOrganisations';
import CreateProjects from '../Assignments/CreateProjects';
import ListProjects from './ListProjects';
import AssignUser from '../Assignments/AssignUser';
import CreateOrganisations from '../Assignments/CreateOrganisations';


const drawerWidth = 240;

const styles = theme => ({
    root: {
        display: 'flex',
    },
    exp:{
        backgroundColor:'#100f0ffa',
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
        padding: theme.spacing.unit * 3,
    },
    toolbar: theme.mixins.toolbar,
});

class AdminPage extends Component {
    state = {
        userData: [],
        userStatus: {},
        userId:'',
        organisationsData: [],
        organisationsStatus: {},
        projectId:'',
        projectDetails:{},
        listUsersPane: false,
        listOrganisationsPane:false,
        createOrganisationsPane:false,
        createProjectsPane:false,
        listProjectsPane: false,
        assignmentsPane: false
    }

    updateState = (item) =>{
        this.setState(item)
    }
    render() {
        const { classes } = this.props;
        console.log(this.state)
        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="fixed" className={classes.appBar}>
                    <Header classes={this.props.classes} />
                </AppBar>
                <DrawerPane data={{
                    classes:classes,
                    updateState:this.updateState,
                    userStatus:this.state.userStatus,
                    organisationsData:this.state.organisationsData,
                    organisationsStatus: this.state.organisationsStatus
                }} />
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    {(this.state.listUsersPane) ? (<ListUsers data={{
                        classes:classes,
                        updateState:this.updateState,
                        userStatus:this.state.userStatus,
                        userData: this.state.userData
                        }} />) : null}
                    {(this.state.listOrganisationsPane) ? (<ListOrganisations data={{
                        classes:classes,
                        updateState:this.updateState,
                        organisationsData:this.state.organisationsData,
                        organisationsStatus: this.state.organisationsStatus
                        }} />) : null}
                    <CreateProjects data={{
                        classes:classes, 
                        createProjectsPane:this.state.createProjectsPane,
                        updateState:this.updateState
                        }} />
                    <CreateOrganisations 
                        classes={classes}
                        createOrganisationsPane={this.state.createOrganisationsPane}
                        updateState={this.updateState}
                         />
                    {(this.state.listProjectsPane) ? (<ListProjects updateState={this.updateState} />) : null}
                    {(this.state.assignmentsPane) ? 
                        (
                        <AssignUser 
                        updateState={this.updateState} 
                        projectId={this.state.projectId}
                        projectDetails={this.state.projectDetails}
                        userData={this.state.userData} />) : null
                        }
                </main>
            </div>
        );
    }
}

// AdminPage.propTypes = {
//     classes: PropTypes.object.isRequired,
// };

export default withStyles(styles)(AdminPage);