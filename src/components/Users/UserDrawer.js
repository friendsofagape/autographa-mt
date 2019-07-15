import React, { Component } from 'react'
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
// import apiUrl from '../GlobalUrl';
import { Divider } from '@material-ui/core';



export default class UserDrawer extends Component {


    handleOrganisations(){
        const { updateState } =  this.props
        updateState({
            createOrganisationsPane: true
        })
    }

    listProjects() {
        const { updateState } = this.props
        updateState({
            listProjectsPane: true,
        })
    }

    handleDashboard = (text) => {
        switch (text) {
            case 'Create Organisation': this.handleOrganisations(); break;
            case 'Project Access': this.handleStatistics(); break;
            case 'Charts': this.handleCharts(); break;
            case 'My Projects': this.listProjects(); break;
            default: console.log('no choice')
        }
    }
    render() {
        const { classes } = this.props
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
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}>
                        <Typography color="inherit" className={classes.heading}>Dashboard</Typography>
                    </ExpansionPanelSummary>
                    <List>
                        {['My Projects', 'Chart'].map((text, index) => (
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
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}>
                        <Typography color="inherit" className={classes.heading}>Requests</Typography>
                    </ExpansionPanelSummary>
                    <List>
                        {['Create Organisation', 'Project Access'].map((text, index) => (
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
