import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import { fetchProjects } from '../../store/actions/projectActions';
import CircleLoader from '../loaders/CircleLoader';
import { connect } from 'react-redux'
import MUIDataTable from "mui-datatables";

import { Link } from 'react-router-dom';
import Button from "@material-ui/core/Button";
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';
import ReportAndDashboardPopup from '../Translations/ReportAndDashboardPopup';


const getMuiTheme = () => createMuiTheme({
    overrides: {
        MUIDataTable: {
            root: {
            },
            paper: {
                boxShadow: "none",
            }
        },
        MUIDataTableBodyRow: {
            root: {
                '&:nth-child(odd)': {
                    backgroundColor: '#eaeaea'
                }
            }
        },
        MUIDataTableBodyCell: {
        }
    }
})

const styles = theme => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(2),
        paddingRight:'10%',
        paddingLeft:'10%'
    },
    cursorPointer: {
        cursor: 'pointer',
        backgroundColor: '#fff',
        '&:hover': {
            background: '#ededf4',
        },
    },
    cardHover: {
        backgroundColor: '#100f0ffa',
        '&:hover': {
            background: "#f00",
        },
    },
    fab: {
        position: 'fixed',
        bottom: '16px',
        right: '16px',
    }
});

class ListProjects extends Component {
    state = {
        open: false,
        columns: [                                                              //columns of the page     
            {
                name: 'id',
                options: {
                    display: false,
                    filter: false
                }
            },
            {
                name: <h4>Project Name</h4>,
                options: {
                    filter: true
                }
            },
            {
                name: <h4>Organisation</h4>,
                options: {
                    filter: true
                }
            },
            {
                name: <h4>Source</h4>,
                options: {
                    filter: true
                }
            },
            {
                name: <center><h4>Books Assigned </h4></center>,
                options: {
                    filter: true,
                    customBodyRender: (value) => {
                        return  (                                      
                            <center>
                            <Button
                            size="small"
                            variant="contained"
                            style={{fontSize:'80%', backgroundColor: "#21b6ae"}}
                            >
                            <Link to={`/app/statistics/report/${value}`} style={{textDecoration:'none'}}>USERS                        
                            </Link>                                                                                       
                            </Button>
                            </center>
                        ) 
                    }
                }
            },
            {
                name: <h4>Total Source Books</h4>,         
                options: {
                    filter: true,
                    customBodyRender: (value) => {
                        return <ReportAndDashboardPopup projectId = {value} />
                    }
                }
            },
        ]
    }

    componentDidMount() {
        const { dispatch } = this.props;
        // const {projects} = this.props
        dispatch(fetchProjects());                                   //Fetching projects for the page
    }

    render() {
        const { classes, projects, isFetching } = this.props;
        // console.log("@@@@@@@@@@@",projects)
        const { columns, open } = this.state;
        const data = projects.map(project => {
            return [
                project.projectId,
                project.projectName.split('|')[0],
                project.organisationName,
                project.version.name,
                project.projectId,                                   //To get Assigned User
                project.projectId                                    //To get the Source Books Details
            ]
        });
        const options = {
            selectableRows: false,
            // download: false,
            // print: false,
            filter: false,
            viewColumns: false,                                      //To customise the columns
            pagination:false,                                        //For page customisation
        };

        return (
            <div className={classes.root} >
                {isFetching && <CircleLoader />}
                <MuiThemeProvider theme={getMuiTheme()}>
                    <MUIDataTable
                        title={<h4>PROJECTS DASHBOARD</h4>}
                        data={data}                                  //MUIDataTable for datas on the page
                        columns={columns}
                        options={options}
                    />
                </MuiThemeProvider>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    projects: state.project.projects,
    isFetching: state.project.isFetching,
    // current_user: state.auth.current_user
})

const mapDispatchToProps = (dispatch) => ({
    dispatch
})

export default compose(
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps)
)(withRouter(ListProjects))