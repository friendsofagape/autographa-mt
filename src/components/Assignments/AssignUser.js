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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { displaySnackBar } from '../../store/actions/sourceActions';
import { connect } from 'react-redux'

const styles = theme => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(2)
    },
    toolbar: theme.mixins.toolbar,
    gridSize:{
        height: 340,
        width: 300
    }
});

const accessToken = localStorage.getItem('accessToken')

class AssignUser extends Component {

    state = {
        userListing: false,
        listBooks: false,
        availableBooks:[],
        assignedUsers: [],
        availableBooksData: {},
        userId:'',
        projectId: '',
        userStatus: {},
        userData: []
    }

    async getUsers(){
        const { userStatus} = this.state
        const data = await fetch(apiUrl + '/v1/autographamt/users', {
            method:'GET',
            headers: {
                "Authorization": 'bearer ' + accessToken
            }
        })
        const userData = await data.json()
        console.log(userData)
        if("success" in userData){
            this.props.displaySnackBar({
                snackBarMessage: userData.message,
                snackBarOpen: true,
                snackBarVariant: (userData.success) ? "success" : "error"
            })
        }else{
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
            this.setState({userData:userData, userStatus:userStatus})
        }
    }

    async getAssignedUsers(){
        console.log('Im getting')
        const projectId = this.props.projectId
        const data = await fetch(apiUrl + 'v1/autographamt/projects/assignments/' + projectId, {
            method:'GET',
            headers: {
                Authorization: 'bearer ' + accessToken
            }
        })
        const assignedUsers = await data.json()
        if(!assignedUsers.message){
            console.log('got and now setting')
            this.setState({assignedUsers})
        }
    }

    componentDidMount(){
        this.getUsers()
        this.getAssignedUsers()
    }

    // componentDidUpdate(){
    //     this.getAssignedUsers()
    // }

    addUser(){
        this.setState({userListing:true})
    }

    async assignUserToProject(apiData){
        // console.log(apiData)
        // console.log(apiUrl + '/v1/autographamt/projects/assignments')
        try{
            const data = await fetch(apiUrl + 'v1/autographamt/projects/assignments', {
                method:'POST',
                body: JSON.stringify(apiData)
            })
            const myJson = await data.json()
            this.props.displaySnackBar({
                snackBarMessage: myJson.message,
                snackBarOpen: true,
                snackBarVariant: "success"
            })
            this.getAssignedUsers()
        }catch(ex){
            this.props.displaySnackBar({
                snackBarMessage: "Server Error",
                snackBarOpen: true,
                snackBarVariant: "error"
            })
        }
    }

    selectUser = (userId) => {
        const { projectId } =  this.props
        const apiData = {
            projectId: projectId,
            userId:userId,
            books:[],
            // action:'add'
        }
        this.assignUserToProject(apiData)
    }

    closeUserListing = () => {
        this.setState({userListing: false})
    }

    closeBookListing = () => {
        this.setState({userId: '', projectId:'', listBooks:false})
    }

    getUserNames = () => {
        const { userData } = this.state
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
            console.log('deleted')
            this.props.displaySnackBar({
                snackBarMessage: response.message,
                snackBarOpen: true,
                snackBarVariant: "success"
            })
            this.getAssignedUsers()
            
            
        }else{
            this.props.displaySnackBar({
                snackBarMessage: response.message,
                snackBarOpen: true,
                snackBarVariant: "error"
            })

        }
    }

    handleDelete = (userId, projectId) => {
        const apiData = {
            userId: userId,
            projectId: projectId
        }
        this.deleteUser(apiData)
        this.getAssignedUsers()
    }


    async getUserBooks(userId){
        try{
            const { projectId } = this.props
            const data = await fetch(apiUrl + 'v1/sources/projects/books/' + projectId + '/' + userId, {
                method:'GET'
            })
            const response = await data.json()
            this.setState({ 
                listBooks:true, 
                availableBooksData: response,
            })
            this.props.displaySnackBar({
                snackBarMessage: "Books Fetched",
                snackBarOpen: true,
                snackBarVariant: "success"
            })
        }
        catch(ex){
            this.props.displaySnackBar({
                snackBarMessage: "Server Error",
                snackBarOpen: true,
                snackBarVariant: "error"
            })

        }
    }

    handleSelectBooks = (userId, projectId) => {
        this.setState({userId, projectId})
        this.getUserBooks(userId)
    }

    displayAssignedUsers = () => {
        const { assignedUsers } = this.state
        // console.log(assignedUsers)
        return assignedUsers.map(user => {
            const { userName, email, userId } = user.user
            return (
                <TableRow key={userId}>
                    <TableCell align="right">{ userName }</TableCell>
                    <TableCell align="right">{ email }</TableCell>
                    <TableCell align="right"><Button variant="contained" color="primary" onClick={() => this.handleSelectBooks(userId, user.projectId)}>Books</Button></TableCell>
                    <TableCell align="right"><Button small="true" onClick={() => this.handleDelete(userId, user.projectId)}><DeleteOutlinedIcon  /></Button></TableCell>
                </TableRow>)
        })
    }

    handleBooksChecked = (book) => {
        const { availableBooksData } = this.state
        const value = availableBooksData[book]["assigned"]
        availableBooksData[book]["assigned"] = !value
        this.setState({availableBooksData})
    }

    displayBooks = () => {
        const { availableBooksData } = this.state
        const allBooks = Object.keys(availableBooksData)
        return allBooks.map(book => {
            return (
                <FormControlLabel key={book}
                    control={
                        <Checkbox 
                        checked={availableBooksData[book]["assigned"]}
                        onChange={() => this.handleBooksChecked(book)}
                        value={availableBooksData[book]["assigned"]}
                        
                        />
                    }
                    label={book}
                    />
            )
        })
    }

    assignBooksToUser = () => {
        const { userId, projectId, availableBooksData } = this.state

        const checkedBooks = Object.keys(availableBooksData).filter(book => availableBooksData[book]["assigned"] === true)

        const apiData = {
            projectId: projectId,
            userId:userId,
            books:checkedBooks,
            // action:'add'
        }
        this.assignUserToProject(apiData)
    }


    render() {
        const { classes, projectDetails } = this.props
        const { userListing, listBooks } = this.state
        console.log("assigned user", this.state.assignedUsers)
        return (

            <div className={classes.root}>
                <Grid
                    container
                    spacing={1}
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
                <PopUpMessages />
                <Dialog
                    open={userListing}
                    // onClose={this.closeUserListing}
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
                        <Button onClick={this.closeUserListing} variant="contained" color="secondary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                        open={listBooks}
                        // onClose={this.closeUserListing}
                        // value={this.state.value}
                    >
                        <DialogContent>
                            {this.displayBooks()}


                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.closeBookListing} variant="contained" color="secondary">Close</Button>
                            <Button onClick={this.assignBooksToUser} variant="contained" color="primary" >Assign</Button>
                        </DialogActions>
                    </Dialog>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        displaySnackBar: (popUp) => dispatch(displaySnackBar(popUp))
    }
}

export default connect(null, mapDispatchToProps)(withStyles(styles)(AssignUser))