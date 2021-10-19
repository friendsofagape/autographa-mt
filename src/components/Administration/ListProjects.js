import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  fetchProjects,
  deleteProject,
} from "../../store/actions/projectActions";
import CircleLoader from "../loaders/CircleLoader";
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import CreateProject from "./CreateProject";
import { Link } from "react-router-dom";
import compose from "recompose/compose";
import { Button } from "@material-ui/core";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import { withRouter } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
    paddingRight: "10%",
    paddingLeft: "10%",
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
});

class ListProjects extends Component {
  state = {
    open: false,
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
        name: <h4>Project Code</h4>,
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
        name: <h4>Source</h4>,
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        name: <h4>Action</h4>,
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value) => {
            return <Link to={`/app/projects/${value}`}>Assign users</Link>;
          },
        },
      },
      {
        name: <h4>Remove Project</h4>,
        options: {
          filter: false,
          customBodyRender: (value) => {
            return (
              <Button size="small" onClick={() => this.handleDelete(value)}>
                <DeleteOutlinedIcon />
              </Button>
            );
          },
        },
      },
    ],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchProjects());
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  handleDelete = (projectId) => {
    const { dispatch } = this.props;
    const apiData = {
      projectId: projectId,
    };
    dispatch(deleteProject(apiData));
  };

  render() {
    const { classes, projects, isFetching, current_user } = this.props;
    const { columns, open } = this.state;
    const sortedData = [];
    projects.map((project) => {
      if (project.active === true) {
        sortedData.push(project);
      }
    });
    const data = sortedData.map((project) => {
      return [
        project.projectId,
        project.projectName.split("|")[0],
        project.projectName.split("|")[1],
        project.organisationName,
        project.version.name,
        project.projectId,
        project.projectId,
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
    return (
      <div className={classes.root}>
        {isFetching && <CircleLoader />}
        <MUIDataTable
          title={<h4>PROJECTS LIST</h4>}
          data={data}
          columns={columns}
          options={options}
        />
        <CreateProject open={open} close={this.handleClose} />
        {current_user.role !== "m" && (
          <Tooltip title="Create Project">
            <Fab
              aria-label={"add"}
              className={classes.fab}
              color={"primary"}
              onClick={() => this.setState({ open: true })}
            >
              <AddIcon />
            </Fab>
          </Tooltip>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  projects: state.project.projects,
  isFetching: state.project.isFetching,
  current_user: state.auth.current_user,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(withRouter(ListProjects));
