import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import { Checkbox, Button, Paper, List } from '@material-ui/core';
import ComponentHeading from '../ComponentHeading';
import apiUrl from '../GlobalUrl';
import { Card } from '@material-ui/core';
import { CardHeader } from '@material-ui/core';
import { Typography, CardContent } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import AddIcon from '@material-ui/icons/Add';
import ListItem from '@material-ui/core/ListItem';
import { Divider } from '@material-ui/core';
import PopUpMessages from '../PopUpMessages';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';

const styles = theme => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing.unit * 2
    },
    toolbar: theme.mixins.toolbar,
    gridSize:{
        height: 340,
        width: 300
    }
});

class AssignUser extends Component {

    state = {
        userListing: false,
        snackBarOpen: false,
        popupdata: {},
        availableBooks:[],
        assignedUsers: []
    }

    async getAvailableBooks(){
        const sourceId = this.props.projectDetails.sourceId
        const data = await fetch(apiUrl + 'v1/sources/books/' + sourceId, {
            method:'GET'
        })
        const availableBooks = await data.json()
        this.setState({availableBooks})
    }

    async getAssignedUsers(){
        const projectId = this.props.projectId
        const data = await fetch(apiUrl + 'v1/autographamt/projects/assignments/' + projectId, {
            method:'GET'
        })
        const assignedUsers = await data.json()
        if(!assignedUsers.message){
            this.setState({assignedUsers})
        }
    }

    componentDidMount(){
        this.getAvailableBooks()
        this.getAssignedUsers()
    }

    componentDidUpdate(){
        this.getAssignedUsers()
    }

    addUser(){
        this.setState({userListing:true})
    }

    closeSnackBar = (item) => {
        this.setState(item)
    }

    async assignUserToProject(apiData){
        console.log(apiData)
        console.log(apiUrl + '/v1/autographamt/projects/assignments')
        try{
            const data = await fetch(apiUrl + 'v1/autographamt/projects/assignments', {
                method:'POST',
                body: JSON.stringify(apiData)
            })
            const myJson = await data.json()
            // this.setState({})
        }catch(ex){
            this.setState({ 
                snackBarOpen: true, 
                popupdata: { 
                    variant: "error", 
                    message: "Server Error", 
                    snackBarOpen: true, 
                    closeSnackBar: this.closeSnackBar 
                } 
            })
        }
    }


    selectUser = (userId) => {
        const { projectId } =  this.props
        const apiData = {
            projectId: projectId,
            userId:userId,
            books:[],
            action:'add'
        }
        this.assignUserToProject(apiData)
    }
    handleClose = () => {
        this.setState({userListing: false})
    }

    getUserNames = () => {
        const { userData } = this.props
        return userData.map(user => {
            return (
                <div key={user.userId}>
                <ListItem button onClick={() => this.selectUser(user.userId)} >{user.firstName + " " + user.lastName}</ListItem>
                <Divider />
                </div>
            )
        })
    }

    async deleteUser(apiData){
        const data = await fetch(apiUrl + 'v1/autographamt/projects/assignments', {
            method:'DELETE',
            body:JSON.stringify(apiData)
        })
        const response = await data.json()
        if(response.success){
            this.setState({ 
                snackBarOpen: true, 
                popupdata: { 
                    variant: "success", 
                    message: response.message, 
                    snackBarOpen: true, 
                    closeSnackBar: this.closeSnackBar 
                } 
            })
            
        }else{
            this.setState({ 
                snackBarOpen: true, 
                popupdata: { 
                    variant: "error", 
                    message: response.message, 
                    snackBarOpen: true, 
                    closeSnackBar: this.closeSnackBar 
                } 
            })

        }
    }

    handleDelete = (userId, projectId) => {
        const apiData = {
            userId: userId,
            projectId: projectId
        }
        this.deleteUser(apiData)
    }
    displayAssignedUsers = () => {
        const { assignedUsers } = this.state
        console.log(assignedUsers)
        return assignedUsers.map(user => {
            const { userName, email, userId } = user.user
            return (
                <TableRow>
                    <TableCell align="right">{ userName }</TableCell>
                    <TableCell align="right">{ email }</TableCell>
                    <TableCell align="right"><Button variant="contained" color="primary">Books</Button></TableCell>
                    <TableCell align="right"><Button small onClick={() => this.handleDelete(userId, user.projectId)}><DeleteOutlinedIcon  /></Button></TableCell>
                </TableRow>)
        })
    }


    render() {
        const { classes, projectDetails, userData } = this.props
        const { userListing, popupdata } = this.state
        return (

            <div className={classes.root}>
                <Grid
                    container
                    spacing={16}
                    style={{ border: '1px solid #eee', padding: '10px' }}
                >
                    <Grid item xs={12} style={{ gridRowGap: '2px' }}>
                        <Card>
                            <CardHeader
                                title={projectDetails.projectName.split("|")[0]}
                                subheader={projectDetails.organisationName} />
                            <CardContent>
                                <Typography varian="h5" gutterBottom>
                                    {projectDetails.projectName.split("|")[1]}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    {/* {this.displayProjectCards()} */}

                </Grid>
                {/* <div className={classes.toolbar} /> */}
                <Button 
                onClick={() => this.addUser()} 
                variant="contained" color="primary" 
                style={{
                    marginLeft:'85%', 
                    marginBottom:'2%', 
                    marginTop:'2%'
                    }}>
                <AddIcon />
                Add User</Button>
                <Paper>
                    <ComponentHeading data={{ classes: classes, text: "Users List", styleColor: "#2a2a2fbd" }} />
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="right">User Name</TableCell>
                                <TableCell align="right">Email Id</TableCell>
                                <TableCell align="right">Books Assined</TableCell>
                                <TableCell align="right">Remove User</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.displayAssignedUsers()}
                        </TableBody>
                    </Table>
                </Paper>
                {(this.state.snackBarOpen) ? (<PopUpMessages data={this.state.popupdata} />) : null}
                <Dialog
                    open={userListing}
                    // onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <ComponentHeading data={{classes:classes, text:"Add User", styleColor:'#2a2a2fbd'}} />
                    <DialogTitle id="form-dialog-title"> </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Select User
                    </DialogContentText>
                        <List className={classes.gridSize}>
                            {this.getUserNames()}
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} variant="contained" color="secondary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default withStyles(styles)(AssignUser);