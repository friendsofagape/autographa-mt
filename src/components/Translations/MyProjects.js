import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Button, Tooltip } from "@material-ui/core";
import { fetchUserProjects } from "../../store/actions/projectActions";
import CircleLoader from "../loaders/CircleLoader";
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import { Redirect, Link } from "react-router-dom";
import UploadIcon from "@material-ui/icons/Publish";
import DownloadIcon from "@material-ui/icons/GetApp";
import XLSX from "xlsx";
import compose from "recompose/compose";
import { withRouter } from "react-router-dom";
import BooksDownloadable from "../BooksDownloadable";
import swal from "sweetalert";
import MyProjectReportPopup from "./MyProjectReportPopup";
import apiUrl from "../GlobalUrl";
import DownloadTokenDialog from "./DownloadTokenDialog";

const accessToken = localStorage.getItem("accessToken");

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    paddingLeft: "5%",
    paddingRight: "5%",
  },
  textCenter: {
    textAlign: "center",
  },
});

class MyProjects extends Component {
  state = {
    redirect: null,
    booksPane: false,
    project: {},
    loading: false,
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
        name: <h4 className={this.props.classes.textCenter}>Progress</h4>,
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
                <div className={this.props.classes.textCenter}>
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
        name: <h4 className={this.props.classes.textCenter}>Projects</h4>,
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value) => {
            var valuesbook = value.split("/")[1];
            var valuesTran = value.split("/")[0];
            if (valuesbook === 0) {
              return (
                <div className={this.props.classes.textCenter}>
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
                <div className={this.props.classes.textCenter}>
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
        name: <h4 className={this.props.classes.textCenter}>Tokens</h4>,
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value, row) => {
            const projectId = row.rowData[0];
            const projectName = row.rowData[1];
            return (
              <div className={this.props.classes.textCenter}>
                <DownloadTokenDialog
                  projectId={projectId}
                  projectBooks={value}
                  projectName={projectName}
                />
                <Tooltip title="Token Upload">
                  <label htmlFor={"projectId-" + projectId}>
                    <input
                      style={{ display: "none" }}
                      id={"projectId-" + projectId}
                      name={"projectId-" + projectId}
                      type="file"
                      onChange={this.clickupload}
                      data-projectid={projectId}
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
              </div>
            );
          },
        },
      },

      {
        name: <h4 className={this.props.classes.textCenter}>Draft</h4>,
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value, row) => {
            var valuesbook = value.split("/")[1];
            var valuesTran = value.split("/")[0];
            if (valuesbook === 0) {
              return (
                <div className={this.props.classes.textCenter}>
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
                <div className={this.props.classes.textCenter}>
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

  // Upload tokens from excel file
  clickupload = (e) => {
    const stoploading = () => {
      this.setState({ loading: false });
    };
    this.setState({ loading: true });
    var proId = e.target.getAttribute("data-projectid");
    var files = e.target.files,
      f = files[0];
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
    userProjects.forEach((project) => {
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
        project.books,
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
