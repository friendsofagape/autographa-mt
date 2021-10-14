import React, { Component } from "react";
import { connect } from "react-redux";
import { Typography, withStyles } from "@material-ui/core";
import { Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import ComponentHeading from "./ComponentHeading";
import { getTranslatedText } from "../store/actions/projectActions";
import CircleLoader from "./loaders/CircleLoader";
import {
  bibleBookNewTestments,
  bibleBookOldTestments,
} from "../components/Common/BibleOldNewTestment";

var FileSaver = require("file-saver");

var accessToken = localStorage.getItem("accessToken");

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
});

class BooksDownloadable extends Component {
  state = {
    value: true,
    targetBooks: [],
    targetBooksChecked: {},
  };

  handleChange = (book) => {
    var { targetBooks } = this.state;
    const isChecked = targetBooks.includes(book);
    if (isChecked) {
      targetBooks = targetBooks.filter((item) => item !== book);
    } else {
      targetBooks.push(book);
    }
    this.setState({ targetBooks });
  };

  getOldBooksCheckbox = () => {
    //function for old testament books
    const { targetBooks, targetBooksChecked } = this.state;
    const { project } = this.props;
    let oldTestment = [];
    if (project.books) {
      bibleBookOldTestments.map((book) => {
        //map function for pushing books in order to oldTestment variable
        return project.books.includes(book) ? oldTestment.push(book) : null;
      });
    }
    if (oldTestment.length == 0) {
      return (
        <React.Fragment key={oldTestment}>
          No Books Assigned in old Testament
        </React.Fragment>
      ); //checking if books prensent or not if any of the old testament books are not available
    } //then print NO BOOKS ASSIGNED IN OLD TESTAMENT
    if (oldTestment) {
      return oldTestment.map((book, index) => {
        //map function for printing books in UI
        return (
          <React.Fragment key={book}>
            <FormControlLabel
              key={book}
              control={
                <Checkbox
                  checked={targetBooks.includes(book)}
                  onChange={() => this.handleChange(book)}
                  value={targetBooks.includes(book)}
                />
              }
              label={book.toUpperCase()}
            />
          </React.Fragment>
        );
      });
    }
  };

  getNewBooksCheckbox = () => {
    //function for new testament books
    const { targetBooks, targetBooksChecked } = this.state;
    const { project } = this.props;
    let newTestments = [];
    if (project.books) {
      bibleBookNewTestments.map((book) => {
        //map function for pushing books in order to newTestment variable
        return project.books.includes(book) ? newTestments.push(book) : null;
      });
    }
    if (newTestments.length == 0) {
      return (
        <React.Fragment key={newTestments}>
          No Books Assigned in New Testament
        </React.Fragment>
      ); //checking if books prensent or not if any of the new testament books are not available
    } //then print NO BOOKS ASSIGNED IN NEW TESTAMENT
    if (newTestments) {
      return newTestments.map((book, index) => {
        //map function for printing books in UI
        return (
          <React.Fragment key={book}>
            <FormControlLabel
              key={book}
              control={
                <Checkbox
                  checked={targetBooks.includes(book)}
                  onChange={() => this.handleChange(book)}
                  value={targetBooks.includes(book)}
                />
              }
              label={book.toUpperCase()}
            />
          </React.Fragment>
        );
      });
    }
  };

  handleDownload = () => {
    const { project, dispatch, updateState } = this.props;
    const { targetBooks } = this.state;
    if (project.projectId) {
      dispatch(
        getTranslatedText(project.projectId, targetBooks, project.projectName)
      );
      updateState({ booksPane: false });
    }
  };

  handleClose = () => {
    const { updateState } = this.props;
    this.setState({
      targetBooks: [],
      targetBooksChecked: {},
    });
    updateState({ booksPane: false });
  };

  canBeSubmitted() {
    const { targetBooks } = this.state;
    return targetBooks.length > 0;
  }

  render() {
    const isEnabled = this.canBeSubmitted();
    const { updateState, booksPane, classes, isFetching } = this.props;
    return (
      <Dialog open={booksPane} onClose={this.handleClose}>
        {isFetching && <CircleLoader />}
        <ComponentHeading
          data={{
            classes: classes,
            text: "Select Books",
            styleColor: "#2a2a2fbd",
          }}
        />
        <DialogContent style={{ maxHeight: "400px" }}>
          <h4>OLD TESTAMENT</h4>
          {this.getOldBooksCheckbox()}
          <h4>NEW TESTAMENT</h4>
          {this.getNewBooksCheckbox()}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.handleClose}
            size="small"
            variant="contained"
            color="secondary"
          >
            Close
          </Button>
          <Button
            onClick={this.handleDownload}
            size="small"
            disabled={!isEnabled}
            variant="contained"
            color="primary"
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = (state) => ({
  selectedProject: state.project.selectedProject,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(BooksDownloadable));
