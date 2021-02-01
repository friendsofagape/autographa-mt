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
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import AddIcon from "@material-ui/icons/Add";
import ListItem from "@material-ui/core/ListItem";
import { Divider } from "@material-ui/core";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { connect } from "react-redux";
import StatisticsSummary from "../StatisticsSummary";
import {
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
    border: "1px solid #eee",
  },
  statisticsPane: {
    minHeight: "50px",
  },
  bookCard: {
    width: "400px",
  }
});


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
  
  componentDidMount() {
    const { dispatch, location } = this.props;
    const projectId = location.pathname.split("/").pop();
    dispatch(fetchUsers());
    dispatch(getAssignedUsers(projectId));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userBooks !== this.props.userBooks) {
      this.setState({ availableBooksData: this.props.userBooks });
    }
  }

  addUser() {
    this.setState({ userListing: true });
  }

  selectUser = (userId) => {
    const { dispatch } = this.props;
    const projectId = this.props.location.pathname.split("/").pop();
    const apiData = {
      projectId: projectId,
      userId: userId,
      books: [],
    };
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
          key={user.userId} hover
          onClick={() => this.selectUser(user.userId)}
        >
          <TableCell  align="center" style={{ padding:"0px" }}>
            {/* <ListItem > */}
              {user.firstName + " " + user.lastName}
            {/* </ListItem> */}
          </TableCell>
          
          <TableCell align="center" style={{ padding:"0px"}}>
            {/* <ListItem > */}
              {user.emailId}
            {/* </ListItem> */}
          </TableCell>
          {user.roleId == "3" ? (
            <TableCell style={{ padding:"0px"}}>
              <ListItem>
                Super Admin
              </ListItem>
            </TableCell>
          ) : null}
          {user.roleId == "2" ? (
            <TableCell style={{ padding:"0px"}}>
              <ListItem >
                Admin
              </ListItem>
            </TableCell>
          ) : null}
          {user.roleId == "1" ? (
            <TableCell style={{ padding:"0px"}}>
              <ListItem >
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
          <TableCell align="right" style={{ padding:"5px" }}>{userName}</TableCell>
          <TableCell align="right" style={{ padding:"5px" }}>{email}</TableCell>
          <TableCell align="right" style={{ padding:"5px" }}>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={() => this.handleSelectBooks(userId, user.projectId)}
            >
              Books
            </Button>
          </TableCell>
          <TableCell align="right" style={{ padding:"5px" }}>
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

  displayOldBooks = () => {                                                     //Function for sorting Old Testment Books
    const { availableBooksData } = this.state;
    const { assignedUsers } = this.props;
    let assignedUsersBooks = [];                                                 
    for(var i in assignedUsers){                                                //Listing the books of users
      if (assignedUsers[i].user.userId !== this.state.userId){                  //Checking if not current user then push the books
      assignedUsersBooks.push(assignedUsers[i].books)
      }
    }
    let assignedBooks = assignedUsersBooks.join().split(',')
    const allBooks = Object.keys(availableBooksData);                           //Three code book name are getting listed into allBooks variable
    const bibleBookOldTestments = ["gen", "exo", "lev", "num", "deu", "jos", "jdg", "rut", 
    "1sa", "2sa", "1ki", "2ki", "1ch", "2ch", "ezr", "neh", "est", "job", "psa", "pro", 
    "ecc", "sng", "isa", "jer", "lam", "ezk", "dan", "hos", "jol", "amo", "oba", "jon", 
    "mic", "nam", "hab", "zep", "hag", "zec", "mal"]
    let oldTestments = [];
    bibleBookOldTestments.map((book)=>{
    return allBooks.includes(book)? oldTestments.push(book): null
    })
    return oldTestments.map((book,i) => {
      return (
        <Grid item xs={2} className={this.props.classes.checkBox} key={i}>
          <FormControlLabel
            control={
              <Checkbox
                disabled={assignedBooks.includes(book)}                          //Disabling the books assigned to the previous users
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

  displayNewBooks = () => {                                                     //Function for sorting New Testment Books
    const { availableBooksData } = this.state;
    const { assignedUsers } = this.props;
    let assignedUsersBooks = [];                                                 
    for(var i in assignedUsers){                                                //Listing the books of users
      if (assignedUsers[i].user.userId !== this.state.userId){                  //Checking if not current user then push the books
      assignedUsersBooks.push(assignedUsers[i].books)
      }
    }
    let assignedBooks = assignedUsersBooks.join().split(',')
    const allBooks = Object.keys(availableBooksData);                           //Three code book name are getting listed into allBooks variable
    const bibleBookNewTestments = ["mat", "mrk", "luk", "jhn", "act", "rom",
    "1co", "2co", "gal", "eph", "php", "col", "1th", "2th", "1ti", "2ti", "tit",
    "phm", "heb", "jas", "1pe", "2pe", "1jn", "2jn", "3jn", "jud", "rev"]
    let newTestments = [];
    bibleBookNewTestments.map((book)=>{
    return allBooks.includes(book)? newTestments.push(book): null
    })
    return newTestments.map((book,i) => {
      return (
        <Grid item xs={2} className={this.props.classes.checkBox} key={i}>
          <FormControlLabel
            control={
              <Checkbox
                disabled={assignedBooks.includes(book)}                          //Disabling the books assigned to the previous users
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
        {/* <Grid item xs={8} className={classes.statisticsPane}> */}
          <StatisticsSummary projectId={location.pathname.split("/").pop()} />
        {/* </Grid> */}
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
          fullWidth={true} 
          maxWidth = {'md'}
        >
          {isFetching && <CircleLoader />}
          <ComponentHeading
            data={{ classes: classes, text: "Assign Users", styleColor: "#2e639a" }}
          />
          <DialogContent style={{height:'300px'}}>
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
                    align="left"
                    style={{ paddingBottom: "0px", paddingTop: "0px" }}
                  >
                    <h4>ROLE</h4>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{this.getUserNames()}</TableBody>
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
                <TableCell align="right"><h3 style={{fontWeight:'bold'}}>User Name</h3></TableCell>
                <TableCell align="right"><h3 style={{fontWeight:'bold'}}>Email Id</h3></TableCell>
                <TableCell align="right"><h3 style={{fontWeight:'bold'}}>Books Assigned</h3></TableCell>
                <TableCell align="right"><h3 style={{fontWeight:'bold'}}>Remove User</h3></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{this.displayAssignedUsers()}</TableBody>
          </Table>
        </Paper>

        {/* open box for assign books for users */}
        <Dialog open={listBooks}>
          {isFetching && <CircleLoader />}
          <DialogContent>
            <h4>OLD TESTAMENT</h4>
            <Grid container item spacing={1} className={classes.bookCard}>
              {this.displayOldBooks()}
            </Grid>
            <h4>NEW TESTAMENT</h4>
            <Grid container item spacing={1} className={classes.bookCard}>
              {this.displayNewBooks()}
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
