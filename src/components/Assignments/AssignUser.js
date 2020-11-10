import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import { Checkbox, Button, Paper, List } from "@material-ui/core";
import ComponentHeading from "../ComponentHeading";
import apiUrl from "../GlobalUrl";
import { Typography } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import AddIcon from "@material-ui/icons/Add";
import ListItem from "@material-ui/core/ListItem";
import { Divider } from "@material-ui/core";
import PopUpMessages from "../PopUpMessages";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { displaySnackBar } from "../../store/actions/sourceActions";
import { connect } from "react-redux";
import StatisticsSummary from "../StatisticsSummary";
import {
  getUserBooks,
  getAssignedUsers,
  fetchUsers,
  assignUserToProject,
  deleteUser,
} from "../../store/actions/userActions";
import compose from "recompose/compose";
import { withRouter } from "react-router-dom";
import CircleLoader from "../loaders/CircleLoader";

const styles = (theme) => ({
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
    width: 300,
  },
  listItem: {
    border: "1px solid #eee",
  },
  checkBox: {
    // backgroundColor: '#383c5d',
    // backgroundColor: '#5b3a89',
    // padding:'10px',
    // color: '#fff',
    border: "1px solid #eee",
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
    minHeight: "50px",
  },
  bookCard: {
    width: "400px",
  },
});

const accessToken = localStorage.getItem("accessToken");

class AssignUser extends Component {
  state = {
    userListing: false,
    listBooks: false,
    availableBooks: [],
    assignedUsers: [],
    availableBooksData: {},
    userId: "",
    projectId: "",
    userStatus: {},
    userData: [],
    statistics: null,
  };

  // async getUsers() {
  //     const { userStatus } = this.state
  //     const data = await fetch(apiUrl + '/v1/autographamt/users', {
  //         method: 'GET',
  //         headers: {
  //             "Authorization": 'bearer ' + accessToken
  //         }
  //     })
  //     const userData = await data.json()
  //     if ("success" in userData) {
  //         this.props.displaySnackBar({
  //             snackBarMessage: userData.message,
  //             snackBarOpen: true,
  //             snackBarVariant: (userData.success) ? "success" : "error"
  //         })
  //     } else {
  //         userData.map(item => {
  //             if (item.roleId > 1) {
  //                 userStatus[item.userId] = {
  //                     "admin": true,
  //                     "verified": item.verified
  //                 }
  //             } else {
  //                 userStatus[item.userId] = {
  //                     "admin": false,
  //                     "verified": item.verified
  //                 }
  //             }
  //         })
  //         this.setState({ userData: userData, userStatus: userStatus })
  //     }
  // }

  // async getAssignedUsers() {
  //     const { projectId } = this.props.project
  //     const data = await fetch(apiUrl + 'v1/autographamt/projects/assignments/' + projectId, {
  //         method: 'GET',
  //         headers: {
  //             Authorization: 'bearer ' + accessToken
  //         }
  //     })
  //     const assignedUsers = await data.json()
  //     if (!assignedUsers.message) {
  //         this.setState({ assignedUsers })
  //     }
  // }

  componentDidMount() {
    // this.getUsers()
    // this.getAssignedUsers()
    const { dispatch, location } = this.props;
    const projectId = location.pathname.split("/").pop();
    // console.log('project id', projectId)
    // dispatch(getUserBooks())
    dispatch(fetchUsers());
    dispatch(getAssignedUsers(projectId));
  }

  componentWillReceiveProps(nextProps) {
    const { project } = nextProps;
    const { statistics } = this.state;
    if (nextProps.userBooks !== this.props.userBooks) {
      // this.setState({})
      this.setState({ availableBooksData: this.props.userBooks });
    }
    // if (statistics === null) {
    //     this.getProjectStatistcs(project)
    // }
  }

  addUser() {
    this.setState({ userListing: true });
  }

  // async assignUserToProject(apiData) {
  //     try {
  //         const data = await fetch(apiUrl + 'v1/autographamt/projects/assignments', {
  //             method: 'POST',
  //             body: JSON.stringify(apiData)
  //         })
  //         const myJson = await data.json()
  //         this.props.displaySnackBar({
  //             snackBarMessage: myJson.message,
  //             snackBarOpen: true,
  //             snackBarVariant: "success"
  //         })
  //         this.getAssignedUsers()
  //     } catch (ex) {
  //         this.props.displaySnackBar({
  //             snackBarMessage: "Server Error",
  //             snackBarOpen: true,
  //             snackBarVariant: "error"
  //         })
  //     }
  // }

  selectUser = (userId) => {
    const { dispatch } = this.props;
    const projectId = this.props.location.pathname.split("/").pop();
    const apiData = {
      projectId: projectId,
      userId: userId,
      books: [],
      // action:'add'
    };
    // this.assignUserToProject(apiData)
    dispatch(assignUserToProject(apiData, this.closeUserListing));
  };

  closeUserListing = () => {
    this.setState({ userListing: false });
  };

  closeBookListing = () => {
    this.setState({
      userId: "",
      projectId: "",
      listBooks: false,
      availableBooksData: {},
    });
  };

  getUserNames = () => {
    const { users } = this.props;
    return users.map((user) => {
      return (
        <TableRow
          key={user.userId}
          onClick={() => this.selectUser(user.userId)}
        >
          <TableCell style={{ padding: "0px" }}>
            <ListItem button >
              {user.firstName + " " + user.lastName}
            </ListItem>
          </TableCell>
          <TableCell style={{ padding: "0px" }}>
            <ListItem button >
              {user.emailId}
            </ListItem>
          </TableCell>
          {user.roleId == "3" ? (
            <TableCell style={{ padding: "0px" }}>
              <ListItem
                button
              >
                Super Admin
              </ListItem>
            </TableCell>
          ) : null}
          {user.roleId == "2" ? (
            <TableCell style={{ padding: "0px" }}>
              <ListItem button >
                Admin
              </ListItem>
            </TableCell>
          ) : null}
          {user.roleId == "1" ? (
            <TableCell style={{ padding: "0px" }}>
              <ListItem button >
                Translator
              </ListItem>
            </TableCell>
          ) : null}
        </TableRow>
      );
    });
  };

  handleDelete = (userId, projectId) => {
    const { dispatch } = this.props;
    const apiData = {
      userId: userId,
      projectId: projectId,
    };
    dispatch(deleteUser(apiData));
  };

  async handleSelectBooks(userId, projectId) {
    const accessToken = localStorage.getItem("accessToken");
    const data = await fetch(
      apiUrl + "v1/sources/projects/books/" + projectId + "/" + userId,
      {
        method: "GET",
        headers: {
          Authorization: "bearer " + accessToken,
        },
      }
    );
    const response = await data.json();
    this.setState({
      userId,
      projectId,
      listBooks: true,
      availableBooksData: response,
    });
  }

  displayAssignedUsers = () => {
    const { assignedUsers } = this.props;
    return assignedUsers.map((user) => {
      const { userName, email, userId } = user.user;
      return (
        <TableRow key={userId}>
          <TableCell align="right">{userName}</TableCell>
          <TableCell align="right">{email}</TableCell>
          <TableCell align="right">
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={() => this.handleSelectBooks(userId, user.projectId)}
            >
              Books
            </Button>
          </TableCell>
          <TableCell align="right">
            <Button
              small="true"
              onClick={() => this.handleDelete(userId, user.projectId)}
            >
              <DeleteOutlinedIcon />
            </Button>
          </TableCell>
        </TableRow>
      );
    });
  };

  handleBooksChecked = (book) => {
    const { availableBooksData } = this.state;
    const value = availableBooksData[book]["assigned"];
    availableBooksData[book]["assigned"] = !value;
    this.setState({ availableBooksData });
  };

  displayBooks = () => {
    const { availableBooksData } = this.state;
    const { userBooks } = this.props;
    const allBooks = Object.keys(availableBooksData);
    return allBooks.map((book) => {
      return (
        <Grid item xs={2} className={this.props.classes.checkBox} key={book}>
          <FormControlLabel
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
      );
    });
  };

  assignBooksToUser = () => {
    const { userId, availableBooksData } = this.state;
    const { dispatch, location } = this.props;
    const projectId = location.pathname.split("/").pop();

    const checkedBooks = Object.keys(availableBooksData).filter(
      (book) => availableBooksData[book]["assigned"] === true
    );

    const apiData = {
      projectId: projectId,
      userId: userId,
      books: checkedBooks,
    };
    dispatch(assignUserToProject(apiData, this.closeBookListing));
  };

  render() {
    const { classes, isFetching, location } = this.props;
    const { userListing, listBooks } = this.state;
    return (
      <div className={classes.root}>
        <Grid item xs={12} className={classes.statisticsPane}>
          <StatisticsSummary projectId={location.pathname.split("/").pop()} />
        </Grid>
        <Button
          onClick={() => this.addUser()}
          variant="contained"
          color="primary"
          style={{
            marginLeft: "85%",
            marginBottom: "2%",
            marginTop: "2%",
          }}
        >
          <AddIcon />
          Add User
        </Button>

        {/* open box for adding users (list) */}
        <Dialog
          open={userListing}
          onClose={this.closeUserListing}
          aria-labelledby="form-dialog-title"
        >
          {isFetching && <CircleLoader />}
          <ComponentHeading
            data={{ classes: classes, text: "Add User", styleColor: "#2e639a" }}
          />
          <DialogTitle id="form-dialog-title"> </DialogTitle>
          <DialogContent style={{height:'300px'}}>
            <DialogContentText>
              <Typography variant="body1">Select User</Typography>
            </DialogContentText>
            <Table className={classes.table}>
              <TableHead style={{ padding: "0px" }}>
                <TableRow>
                  <TableCell
                    align="center"
                    style={{ paddingBottom: "0px", paddingTop: "0px" }}
                  >
                    <h4>NAME</h4>
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ paddingBottom: "0px", paddingTop: "0px" }}
                  >
                    <h4>EMAIL</h4>
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ paddingBottom: "0px", paddingTop: "0px" }}
                  >
                    <h4>ROLE</h4>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody >{this.getUserNames()}</TableBody>
            </Table>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={this.closeUserListing}
              variant="contained"
              color="secondary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {isFetching && <CircleLoader />}
        <Paper>
          <ComponentHeading
            data={{
              classes: classes,
              text: "Users List",
              styleColor: "#fff",
              color: "black",
            }}
          />
          <Divider />
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell align="right">User Name</TableCell>
                <TableCell align="right">Email Id</TableCell>
                <TableCell align="right">Books Assinged</TableCell>
                <TableCell align="right">Remove User</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{this.displayAssignedUsers()}</TableBody>
          </Table>
        </Paper>

        {/* open box for assign books for users */}
        <Dialog open={listBooks}>
          {isFetching && <CircleLoader />}
          <DialogContent>
            <Grid container item spacing={1} className={classes.bookCard}>
              {this.displayBooks()}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.closeBookListing}
              variant="contained"
              color="secondary"
            >
              Close
            </Button>
            <Button
              onClick={this.assignBooksToUser}
              variant="contained"
              color="primary"
            >
              Assign
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    users: state.user.users,
    project: state.sources.project,
    accessToken: state.auth.accessToken,
    assignedUsers: state.user.assignedUsers,
    userBooks: state.user.userBooks,
    isFetching: state.user.isFetching,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(withRouter(AssignUser));
