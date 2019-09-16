import React from 'react';
import { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Header from '../Header';
import UserDrawer from './UserDrawer';
import ListUserProjects from './ListUserProjects';
import HomePage from '../Translations/HomePage';
import CreateOrganisations from '../Assignments/CreateOrganisations';


const drawerWidth = 240;

const styles = theme => ({
    root: {
        display: 'flex',
        flexGrow: 1,
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
        padding: theme.spacing(1),
    },
    toolbar: theme.mixins.toolbar,
});

class UserDashboard extends Component {
    state = {
        userProjectsData: [],
        listUserProjectsPane: true,
        displayDashboard: true,
        translationPane: false,
        createOrganisationsPane: false,
        selectedProject: {}

    }

    updateState = (item) => {
        this.setState(item)
    }
    render() {
        const { classes } = this.props;
        const { 
            displayDashboard, 
            listUserProjectsPane,
            translationPane,
            selectedProject,
            createOrganisationsPane
        } = this.state
        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="fixed" className={classes.appBar}>
                    <Header  />
                </AppBar>
                {
                    (displayDashboard) ? (
                    <UserDrawer
                        classes={classes}
                        updateState={this.updateState}
                    />
                    ) : null
                }
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    {(listUserProjectsPane) ? (
                        <ListUserProjects
                            updateState={this.updateState}
                        />
                    ) : null}
                    {
                        (translationPane) ? (
                            <HomePage selectedProject={selectedProject}
                            classes={classes} />
                        ) : null
                    }
                    {
                        (createOrganisationsPane) ? (
                            <CreateOrganisations selectedProject={selectedProject}
                            createOrganisationsPane={createOrganisationsPane}
                            classes={classes}
                            updateState={this.updateState} />
                        ) : null
                    }
                </main>
            </div>
        );
    }
}

// AdminPage.propTypes = {
//     classes: PropTypes.object.isRequired,
// };

export default withStyles(styles)(UserDashboard);