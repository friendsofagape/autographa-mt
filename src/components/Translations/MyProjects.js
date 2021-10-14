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
    untranslatedToken: [],
    bkvalue: "",
    isOldChecked: false,
    isNewChecked: false,
    oldChecklist: [],
    newChecklist: [],
    loading: false,
    untranslated: false,
    singleWord: false,
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
        name: <h4 style={{ textAlign: "center" }}>Progress</h4>,
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
                <div style={{ textAlign: "center" }}>
                  <Tooltip title="Book is not assigned yet">
                    <span>
                      <Button variant="outlined" disabled size="small">
                        View Progress
                      </Button>
                    </span>
                  </Tooltip>
                </div>
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
        name: <h4 style={{ textAlign: "center" }}>Projects</h4>,
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value) => {
            var valuesbook = value.split("/")[1];
            var valuesTran = value.split("/")[0];
            if (valuesbook === 0) {
              return (
                <div style={{ textAlign: "center" }}>
                  <Tooltip title="Book is not assigned yet">
                    <span>
                      <Button variant="outlined" disabled size="small">
                        Open Project
                      </Button>
                    </span>
                  </Tooltip>
                </div>
              );
            } else {
              return (
                <div style={{ textAlign: "center" }}>
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
                </div>
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
                      backgroundColor: "#21b6ae",
                      marginRight: 10,
                    }}
                  >
                    Token
                    <DownloadIcon />
                  </Button>
                </Tooltip>

                <Tooltip title="Token Upload">
                  <label htmlFor="upload-photo">
                    <input
                      style={{ display: "none" }}
                      id="upload-photo"
                      name="upload-photo"
                      type="file"
                      onChange={this.clickupload}
                      data-projectid={row.rowData[0]}
                      onClick={(e) => (e.target.value = null)}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      component="span"
                      style={{ backgroundColor: "#21b6ae" }}
                    >
                      {this.state.loading && <CircleLoader />}
                      Token
                      <UploadIcon />
                    </Button>
                  </label>
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
                            label="Old Testment"
                          />
                        </FormGroup>
                      </Grid>
                    </Grid>
                    <Grid container>{this.displayOTBooks()}</Grid>

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
                            label="New Testment"
                          />
                        </FormGroup>
                      </Grid>
                    </Grid>
                    <Grid container>{this.displayNTBooks()}</Grid>
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
                            onChange={this.checkSinglekWord}
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
                      onClick={() =>
                        this.clickdownload(row.rowData[0], row.rowData[1])
                      }
                      style={{ marginLeft: 10 }}
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
        name: <h4 style={{ textAlign: "center" }}>Draft</h4>,
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value, row) => {
            var valuesbook = value.split("/")[1];
            var valuesTran = value.split("/")[0];
            if (valuesbook === 0) {
              return (
                <div style={{ textAlign: "center" }}>
                  <Tooltip title="Book is not assigned yet">
                    <span>
                      <Button size="small" variant="outlined" disabled>
                        Draft
                      </Button>
                    </span>
                  </Tooltip>
                </div>
              );
            } else {
              return (
                <div style={{ textAlign: "center" }}>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => this.handleDownload(valuesTran)}
                    style={{ backgroundColor: "#21b6ae" }}
                  >
                    Draft <DownloadIcon />
                  </Button>
                </div>
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
    this.setState({
      singleWord: false,
      untranslated: false,
      oldChecklist: [],
      newChecklist: [],
      open: false,
    });
  };

  checkHandleChange = () => {
    this.setState({ untranslated: !this.state.untranslated });
  };
  checkSinglekWord = () => {
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

  clickdownload = (projectid, projectName) => {
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
          var ws_data = tokenarray;
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
            projectName + ".xlsx"
          );
        } else {
          //  ----------Untraslated Tokens----------
          let untokenarray = [["token", "translation", "senses"]];
          untokenarray.push(...data.filter((item) => item[1] === null));
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
            projectName + ".xlsx"
          );
        }
        this.handleClose();
      });
  };

  // Upload tokens from excel file
  clickupload = (e) => {
    const stoploading = () => {
      this.setState({ loading: false });
    };
    this.setState({ loading: true });
    var proId = e.target.getAttribute("data-projectid");
    var files = e.target.files,
      f = files[0];
    var that = this;
    var reader = new FileReader();
    reader.onload = function (e) {
      var data = new Uint8Array(e.target.result);
      var workbook = XLSX.read(data, { type: "array" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      var tknlist = XLSX.utils.sheet_to_json(worksheet);
      var jsondata = {
        projectId: proId,
        tokenTranslations: tknlist,
      };

      fetch(apiUrl + "v1/autographamt/projects/bulktranslations", {
        method: "POST",
        body: JSON.stringify(jsondata),
        headers: {
          Authorization: "bearer " + accessToken,
        },
      })
        .then((response) => {
          stoploading();
          return response.json();
        })
        .then((data) => {
          swal({
            title: "Uploaded Tokens to Project",
            text: data.message,
            icon: "success",
          });
        });
    };
    reader.onerror = function (e) {
      console.error("File could not be read! Code " + e.target.error.code);
    };
    reader.readAsArrayBuffer(f);
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
    const { userProjects } = this.props;
    const checkValue = e.target.checked;
    let books = [];
    if (checkValue) {
      books = bibleBookOldTestments.filter((item) => {
        return userProjects[0].books.includes(item);
      });
    }
    this.setState({ oldChecklist: books });
    this.setState({ isOldChecked: e.target.checked });
  };

  displayOTBooks() {
    const { userProjects } = this.props;
    if (userProjects.length > 0) {
      return bibleBookOldTestments.map((item) => {
        if (userProjects[0].books.includes(item)) {
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
    const { userProjects } = this.props;
    const checkValue = e.target.checked;
    let books = [];
    if (checkValue) {
      books = bibleBookNewTestments.filter((item) => {
        return userProjects[0].books.includes(item);
      });
    }
    this.setState({ newChecklist: books });
    this.setState({ isNewChecked: e.target.checked });
  };

  displayNTBooks() {
    const { userProjects } = this.props;
    if (userProjects.length > 0) {
      return bibleBookNewTestments.map((item) => {
        if (userProjects[0].books.includes(item)) {
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

  handleDownload = (projectId) => {
    var project = this.props.userProjects.filter(
      (item) => item.projectId === parseInt(projectId)
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
  selectedProject: state.project.selectedProject,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(withRouter(MyProjects));
