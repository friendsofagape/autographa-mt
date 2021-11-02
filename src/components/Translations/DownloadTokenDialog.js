import React, { Component } from "react";
import { Button, Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import compose from "recompose/compose";
import { withRouter } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  DialogTitle,
} from "@material-ui/core";
import DownloadIcon from "@material-ui/icons/GetApp";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import XLSX from "xlsx";
import { saveAs } from "file-saver";
import swal from "sweetalert";
import {
  bibleBookNewTestments,
  bibleBookOldTestments,
} from "../Common/BibleOldNewTestment";
import apiUrl from "../GlobalUrl";

const accessToken = localStorage.getItem("accessToken");

const styles = (theme) => ({
  title: {
    textAlign: "center",
    backgroundColor: "#eee",
  },
  textCenter: {
    textAlign: "center",
  },
});

class DownloadTokenDialog extends Component {
  state = {
    open: false,
    isOldChecked: false,
    isNewChecked: false,
    oldChecklist: [],
    newChecklist: [],
    untranslated: false,
    singleWord: false,
  };
  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({
      singleWord: false,
      untranslated: false,
      oldChecklist: [],
      newChecklist: [],
      isOldChecked: false,
      isNewChecked: false,
      open: false,
    });
  };

  checkHandleChange = () => {
    this.setState({ untranslated: !this.state.untranslated });
  };
  checkSingleWord = () => {
    this.setState({ singleWord: !this.state.singleWord });
  };

  listSort = (a, b) => {
    var nameA = a[0].toUpperCase(); // ignore upper and lowercase
    var nameB = b[0].toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // names must be equal
    return 0;
  };

  ///download token
  clickdownload = (projectid) => {
    const books = this.state.oldChecklist.concat(this.state.newChecklist);
    if (books.length === 0) {
      swal({
        title: "Unable to download tokens",
        text: "No book(s) selected",
        icon: "warning",
      });
      return;
    }
    fetch(
      apiUrl +
        "v1/tokentranslationlist/" +
        projectid +
        (this.state.singleWord ? "?only_words=True" : "?") +
        "&books=" +
        books.join("&books="),
      {
        method: "GET",
        headers: {
          Authorization: "bearer " + accessToken,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        //  full token translations
        data.sort(this.listSort);
        if (this.state.untranslated === false) {
          let tokenarray = [["token", "translation", "senses"]];
          tokenarray.push(...data);
          var wb = XLSX.utils.book_new();
          wb.Props = {
            Title: "TokenList",
            Subject: "TokenList",
            Author: "TokenList",
            CreatedDate: new Date(),
          };
          wb.SheetNames.push("TokenList");
          wb.Sheets["TokenList"] = XLSX.utils.aoa_to_sheet(tokenarray);
          var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
          function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
            return buf;
          }
          saveAs(
            new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
            this.props.projectName + ".xlsx"
          );
        } else {
          //  ----------Untraslated Tokens----------
          let untokenarray = [["token", "translation", "senses"]];
          untokenarray.push(...data.filter((item) => item[1] === null));
          var wb2 = XLSX.utils.book_new();
          wb2.Props = {
            Title: "TokenList",
            Subject: "TokenList",
            Author: "TokenList",
            CreatedDate: new Date(),
          };
          wb2.SheetNames.push("TokenList");
          wb2.Sheets["TokenList"] = XLSX.utils.aoa_to_sheet(untokenarray);
          var wbout2 = XLSX.write(wb2, { bookType: "xlsx", type: "binary" });
          function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
            return buf;
          }
          saveAs(
            new Blob([s2ab(wbout2)], { type: "application/octet-stream" }),
            this.props.projectName + ".xlsx"
          );
        }
        this.handleClose();
      });
  };

  oldHandleChange = (e) => {
    const checkedName = e.target.name;
    const books = [...this.state.oldChecklist];
    if (books.includes(checkedName)) {
      const bookIndex = books.indexOf(checkedName);
      books.splice(bookIndex, 1);
    } else {
      books.push(checkedName);
    }
    this.setState({ oldChecklist: books });
  };

  handleOldSelectAll = (e) => {
    const { projectBooks } = this.props;
    const checkValue = e.target.checked;
    let books = [];
    if (checkValue) {
      books = bibleBookOldTestments.filter((item) => {
        return projectBooks.includes(item);
      });
    }
    this.setState({ oldChecklist: books });
    this.setState({ isOldChecked: e.target.checked });
  };

  displayOTBooks(books) {
    if (books.length > 0) {
      return bibleBookOldTestments.map((item) => {
        if (books.includes(item)) {
          return (
            <Grid item sm={2} key={item}>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox color="primary" />}
                  label={item.toUpperCase()}
                  value={item}
                  name={item}
                  checked={this.state.oldChecklist.includes(item)}
                  onClick={this.oldHandleChange}
                />
              </FormGroup>
            </Grid>
          );
        } else {
          return "";
        }
      });
    } else {
      return (
        <Grid key="" value="" disabled>
          No books assigned
        </Grid>
      );
    }
  }

  newHandleChange = (e) => {
    const checkedName = e.target.name;
    const books = [...this.state.newChecklist];
    if (books.includes(checkedName)) {
      const bookIndex = books.indexOf(checkedName);
      books.splice(bookIndex, 1);
    } else {
      books.push(checkedName);
    }
    this.setState({ newChecklist: books });
  };

  handleNewSelectAll = (e) => {
    const { projectBooks } = this.props;
    const checkValue = e.target.checked;
    let books = [];
    if (checkValue) {
      books = bibleBookNewTestments.filter((item) => {
        return projectBooks.includes(item);
      });
    }
    this.setState({ newChecklist: books });
    this.setState({ isNewChecked: e.target.checked });
  };

  displayNTBooks(books) {
    if (books.length > 0) {
      return bibleBookNewTestments.map((item) => {
        if (books.includes(item)) {
          return (
            <Grid item sm={2} key={item}>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox color="primary" />}
                  label={item.toUpperCase()}
                  value={item}
                  name={item}
                  checked={this.state.newChecklist.includes(item)}
                  onClick={this.newHandleChange}
                />
              </FormGroup>
            </Grid>
          );
        } else {
          return "";
        }
      });
    } else {
      return (
        <Grid key="" value="" disabled>
          No books assigned
        </Grid>
      );
    }
  }
  render() {
    const { projectId, projectBooks } = this.props;
    const hasOldTestment = projectBooks.some((ai) =>
      bibleBookOldTestments.includes(ai)
    );
    const hasNewTestment = projectBooks.some((ai) =>
      bibleBookNewTestments.includes(ai)
    );

    return (
      <>
        <Tooltip title="Token Download">
          <Button
            size="small"
            variant="contained"
            onClick={this.handleOpen}
            style={{
              backgroundColor: "#21b6ae",
              marginRight: 10,
            }}
          >
            Token
            <DownloadIcon />
          </Button>
        </Tooltip>
        <Dialog
          open={this.state.open}
          aria-labelledby="form-dialog-title"
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle
            id="form-dialog-title"
            className={this.props.classes.title}
          >
            Download Project Token
          </DialogTitle>
          <DialogContent dividers>
            {hasOldTestment && (
              <Grid container>
                <Grid
                  item
                  sm={12}
                  style={{ borderBottom: "2px solid #d9d9d9" }}
                >
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox color="primary" />}
                      onClick={this.handleOldSelectAll}
                      checked={this.state.isOldChecked}
                      label="Old Testament"
                    />
                  </FormGroup>
                </Grid>
              </Grid>
            )}

            <Grid container>{this.displayOTBooks(projectBooks)}</Grid>

            {hasNewTestment && (
              <Grid container>
                <Grid
                  item
                  sm={12}
                  style={{ borderBottom: "2px solid #d9d9d9" }}
                >
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox color="primary" />}
                      onClick={this.handleNewSelectAll}
                      checked={this.state.isNewChecked}
                      label="New Testament"
                    />
                  </FormGroup>
                </Grid>
              </Grid>
            )}
            <Grid container>{this.displayNTBooks(projectBooks)}</Grid>
            <hr style={{ border: "1px solid #d9d9d9" }} />

            <Grid container>
              <Grid item sm={6}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        onChange={this.checkHandleChange}
                        checked={this.state.untranslated}
                      />
                    }
                    label="Untranslated Tokens"
                  />
                </FormGroup>
              </Grid>
              <Grid item sm={6}>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox color="primary" />}
                    label="Single Word"
                    onChange={this.checkSingleWord}
                    checked={this.state.singleWord}
                  />
                </FormGroup>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              size="small"
              onClick={this.handleClose}
              variant="contained"
              color="secondary"
            >
              Cancel
            </Button>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={() => this.clickdownload(projectId)}
              style={{ marginLeft: 10 }}
            >
              Download Tokens
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

export default compose(withStyles(styles))(withRouter(DownloadTokenDialog));
