import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import CircleLoader from "../loaders/CircleLoader";
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import { fetchProjects } from "../../store/actions/projectActions";
import compose from "recompose/compose";
import { withRouter } from "react-router-dom";
import AssignedUsersReports from './ReportsAndDashboardUsers'
import AvailableSourceReports from "./AvailableSourceReports";


const styles = (theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
    paddingRight: "10%",
    paddingLeft: "10%",
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
    bottom: "16px",
    right: "16px",
  },
});

class ReportsDashboard extends Component {
  state = {
    open: false,
    columns: [
      //columns of the page
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
        name: <h4>Source</h4>,
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        name: <h4>Assigned Users </h4>,
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value) => {
            return <AssignedUsersReports value={value}/>
          },
        },
      },
      {
        name: <h4>Total Source Books</h4>,
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value) => {
            return <AvailableSourceReports projectId={value} />;
          },
        },
      },
    ],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchProjects()); //Fetching projects for the page
  }

  render() {
    const { classes, projects, isFetching } = this.props;
    const { columns } = this.state;
    const sortedData = [] 
        projects.map(project => {
            if (project.active === true) {
                sortedData.push(project)
            }    
        });
    const data = sortedData.map((project) => {
      return [
        project.projectId,
        project.projectName.split("|")[0],
        project.organisationName,
        project.projectName.split("-")[0] + " - " + project.version.code,
        project.projectId + "/" + project.projectName.split("|")[0], //To get Assigned User
        project.projectId, //To get the Source Books Details
      ];
    });
    const options = {
      selectableRows: false,
      download: false,
      print: false,
      filter: false,
      viewColumns: false, //To customise the columns
      pagination: false, //For page customisation
    };

    return (
      <div className={classes.root}>
        {isFetching && <CircleLoader />}
          <MUIDataTable
            title={<h4>REPORTS DASHBOARD</h4>}
            data={data} //MUIDataTable for datas on the page
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
)(withRouter(ReportsDashboard));
