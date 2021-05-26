import React, { Component } from "react";
import { Grid, Button, Tooltip, Typography } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import UploadTexts from "./UploadTexts";
// import apiUrl from "./GlobalUrl";
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

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    overflowY: "hidden",
    padding: theme.spacing(8),
    paddingLeft: "15%",
    paddingRight: "15%",
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
            return moment(value).format("D/M/Y");
          },
        },
      },
    ],
  };

  closeDialog = () => {
    this.setState({ dialogOpen: false });
  };

  componentDidMount() {
    var { dispatch, current_user } = this.props;
    dispatch(fetchBibleLanguages());
    if (current_user.role == "sa") {
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
                  size="small"
                  color={'primary'} 
                  variant="contained"
                  onClick={() =>
                    this.setState(
                      { listBooks: true },
                      this.handleBookSelect(value)
                    )
                  }
                >
                <span style={{fontSize:'70%'}}>View</span>
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
                  color={'primary'} 
                  variant="contained"
                  onClick={() =>
                    this.setState({ dialogOpen: true, sourceId: value })
                  }
                >
                <span style={{fontSize:'70%'}}>Upload</span>
                </Button>
              );
            },
          },
        },
      ];
      this.setState({ columns });
    } else {
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
                size={'small'} 
							  color={'primary'} 
							  variant="contained"
                onClick={() =>
                  this.setState(
                    { listBooks: true },
                    this.handleBookSelect(value)
                  )
                }
                >
                <span style={{fontSize:'70%'}}>View</span>
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

  displayOldBooks = () => {
    //function for sorting old testament books
    const { sourceBooks } = this.props;
    const booksOldTestments = [
      "gen",
      "exo",
      "lev",
      "num",
      "deu",
      "jos",
      "jdg",
      "rut",
      "1sa",
      "2sa",
      "1ki",
      "2ki",
      "1ch",
      "2ch",
      "ezr",
      "neh",
      "est",
      "job",
      "psa",
      "pro",
      "ecc",
      "sng",
      "isa",
      "jer",
      "lam",
      "ezk",
      "dan",
      "hos",
      "jol",
      "amo",
      "oba",
      "jon",
      "mic",
      "nam",
      "hab",
      "zep",
      "hag",
      "zec",
      "mal",
    ];
    var totalBooks = [].concat.apply([], sourceBooks); //merging the arrays
    let oldTestments = [];
    booksOldTestments.map((book) => {
      //map function for pushing the old testament books in order
      return totalBooks.includes(book) ? oldTestments.push(book) : null;
    });
    return oldTestments.map((book, i) => {
      //displaying the old testament books on UI
      return (
        <Grid item xs={2} key={i}>
          <Typography style={{ fontSize: "80%" }}>
            {book.toUpperCase()}
          </Typography>
        </Grid>
      );
    });
  };

  displayNewBooks = () => {
    //function for sorting new testament books
    const { sourceBooks } = this.props;
    const booksNewTestments = [
      "mat",
      "mrk",
      "luk",
      "jhn",
      "act",
      "rom",
      "1co",
      "2co",
      "gal",
      "eph",
      "php",
      "col",
      "1th",
      "2th",
      "1ti",
      "2ti",
      "tit",
      "phm",
      "heb",
      "jas",
      "1pe",
      "2pe",
      "1jn",
      "2jn",
      "3jn",
      "jud",
      "rev",
    ];
    var totalBooks = [].concat.apply([], sourceBooks); //merging the arrays
    let newTestments = [];
    booksNewTestments.map((book) => {
      //map function for pushing the new testament books in order
      return totalBooks.includes(book) ? newTestments.push(book) : null;
    });
    return newTestments.map((book, i) => {
      //displaying the new testament books on UI
      return (
        <Grid item xs={2} key={i}>
          <Typography style={{ fontSize: "80%" }}>
            {book.toUpperCase()}
          </Typography>
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
      pagination: false,
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
              <h4>OLD TESTAMENT</h4>
              <Grid container item className={this.props.classes.bookCard}>
                {this.displayOldBooks()}
              </Grid>
              <h4>NEW TESTAMENT</h4>
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
