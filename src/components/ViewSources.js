import React, { Component } from "react";
import jwt_decode from "jwt-decode";
import {
  Grid,
  Paper,
  Button,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Divider,
  Link,
  Typography,
  createMuiTheme,
  MuiThemeProvider,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Header from "./Header";
import UploadTexts from "./UploadTexts";
import apiUrl from "./GlobalUrl";
import { withStyles } from "@material-ui/core/styles";
import ComponentHeading from "./ComponentHeading";
import { uploadDialog } from "../store/actions/dialogActions";
import { connect } from "react-redux";
import CreateSources from "./CreateSources";
import {
  displaySnackBar,
  fetchBibleLanguages,
  fetchSourceBooks,
} from "../store/actions/sourceActions";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import MUIDataTable from "mui-datatables";
import PopUpMessages from "./PopUpMessages";
import CircleLoader from "./loaders/CircleLoader";
import moment from "moment";

const getMuiTheme = () =>
  createMuiTheme({
    overrides: {
      MUIDataTable: {
        root: {},
        paper: {
          boxShadow: "none",
        },
      },
      MUIDataTableBodyRow: {
        root: {
          "&:nth-child(odd)": {
            backgroundColor: "#eaeaea",
          },
        },
      },
      MUIDataTableBodyCell: {},
    },
  });

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    overflowY: "hidden",
  },
  versionDisplay: {
    maxHeight: "80vh",
    overflow: "auto",
    // backgroundColor:'red',
    // marginLeft: '1%',
    // marginTop: '1%'
  },
  cursorPointer: {
    margin: 10,
    cursor: "pointer",
  },
  bookCard: {
    width: "400px",
  },
  fab: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
  },
});

class ViewSources extends Component {
  state = {
    biblesDetails: [],
    dialogOpen: false,
    sourceId: "",
    decoded: {},
    accessToken: "",
    availableBooksData: [],
    createSourceDialog: false,
    listBooks: false,
    columns: [
      {
        name: "id",
        options: {
          display: false,
          filter: false,
        },
      },
      {
        name: "Version name",
        options: {
          filter: true,
        },
      },
      {
        name: "Version code",
        options: {
          filter: true,
        },
      },
      {
        name: "Updated Date",
        options: {
          filter: true,
          customBodyRender: (value) => {
            return moment(value).format('D/M/Y');
          },
        },
      },
      {
        name: "Revision",
        options: {
          filter: true,
        },
      },
      {
        name: "Language name",
        options: {
          filter: true,
        },
      },

      {
        name: "Language code",
        options: {
          filter: true,
        },
      },
    ],
  };


  closeDialog = () => {
    this.setState({ dialogOpen: false });
  };

  
  async getBiblesData() {
    const data = await fetch(apiUrl + "v1/bibles", {
      method: "GET",
    });
    const biblesDetails = await data.json();
    this.setState({ biblesDetails });
  }

  componentDidMount() {
    this.getBiblesData();
    var { dispatch, current_user } = this.props;
    // if (accessToken) {
    //     this.setState({ decoded: jwt_decode(accessToken), accessToken })
    // }
    dispatch(fetchBibleLanguages());
    if (current_user.role == "sa") {
      let { columns } = this.state;
      columns = [
        ...columns,
        {
          name: "Books",
          options: {
            filter: true,
            customBodyRender: (value) => {
              return (
                <Button
                  onClick={() =>
                    this.setState(
                      { listBooks: true },
                      this.handleBookSelect(value)
                    )
                  }
                >
                  View
                </Button>
              );
            },
          },
        },
        {
          name: "Upload",
          options: {
            filter: true,
            customBodyRender: (value) => {
              return (
                <Button
                  size="small"
                  variant="contained"
                  onClick={() =>
                    this.setState({ dialogOpen: true, sourceId: value })
                  }
                >
                  Upload
                </Button>
              );
            },
          },
        },
      ];
      this.setState({ columns });
    }
  }

  handleClose = (value) => {
    this.setState({
      [value]: false,
    });
  };

  displayBooks = () => {
    const { sourceBooks } = this.props;
    return sourceBooks.map((book) => {
      return (
        <Grid item xs={2} key={book}>
          <Typography>{book}</Typography>
        </Grid>
      );
    });
  };

  closeBookListing = () => {
    this.setState({ userId: "", projectId: "", listBooks: false });
  };

  handleSelect = (sourceId) => (e) => {
    this.setState({ dialogOpen: true, sourceId });
  };

  handleBookSelect = (sourceId) => (e) => {
    // this.setState({ listBooks: true, sourceId }, () => this.getBooks())
    const { dispatch } = this.props;
    dispatch(fetchSourceBooks(sourceId));
  };
  render() {
    // const { classes } = this.props
    // console.log('aaaaaaaaaaaaaaaaaaaaaaaaa', this.state.biblesDetails)
    console.log("view sourcessssssssssssssss", this.props.bibleLanguages);
    const { classes, bibleLanguages, isFetching, current_user } = this.props;
    const { columns, open, createSourceDialog } = this.state;
    var data = [];
    bibleLanguages.map((bible) => {
      bible["languageVersions"].map((version) => {
        console.log("eeeeeeeeeeeeeeee", version);
        data.push([
          version.sourceId,
          version.version.name,
          version.version.code,
          version.updatedDate,
          version.version.longName,
          version.language.name,
          version.language.code,
          version.sourceId,
          version.sourceId,
        ]);
      });

      // [
      // project.projectId,
      // project.projectName.split('|')[0],
      // project.projectName.split('|')[1],
      // project.organisationName,
      // project.version.name
      // ]
    });
    // console.log('data', data);
    const options = {
      selectableRows: false,
      // onRowClick: rowData => this.setState({redirect: rowData[0]})
    };
    return (
      <div className={classes.root}>
        {/* <PopUpMessages /> */}
        {isFetching && <CircleLoader />}
        <MuiThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            title={"Sources List"}
            data={data}
            columns={columns}
            options={options}
          />
        </MuiThemeProvider>
        {/* <CreateProject open={open} close={this.handleClose} /> */}
        {createSourceDialog && (
          <CreateSources
            open={createSourceDialog}
            close={this.handleClose}
            isFetching={isFetching}
          />
        )}
        {current_user.role == "sa" && (
          <Fab
            aria-label={"add"}
            className={classes.fab}
            color={"primary"}
            onClick={() => this.setState({ createSourceDialog: true })}
          >
            <AddIcon />
          </Fab>
        )}
        {this.state.listBooks && (
          <Dialog open={this.state.listBooks}>
            {isFetching && <CircleLoader />}
            <DialogContent>
              <Grid container item className={this.props.classes.bookCard}>
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
            </DialogActions>
          </Dialog>
        )}
        {this.state.dialogOpen && (
          <UploadTexts
            sourceId={this.state.sourceId}
            dialogOpen={this.state.dialogOpen}
            close={this.closeDialog}
          />
        )}
      </div>
      // <Grid item xs={12} md={12} container justify="center" className={classes.root}>
      //     <Grid item>
      //         {
      //             (this.state.decoded && this.state.decoded.role !== 'm') ? (
      //                 <Grid container justify="flex-end">
      //                     <Link className={classes.cursorPointer} variant="body2" onClick={() => this.props.uploadDialog({ uploadPane: true })}>
      //                         {"Can't find source from the listed? Create new."}
      //                     </Link>
      //                 </Grid>
      //             ) : null
      //         }
      //         <CreateSources />

      //     </Grid>
      //     <Grid item xs={11}  >
      //         <PopUpMessages />
      //         <Paper className={classes.versionDisplay}>
      //             <ComponentHeading data={{ text: "View Sources", styleColor: '#2a2a2fbd' }} />
      //             <Divider />
      //             <Table className={classes.table}>
      //                 <TableHead>
      //                     <TableRow>
      //                         <TableCell align="left">Version Name</TableCell>
      //                         <TableCell align="left">Version Code</TableCell>
      //                         <TableCell align="left">Version Long Name</TableCell>
      //                         <TableCell align="left">Updated Date</TableCell>
      //                         <TableCell align="left">Script</TableCell>
      //                         <TableCell align="left">Language Name</TableCell>
      //                         <TableCell align="left">Language Code</TableCell>
      //                         {
      //                             (this.state.decoded && this.state.decoded.role !== 'm') ? (
      //                                 <TableCell align="left">Books</TableCell>
      //                             ) : null
      //                         }
      //                         {
      //                             (this.state.decoded && this.state.decoded.role !== 'm') ? (
      //                                 <TableCell align="left">Action</TableCell>
      //                             ) : null
      //                         }
      //                     </TableRow>
      //                 </TableHead>
      //                 <TableBody>
      //                     {this.state.biblesDetails.map(items => (
      //                         items["languageVersions"].map(row => (
      //                             <TableRow key={row.sourceId}>
      //                                 <TableCell align="left">{row.version.name}</TableCell>
      //                                 <TableCell align="left">{row.version.code}</TableCell>
      //                                 <TableCell align="left">{row.version.longName}</TableCell>
      //                                 <TableCell align="left">{row.updatedDate}</TableCell>
      //                                 <TableCell align="left">{row.script}</TableCell>
      //                                 <TableCell align="left">{row.language.name}</TableCell>
      //                                 <TableCell align="left">{row.language.code}</TableCell>
      //                                 {
      //                                     (this.state.decoded && this.state.decoded.role !== 'm') ? (

      //                                         <TableCell align="left">
      //                                             <Button size="small" variant="contained" color="primary" onClick={this.handleBookSelect(row.sourceId)}>Books</Button>
      //                                         </TableCell>
      //                                     ) : null
      //                                 }
      //                                 {
      //                                     (this.state.decoded && this.state.decoded.role !== 'm') ? (
      //                                         <TableCell align="left">
      //                                             <Button size="small" variant="contained" color="primary" onClick={this.handleSelect(row.sourceId)}>Upload</Button>
      //                                         </TableCell>
      //                                     ) : null
      //                                 }
      //                             </TableRow>

      //                         ))
      //                     ))}
      //                 </TableBody>
      //             </Table>

      //         </Paper>
      //     </Grid>
      // </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isFetching: state.sources.isFetching,
    bibleLanguages: state.sources.bibleLanguages,
    sourceBooks: state.sources.sourceBooks,
    current_user: state.auth.current_user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ViewSources));
