import React, { Component } from 'react'
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


let decoded;
var role;
// let tokenAliveFlag = false
var accessToken = localStorage.getItem('access_token')
if (accessToken) {
    decoded = jwt_decode(accessToken)
    role = decoded.role
}
var drawerItems;
if(role === 'sa'){
    drawerItems = ['List Organisations', 'List Users', 'List Projects', 'Create Projects', 'Create Organisation']
}else{
    drawerItems = ['List Users', 'List Projects', 'Create Projects', 'Create Organisation']
}

export default class DrawerPane extends Component {


    async getUsers(){
        const {updateState, userStatus} = this.props.data
        const data = await fetch(apiUrl + '/v1/autographamt/users', {
            method:'GET'
        })
        const userData = await data.json()
        userData.map(item => {
            if(item.roleId > 1){
                userStatus[item.userId] = {
                    "admin":true,
                    "verified":item.verified
                }
            }else{
                userStatus[item.userId] = {
                    "admin":false,
                    "verified":item.verified
                }
            }
        })
        updateState({userData:userData, userStatus:userStatus})
    }

    componentDidMount(){
        this.getUsers()
    }
    
    handleUsers(){
        const {updateState} = this.props.data
        updateState({
            listUsersPane: true, 
            listOrganisationsPane:false,
            createProjectsPane:false,
            listProjectsPane: false,
            assignmentsPane: false,
        })
        // this.displayUsers()
    }

    async getOrganisations(){
        const {updateState, organisationsStatus} = this.props.data

        const data = await fetch(apiUrl + '/v1/autographamt/organisations', {
            method:'GET'
        })
        const organisationsData = await data.json()
        console.log(organisationsData, organisationsStatus)
        organisationsData.map(item => {
            organisationsStatus[item.organisationId] = {
                "verified":item.verified
            }
        })
        updateState({
            organisationsStatus:organisationsStatus, 
            organisationsData: organisationsData, 
            listOrganisationsPane:true, 
            listUsersPane: false,
            createProjectsPane:false,
            listProjectsPane: false,
            assignmentsPane: false,
        })
    }

    handleOrganisations(){
        this.getOrganisations()
    }

    createProjects(){
        const {updateState} = this.props.data
        updateState({createProjectsPane:true})
    }



    createOrganisations(){
        const {updateState} = this.props.data
        updateState({createOrganisationsPane:true})
    }

    listProjects(){
        const {updateState} = this.props.data
        updateState({
            listProjectsPane:true, 
            listUsersPane: false,
            listOrganisationsPane:false,
            createProjectsPane:false,
            assignmentsPane: false,
        })
    }

    handleDashboard = (text) => {
        switch(text){
            case 'List Organisations': this.handleOrganisations(); break;
            case 'Assignments': this.handleStatistics(); break;
            case 'Create Organisation': this.createOrganisations(); break;
            case 'List Users': this.handleUsers(); break;
            case 'Statistics': this.handleStatistics(); break;
            case 'Charts': this.handleCharts(); break;
            case 'Create Projects': this.createProjects(); break;
            case 'List Projects': this.listProjects(); break;
        }
    }
    render() {
        const {classes} = this.props.data
        return (
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.toolbar} />
                <ExpansionPanel style={{ backgroundColor: '#2a2a2fbd', color: 'white' }}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon style={{color:'white'}} />}>
                        <Typography color="inherit" className={classes.heading}>Dashboard</Typography>
                    </ExpansionPanelSummary>
                    <List>
                        {['Statistics', 'My Projects', 'Chart'].map((text, index) => (
                            <ListItem button key={text} className={classes.exp}>
                                <ListItemText disableTypography divider="true"
                                    primary={<Typography type="body2" style={{ color: '#FFFFFF' }}
                                    onClick={() => this.handleDashboard(text)}
                                    >{text}</Typography>}
                                />
                            </ListItem>
                        ))}
                    </List>
                </ExpansionPanel>
                <Divider />
                <ExpansionPanel style={{ backgroundColor: '#2a2a2fbd', color: 'white' }}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon style={{color:'white'}} />}>
                        <Typography color="inherit" className={classes.heading}>Manager</Typography>
                    </ExpansionPanelSummary>
                    <List>
                        {drawerItems.map((text, index) => (
                            <ListItem button key={text} className={classes.exp}>
                                <ListItemText disableTypography divider="true"
                                    primary={<Typography type="body2" style={{ color: '#FFFFFF' }}
                                    onClick={() => this.handleDashboard(text)}
                                    >{text}</Typography>}
                                />
                            </ListItem>
                        ))}
                    </List>
                </ExpansionPanel>
            </Drawer>
        )
    }
}
