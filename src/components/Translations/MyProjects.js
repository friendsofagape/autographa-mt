import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Button, Tooltip } from "@material-ui/core";
import { fetchUserProjects } from "../../store/actions/projectActions";
import CircleLoader from "../loaders/CircleLoader";
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import { Redirect, Link } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  DialogTitle,
} from "@material-ui/core";
import UploadIcon from "@material-ui/icons/Publish";
import DownloadIcon from "@material-ui/icons/GetApp";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import XLSX from "xlsx";
import { saveAs } from "file-saver";
import compose from "recompose/compose";
import { withRouter } from "react-router-dom";
import BooksDownloadable from "../BooksDownloadable";
import swal from "sweetalert";
import MyProjectReportPopup from "./MyProjectReportPopup";
import {
  bibleBookNewTestments,
  bibleBookOldTestments,
  books,
} from "../Common/BibleOldNewTestment";
import apiUrl from "../GlobalUrl";

const accessToken = localStorage.getItem("accessToken");

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    paddingLeft: "5%",
    paddingRight: "5%",
  },
  cursorPointer: {
    cursor: "pointer",
    backgroundColor: "#fff",
    "&:hover": {
      background: "#ededf4",
    },
  },
  cardHover: {
    backgroundColor: "#100f0ffa",
    "&:hover": {
      background: "#f00",
    },
  },
  fab: {
    position: "fixed",
    bottom: "16px",
    right: "16px",
  },
  title: {
    textAlign: "center",
    backgroundColor: "#eee",
  },
});

class MyProjects extends Component {
  state = {
    redirect: null,
    open: false,
    booksPane: false,
    project: {},
    allTokenList: [],
    checkBox: false,
    untranslatedToken: [],

    bkvalue: "",
    allChecked: false,
    columns: [
      {
        name: "id",
        options: {
          display: false,
          filter: false,
        },
      },
      {
        name: <h4>Project Name</h4>,
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        name: <h4>Organisation</h4>,
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        name: <h4>Source Details</h4>,
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        name: <h4>Books Assigned</h4>,
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value) => {
            let valueBooks = value.split("/")[1].split(",");
            let valueId = value.split("/")[0];
            valueBooks = valueBooks.filter(function (entry) {
              return entry.trim() !== "";
            });
            if (valueBooks.length === 0) {
              return (
                <Tooltip title="Book is not assigned yet">
                  <span>
                    <Button size="small" variant="outlined" disabled>
                      View
                    </Button>
                  </span>
                </Tooltip>
              );
            } else {
              return (
                <div>
                  <MyProjectReportPopup
                    projectBooks={valueBooks}
                    projectWiseId={valueId}
                    bookCount={valueBooks.length}
                  />
                </div>
              );
            }
          },
        },
      },

      {
        name: <h4>Projects</h4>,
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value) => {
            var valuesbook = value.split("/")[1];
            var valuesTran = value.split("/")[0];
            if (valuesbook === 0) {
              return (
                <Tooltip title="Book is not assigned yet">
                  <span>
                    <Button variant="outlined" disabled size="small">
                      Open Project
                    </Button>
                  </span>
                </Tooltip>
              );
            } else {
              return (
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#21b6ae" }}
                  size="small"
                >
                  <Link
                    style={{ color: "black", textDecoration: "none" }}
                    to={`/app/translations/projects/${valuesTran}`}
                  >
                    Open Project
                  </Link>
                </Button>
              );
            }
          },
        },
      },
      {
        name: <h4 style={{ textAlign: "center" }}>Tokens</h4>,
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value, row) => {
            return (
              <div style={{ textAlign: "center" }}>
                <Tooltip title="Token Download">
                  <Button
                    size="small"
                    variant="contained"
                    onClick={this.handleOpen}
                    style={{
                      // fontSize: "80%",
                      backgroundColor: "#21b6ae",
                      marginRight: 10,
                    }}
                  >
                    Token
                    <DownloadIcon />
                  </Button>
                </Tooltip>
                <Tooltip title="Token Upload">
                  <Button
                    size="small"
                    variant="contained"
                    // onClick={() => this.handleDownload(valuesTran)}
                    style={{ backgroundColor: "#21b6ae" }}
                  >
                    Token
                    <UploadIcon />
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
                    Downloads selected books tokens
                  </DialogTitle>
                  <DialogContent>
                    <Grid container>
                      <Grid item sm={1}></Grid>
                      <Grid item sm={5}>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                color="primary"
                                onChange={this.checkHandleChange}
                              />
                            }
                            label="Untranslated Tokens"
                          />
                        </FormGroup>
                      </Grid>
                      <Grid item sm={6}>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                // onChange={this.checkHandleChange}
                                color="primary"
                              />
                            }
                            label="Single word"
                          />
                        </FormGroup>
                      </Grid>
                    </Grid>
                    <hr />
                    <Grid container>
                      <Grid item sm={12}>
                        <FormGroup>
                          <FormControlLabel
                            control={<Checkbox color="primary" />}
                            label="Old Testment"
                            checked={this.state.allChecked}
                            name="checkAll"
                            // value={item}
                          />
                        </FormGroup>
                      </Grid>
                    </Grid>

                    <Grid container>{this.displayOTBooks()}</Grid>
                    <hr />
                    <Grid container>
                      <Grid item sm={12}>
                        <FormGroup>
                          <FormControlLabel
                            control={<Checkbox color="primary" />}
                            label="New Testment"
                            onChange={this.handleNTSelect}
                            // checked={this.state.checkBox}
                          />
                        </FormGroup>
                      </Grid>
                    </Grid>
                    <Grid container>{this.displayNTBooks()}</Grid>
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
                      onClick={this.clickdownload}
                    >
                      Download Tokens
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            );
          },
        },
      },

      {
        name: <h4>Download Draft</h4>,
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value, row) => {
            var valuesbook = value.split("/")[1];
            var valuesTran = value.split("/")[0];
            if (valuesbook === 0) {
              return (
                <Tooltip title="Book is not assigned yet">
                  <span>
                    <Button size="small" variant="outlined" disabled>
                      Download Draft
                    </Button>
                  </span>
                </Tooltip>
              );
            } else {
              return (
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => this.handleDownload(valuesTran)}
                  style={{ backgroundColor: "#21b6ae" }}
                >
                  Draft <DownloadIcon />
                </Button>
              );
            }
          },
        },
      },
    ],
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  checkHandleChange = () => {
    if (this.state.checkBox === true) {
      this.setState({ checkBox: false });
    } else {
      this.setState({ checkBox: true });
    }
  };

  clickdownload = () => {
    fetch(apiUrl + "v1/tokentranslationlist/131/lev", {
      method: "GET",
      headers: {
        Authorization: "bearer " + accessToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        //  full token translations
        if (this.state.checkBox === false) {
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
          var ws_data = tokenarray;
          var ws = XLSX.utils.aoa_to_sheet(ws_data);
          wb.Sheets["TokenList"] = ws;
          var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
          console.log(wbout);
          function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
            return buf;
          }
          saveAs(
            new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
            this.state.bkvalue + ".xlsx"
          );
        } else {
          //  ----------Untraslated Tokens----------
          let untokenarray = [["token", "translation", "senses"]];
          untokenarray.push(...this.state.untranslatedToken);
          var wb = XLSX.utils.book_new();
          wb.Props = {
            Title: "TokenList",
            Subject: "TokenList",
            Author: "TokenList",
            CreatedDate: new Date(),
          };
          wb.SheetNames.push("TokenList");
          var ws_data = untokenarray;
          var ws = XLSX.utils.aoa_to_sheet(ws_data);
          wb.Sheets["TokenList"] = ws;
          var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
          function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
            return buf;
          }
          saveAs(
            new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
            this.state.bkvalue + ".xlsx"
          );
        }
      });
  };

  displayOTBooks(e) {
    const { userProjects } = this.props;
    if (userProjects.length > 0) {
      let assignedBooks = [];
      bibleBookOldTestments.map((item) => {
        return userProjects[0].books.includes(item)
          ? assignedBooks.push({ book: item, checkbox: false })
          : null;
      });
      console.log(assignedBooks);
      return Object.values(assignedBooks).map((item) => {
        return (
          <Grid item sm={2} key={item.book}>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox color="primary" />}
                label={item.book.toUpperCase()}
                value={item.book}
                name={item.book}
                // checked={item.checkbox}
              />
            </FormGroup>
          </Grid>
        );
      });
    } else {
      return (
        <Grid key="" value="" disabled>
          No books assigned
        </Grid>
      );
    }
  }

  displayNTBooks() {
    const { userProjects } = this.props;
    if (userProjects.length > 0) {
      let assignedNTBooks = [];
      bibleBookNewTestments.map((item) => {
        return userProjects[0].books.includes(item)
          ? assignedNTBooks.push({ book: item, checkbox: false })
          : null;
      });
      return Object.values(assignedNTBooks).map((item) => {
        return (
          <Grid
            item
            sm={2}
            key={item.book}
            className={this.props.classes.checkbox}
          >
            <FormGroup>
              <FormControlLabel
                control={<Checkbox color="primary" />}
                label={item.book.toUpperCase()}
                value={item.book}
              />
            </FormGroup>
          </Grid>
        );
      });
    } else {
      return (
        <Grid key="" value="" disabled>
          No books assigned
        </Grid>
      );
    }
  }

  handleDownload = (projectId) => {
    var project = this.props.userProjects.filter(
      (item) => item.projectId === projectId
    );
    if (project.length > 0) {
      this.setState({
        project: project[0],
        booksPane: true,
      });
    } else {
      swal({
        title: "Download drafts",
        text: "No downloadable books available ",
        icon: "error",
      });
    }
  };

  updateState = (data) => {
    this.setState(data);
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchUserProjects());
  }

  render() {
    const { classes, userProjects, isFetching } = this.props;

    const { columns } = this.state;
    const sortedData = [];
    userProjects.map((project) => {
      if (project.active === true) {
        sortedData.push(project);
      }
    });
    const data = sortedData.map((project) => {
      return [
        project.projectId,
        project.projectName.split("|")[0],
        project.organisationName,
        project.projectName.split("-")[0] +
          " - " +
          project.version.code +
          " - " +
          project.version.revision,
        project.projectId + "/" + project.books,
        project.projectId + "/" + project.books.length,
        0,
        project.projectId + "/" + project.books.length,
      ];
    });
    const options = {
      selectableRows: false,
      download: false,
      print: false,
      filter: false,
      viewColumns: false,
      pagination: false,
    };
    const { redirect, project, booksPane } = this.state;
    if (redirect) {
      return <Redirect to={`/app/translations/projects/${redirect}`} />;
    }
    return (
      <div className={classes.root}>
        {isFetching && <CircleLoader />}
        <BooksDownloadable
          isFetching={isFetching}
          updateState={this.updateState}
          project={project}
          booksPane={booksPane}
        />
        <MUIDataTable
          title={<h4>MY PROJECTS</h4>}
          data={data}
          columns={columns}
          options={options}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  projects: state.project.projects,
  isFetching: state.project.isFetching,
  userProjects: state.project.userProjects,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(withRouter(MyProjects));
