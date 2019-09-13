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
import HowToRegIcon from '@material-ui/icons/HowToReg';
import StatisticsSummary from '../StatisticsSummary';

const styles = theme => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(2),
        // backgroundColor: '#383c5d',
        // backgroundColor: '#f8f8fa',
        // backgroundColor: '#ededf4',
        // height: '100vh'
    },
    toolbar: theme.mixins.toolbar,
    gridSize: {
        height: 340,
        width: 300
    },
    listItem: {
        border: '1px solid #eee',
    },
    checkBox: {
        // backgroundColor: '#383c5d',
        // backgroundColor: '#5b3a89',
        // padding:'10px',
        // color: '#fff',
        border: '1px solid #eee',
        // border: '1px solid #eee',
        // padding: '10px'
        // backgroundColor: '#141c29'
    },
    statisticsPane: {
        // backgroundColor: '#383c5d',
        // backgroundColor: '#fff',
        // backgroundColor: '#626ed4',
        // padding: '10px',
        // color: '#fff',
        // border: '1px solid #eee',
        // borderRadius: '5px',
        minHeight: '50px'
    }
});

const accessToken = localStorage.getItem('accessToken')

class AssignUser extends Component {

    state = {
        userListing: false,
        listBooks: false,
        availableBooks: [],
        assignedUsers: [],
        availableBooksData: {},
        userId: '',
        projectId: '',
        userStatus: {},
        userData: [],
        statistics: null
    }

    async getUsers() {
        const { userStatus } = this.state
        const data = await fetch(apiUrl + '/v1/autographamt/users', {
            method: 'GET',
            headers: {
                "Authorization": 'bearer ' + accessToken
            }
        })
        const userData = await data.json()
        if ("success" in userData) {
            this.props.displaySnackBar({
                snackBarMessage: userData.message,
                snackBarOpen: true,
                snackBarVariant: (userData.success) ? "success" : "error"
            })
        } else {
            userData.map(item => {
                if (item.roleId > 1) {
                    userStatus[item.userId] = {
                        "admin": true,
                        "verified": item.verified
                    }
                } else {
                    userStatus[item.userId] = {
                        "admin": false,
                        "verified": item.verified
                    }
                }
            })
            this.setState({ userData: userData, userStatus: userStatus })
        }
    }

    async getAssignedUsers() {
        const { projectId } = this.props.project
        console.log(this.props)
        const data = await fetch(apiUrl + 'v1/autographamt/projects/assignments/' + projectId, {
            method: 'GET',
            headers: {
                Authorization: 'bearer ' + accessToken
            }
        })
        const assignedUsers = await data.json()
        if (!assignedUsers.message) {
            this.setState({ assignedUsers })
        }
    }

    componentDidMount() {
        this.getUsers()
        this.getAssignedUsers()
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps)
        const { project } = nextProps
        const { statistics } = this.state
        if (statistics === null) {
            this.getProjectStatistcs(project)
        }
    }


    addUser() {
        this.setState({ userListing: true })
    }

    async assignUserToProject(apiData) {
        try {
            const data = await fetch(apiUrl + 'v1/autographamt/projects/assignments', {
                method: 'POST',
                body: JSON.stringify(apiData)
            })
            const myJson = await data.json()
            this.props.displaySnackBar({
                snackBarMessage: myJson.message,
                snackBarOpen: true,
                snackBarVariant: "success"
            })
            this.getAssignedUsers()
        } catch (ex) {
            this.props.displaySnackBar({
                snackBarMessage: "Server Error",
                snackBarOpen: true,
                snackBarVariant: "error"
            })
        }
    }

    selectUser = (userId) => {
        const { projectId } = this.props.project
        const apiData = {
            projectId: projectId,
            userId: userId,
            books: [],
            // action:'add'
        }
        this.assignUserToProject(apiData)
    }

    closeUserListing = () => {
        this.setState({ userListing: false })
    }

    closeBookListing = () => {
        this.setState({ userId: '', projectId: '', listBooks: false })
    }

    getUserNames = () => {
        const { userData } = this.state
        return userData.map(user => {
            return (
                <div key={user.userId}>
                    <ListItem className={this.props.classes.listItem} button onClick={() => this.selectUser(user.userId)} >{user.firstName + " " + user.lastName}</ListItem>
                    <Divider />
                </div>
            )
        })
    }

    async deleteUser(apiData) {
        const data = await fetch(apiUrl + 'v1/autographamt/projects/assignments', {
            method: 'DELETE',
            body: JSON.stringify(apiData)
        })
        const response = await data.json()
        if (response.success) {
            this.props.displaySnackBar({
                snackBarMessage: response.message,
                snackBarOpen: true,
                snackBarVariant: "success"
            })
            this.getAssignedUsers()


        } else {
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


    async getUserBooks(userId) {
        try {
            const { projectId } = this.props.project
            const data = await fetch(apiUrl + 'v1/sources/projects/books/' + projectId + '/' + userId, {
                method: 'GET'
            })
            const response = await data.json()
            this.setState({
                listBooks: true,
                availableBooksData: response,
            })
            this.props.displaySnackBar({
                snackBarMessage: "Books Fetched",
                snackBarOpen: true,
                snackBarVariant: "success"
            })
        }
        catch (ex) {
            this.props.displaySnackBar({
                snackBarMessage: "Server Error",
                snackBarOpen: true,
                snackBarVariant: "error"
            })

        }
    }

    handleSelectBooks = (userId, projectId) => {
        this.setState({ userId, projectId })
        this.getUserBooks(userId)
    }

    displayAssignedUsers = () => {
        const { assignedUsers } = this.state
        return assignedUsers.map(user => {
            const { userName, email, userId } = user.user
            return (
                <TableRow key={userId}>
                    <TableCell align="right">{userName}</TableCell>
                    <TableCell align="right">{email}</TableCell>
                    <TableCell align="right"><Button size="small" variant="contained" color="primary" onClick={() => this.handleSelectBooks(userId, user.projectId)}>Books</Button></TableCell>
                    <TableCell align="right"><Button small="true" onClick={() => this.handleDelete(userId, user.projectId)}><DeleteOutlinedIcon /></Button></TableCell>
                </TableRow>)
        })
    }

    handleBooksChecked = (book) => {
        const { availableBooksData } = this.state
        const value = availableBooksData[book]["assigned"]
        availableBooksData[book]["assigned"] = !value
        this.setState({ availableBooksData })
    }

    displayBooks = () => {
        const { availableBooksData } = this.state
        const allBooks = Object.keys(availableBooksData)
        return allBooks.map(book => {
            return (
                <Grid item xs={2} className={this.props.classes.checkBox}>
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
                </Grid>
            )
        })
    }

    assignBooksToUser = () => {
        const { userId, availableBooksData } = this.state
        const { projectId } = this.props.project

        const checkedBooks = Object.keys(availableBooksData).filter(book => availableBooksData[book]["assigned"] === true)

        const apiData = {
            projectId: projectId,
            userId: userId,
            books: checkedBooks,
            // action:'add'
        }
        this.assignUserToProject(apiData)
    }


    render() {
        const { classes } = this.props
        const projectDetails = this.props.project
        const { userListing, listBooks } = this.state
        const { statistics } = this.state
        console.log(this.props)
        console.log(this.state)
        return (

            <div className={classes.root}>
                <Grid
                    item xs={12}
                    className={classes.statisticsPane}
                >
                    <StatisticsSummary />
                </Grid>
                {/* <div className={classes.toolbar} /> */}
                <Button
                    onClick={() => this.addUser()}
                    variant="contained" color="primary"
                    style={{
                        marginLeft: '85%',
                        marginBottom: '2%',
                        marginTop: '2%'
                    }}>
                    <AddIcon />
                    Add User</Button>
                <Paper>
                    {/* <ComponentHeading data={{ classes: classes, text: "Users List", styleColor: "#2a2a2fbd" }} /> */}
                    <ComponentHeading data={{ classes: classes, text: "Users List", styleColor: "#fff", color:'black' }} />
                    <Divider />
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
                    onClose={this.closeUserListing}
                    aria-labelledby="form-dialog-title"
                >
                    {/* <ComponentHeading data={{ classes: classes, text: "Add User", styleColor: '#2a2a2fbd' }} /> */}
                    <ComponentHeading data={{ classes: classes, text: "Add User", styleColor: '#2e639a' }} />
                    <DialogTitle id="form-dialog-title"> </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <Typography variant="body1">Select User</Typography>
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
                >
                    <DialogContent>
                        <Grid container item spacing={1}>
                        {this.displayBooks()}
                        </Grid>
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

const mapStateToProps = state => {
    return {
        project: state.sources.project
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        displaySnackBar: (popUp) => dispatch(displaySnackBar(popUp))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AssignUser))