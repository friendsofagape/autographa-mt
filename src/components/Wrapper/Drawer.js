import React, { Component, Fragment } from 'react'
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import apiUrl from '../GlobalUrl';
import { Divider } from '@material-ui/core';
import jwt_decode from 'jwt-decode';
import { Redirect, Route, Switch, BrowserRouter } from 'react-router-dom';
import { menus } from '../api/menu';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Toolbar } from '@material-ui/core';
import compose from "recompose/compose";
import { withStyles } from '@material-ui/styles';


let decoded;
var role;
// let tokenAliveFlag = false
var accessToken = localStorage.getItem('accessToken')
if (accessToken) {
    decoded = jwt_decode(accessToken)
    role = decoded.role
}
var drawerItems;
if (role === 'sa') {
    drawerItems = ['List Organisations', 'List Users', 'List Projects', 'Create Projects', 'Create Organisation']
} else {
    drawerItems = ['List Users', 'List Projects', 'Create Projects', 'Create Organisation']
}
console.log('menus', menus)



const styles = theme => ({
    // root: {
    //   display: 'flex'
    // },
    // appBar: {
    //   zIndex: 1201,
    // },
    drawer: {
      width: 170,
      flexShrink: 0,
    },
    drawerPaper: {
      width: 160,
      backgroundColor: 'black'
    },
    drawerContainer: {
      overflow: 'auto',
    },
    content: {
      flexGrow: 1,
      // padding: theme.spacing(3),
    },
  });

class DrawerPane extends Component {
    state = {
        expanded: 'translations'
    }

    // async getUsers(){
    //     const {updateState, userStatus} = this.props.data
    //     const data = await fetch(apiUrl + '/v1/autographamt/users', {
    //         method:'GET',
    //         headers: {
    //             "Authorization": 'bearer ' + accessToken
    //         }
    //     })
    //     const userData = await data.json()
    //     userData.map(item => {
    //         if(item.roleId > 1){
    //             userStatus[item.userId] = {
    //                 "admin":true,
    //                 "verified":item.verified
    //             }
    //         }else{
    //             userStatus[item.userId] = {
    //                 "admin":false,
    //                 "verified":item.verified
    //             }
    //         }
    //     })
    //     updateState({userData:userData, userStatus:userStatus})
    // }

    // componentDidMount(){
    //     this.getUsers()
    // }

    async getOrganisations() {
        const { updateState, organisationsStatus } = this.props.data

        const data = await fetch(apiUrl + '/v1/autographamt/organisations', {
            method: 'GET',
            headers: {
                Authorization: 'bearer ' + accessToken
            }
        })
        const organisationsData = await data.json()
        organisationsData.map(item => {
            organisationsStatus[item.organisationId] = {
                "verified": item.verified
            }
        })
        updateState({
            organisationsStatus: organisationsStatus,
            organisationsData: organisationsData,
            listOrganisationsPane: true,
            listUsersPane: false,
            createProjectsPane: false,
            listProjectsPane: false,
            assignmentsPane: false,
            listUserProjectsPane: false,
        })
    }

    handleDashboard = (text) => {
        switch (text) {
            case 'List Organisations': this.handleOrganisations(); break;
            case 'Assignments': this.handleStatistics(); break;
            case 'Create Organisation': this.createOrganisations(); break;
            case 'List Users': this.handleUsers(); break;
            case 'Statistics': this.handleStatistics(); break;
            case 'Charts': this.handleCharts(); break;
            case 'Create Projects': this.createProjects(); break;
            case 'List Projects': return '/projects'; break;
            case 'My Projects': this.listMyProjects(); break;
        }
    }
    checkWhat = (text) => {
        const { history } = this.props;
        console.log(this.handleDashboard(text))
        console.log(history.push(this.handleDashboard(text)))
    }
    render() {
        const { classes, current_user } = this.props
        const { expanded } = this.state;
        return (
                <div>
                {
                    menus.map(menu => {
                        if(menu.roles.includes(current_user.role)){
                            return (
                                <Drawer
                                className={classes.drawer}
                                variant="permanent"
                                classes={{
                                  paper: classes.drawerPaper,
                                }}
                                >

                                <Toolbar />
                            <div className={classes.drawerContainer}>
                                   <List>
                                        {
                                            menu.child &&
                                            menu.child.map(childMenu => {
                                                if(childMenu.roles.includes(current_user.role)) {
                                                    return (
                                                        <Link to={childMenu.link} key={childMenu.key} style={{textDecoration: 'none'}}>
                                                            <ListItem button key={childMenu.key} className={classes.exp}
                                                            // onClick={(e) => this.checkWhat(text)}
                                                            >
                                                                <ListItemText disableTypography divider="true"
                                                                    primary={<Typography variant="caption" style={{ color: 'white' }}
        
                                                                    >{childMenu.name}</Typography>}
                                                                />
                                                            </ListItem>
                                                        </Link>
                                                    )
                                                }
                                                
                                            })
                                        }
                                    </List>
                                    </div>
                                    </Drawer>
                            )
                        }
                        
                    })
                }
                </div>

                
        )
    }
}

const mapStateToProps = state => ({
    current_user: state.auth.current_user
});


export default connect(mapStateToProps)(withStyles(styles)(DrawerPane));