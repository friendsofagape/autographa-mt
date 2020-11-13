import React, { Component } from "react";
import {
  Grid,
  Button,
  Tooltip,
  Typography,
  createMuiTheme,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import UploadTexts from "./UploadTexts";
import apiUrl from "./GlobalUrl";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import CreateSources from "./CreateSources";
import {
  fetchBibleLanguages,
  fetchSourceBooks,
} from "../store/actions/sourceActions";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import MUIDataTable from "mui-datatables";
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
    padding: theme.spacing(8),
    paddingLeft:'15%',
    paddingRight:'15%'

  },
  versionDisplay: {
    maxHeight: "80vh",
    overflow: "auto",
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
        name: <h4>Language</h4>,
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        name: <h4>Version</h4>,
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        name: <h4>Revision</h4>,
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        name: <h4>Updated Date</h4>,
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value) => {
            return moment(value).format('D/M/Y');
          },
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
    dispatch(fetchBibleLanguages());
    if (current_user.role == "sa" ) {
      let { columns } = this.state;
      columns = [
        ...columns,
        {
          name: <h4>Books</h4>,
          options: {
            filter: false,
            sort: false,
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
          name: <h4>Upload</h4>,
          options: {
            filter: false,
            sort: false,
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

    else {
      let { columns } = this.state;
      columns = [
        ...columns,
        {
          name: <h4>Books</h4>,
          options: {
            filter: false,
            sort: false,
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
        }
      ];
      this.setState({ columns });
    }
  }

  handleClose = (value) => {
    this.setState({
      [value]: false,
    });
  };

  displayOldBooks = () => {                                                                                     //function for sorting old testment books
    const { sourceBooks } = this.props;
    const booksOldTestments = ["gen", "exo", "lev", "num", "deu", "jos", "jdg", "rut", "1sa", "2sa", 
    "1ki", "2ki", "1ch", "2ch", "ezr", "neh", "est", "job", "psa", "pro", "ecc", "sng", 
    "isa", "jer", "lam", "ezk", "dan", "hos", "jol", "amo", "oba", "jon", "mic", "nam", "hab",
    "zep", "hag", "zec", "mal"]
    var totalBooks = [].concat.apply([], sourceBooks)                                                            //merging the arrays 
    let oldTestments = [];
    booksOldTestments.map((book)=>{                                                                              //map function for pushing the old testment books in order
    return totalBooks.includes(book)? oldTestments.push(book): null
    })
    return oldTestments.map((book,i) => {                                                                        //displaying the old testment books on UI
      return (
        <Grid item xs={2} key={i}>
          <Typography style={{fontSize:'80%'}} >{book.toUpperCase()}</Typography>
        </Grid>
      );
    });
  };

  displayNewBooks = () => {                                                                                      //function for sorting new testment books
    const { sourceBooks } = this.props;
    const booksNewTestments = ["mat", "mrk", "luk", "jhn", "act", "rom", "1co", "2co", "gal",
    "eph", "php", "col", "1th", "2th", "1ti", "2ti", "tit", "phm", "heb", "jas", "1pe", "2pe", "1jn", 
    "2jn", "3jn", "jud", "rev"]
    var totalBooks = [].concat.apply([], sourceBooks)                                                             //merging the arrays 
    let newTestments = [];
    booksNewTestments.map((book)=>{                                                                               //map function for pushing the new testment books in order
    return totalBooks.includes(book)? newTestments.push(book): null
    })
    return newTestments.map((book,i) => {                                                                         //displaying the new testment books on UI
      return (
        <Grid item xs={2} key={i}>
          <Typography style={{fontSize:'80%'}} >{book.toUpperCase()}</Typography>
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
    const { dispatch } = this.props;
    dispatch(fetchSourceBooks(sourceId));
  };

  render() {
    const { classes, bibleLanguages, isFetching, current_user } = this.props;
    const { columns, open, createSourceDialog } = this.state;
    var data = [];
    bibleLanguages.map((bible) => {
      bible["languageVersions"].map((version) => {
        data.push([
          version.sourceId,
          version.language.name,
          version.version.name,
          version.version.longName,
          version.updatedDate,
          version.sourceId,
          version.sourceId,
        ]);
      });

    
    });
    const options = {
      selectableRows: false,
      download: false,
            print: false,
            filter: false,
            viewColumns: false,
            pagination:false,
      // onRowClick: rowData => this.setState({redirect: rowData[0]})
    };
    return (
      <div className={classes.root}>
        {isFetching && <CircleLoader />}
          <MUIDataTable
            title={<h4>SOURCES</h4>}
            data={data}
            columns={columns}
            options={options}
          />
        {createSourceDialog && (
          <CreateSources
            open={createSourceDialog}
            close={this.handleClose}
            isFetching={isFetching}
          />
        )}
        {current_user.role == "sa" && (
          <Tooltip title="Click to add new source">
          <Fab
            aria-label={"add"}
            className={classes.fab}
            color={"primary"}
            onClick={() => this.setState({ createSourceDialog: true })}
          >
            <AddIcon />
          </Fab>
          </Tooltip>
        )}
        {this.state.listBooks && (
          <Dialog open={this.state.listBooks}>
            {isFetching && <CircleLoader />}
            <DialogContent>
              <h4>OLD TESTMENT</h4>
              <Grid container item className={this.props.classes.bookCard}>
                {this.displayOldBooks()}
              </Grid>
              <h4>NEW TESTMENT</h4>
              <Grid container item className={this.props.classes.bookCard}>
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
