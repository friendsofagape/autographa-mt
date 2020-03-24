import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Typography, CardContent, Paper, createMuiTheme, MuiThemeProvider, Button } from '@material-ui/core';
import apiUrl from '../GlobalUrl';
import { Card } from '@material-ui/core';
import { CardHeader } from '@material-ui/core';
import { displaySnackBar, selectProject } from '../../store/actions/sourceActions'
import { fetchUserProjects } from '../../store/actions/projectActions';
import CircleLoader from '../loaders/CircleLoader';
import { connect } from 'react-redux'
import PopUpMessages from '../PopUpMessages';
import MUIDataTable from "mui-datatables";
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
// import CreateProject from './CreateProject';
import { Redirect, Link } from 'react-router-dom';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';
import BooksDownloadable from '../BooksDownloadable';

import swal from 'sweetalert';

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
        // backgroundColor: '#ededf4',
        // minHeight: '100%'
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

class MyProjects extends Component {
    
    state = {
        redirect: null,
        open: false,
        booksPane: false,
        project: {},
        columns: [
            {
                name: 'id',
                options: {    
                    display: false,
                    filter: false
                }
            },
            {
                name: 'Project Name',
                options: {
                    filter: true
                }
            },
            {
                name: 'Project Code',
                options: {
                    filter: true
                }
            },
            {
                name: 'Organisation',
                options: {
                    filter: true
                }
            },
            {
                name: 'Source',
                options: {
                    filter: true
                }
            },
            {
                name: 'Books Assigned',
                options: {
                    filter: true
                }
            },
            {
                name: 'Download',
                options: {
                    filter: true,
                    customBodyRender: (value, row) => {
                        return <Button variant="contained" size="small" color="primary" onClick={() => this.handleDownload(value)}>Download drafts</Button>
                    }
                }
            },
            {
                name: 'Translate',
                options: {
                    filter: true,
                    customBodyRender: (value) => {
                        return <Link to={`/app/translations/projects/${value}`}>Translate</Link>
                    }
                }
            }
        ]
    }

    handleDownload = (projectId) => {
        var project = this.props.userProjects.filter(item => item.projectId === projectId)
        if(project.length > 0){
            this.setState({
                project: project[0],
                booksPane: true
            })
        } else {
            swal({
                title: 'Download drafts',
                text: 'No downloadable books available ',
                icon: 'error'
            });
        }
    }

    updateState = (data) => {
        this.setState(data);
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(fetchUserProjects());
    }
    render () {
        const { classes, userProjects, isFetching } = this.props;
        const { columns, open } = this.state;
        const data = userProjects.map(project => {
            return [
                project.projectId, 
                project.projectName.split('|')[0], 
                project.projectName.split('|')[1], 
                project.organisationName, 
                project.version.name,
                project.books.length,
                project.projectId, 
                project.projectId, 
            ]
        });
        const options = {
            selectableRows: false,
            // onRowClick: rowData => this.setState({redirect: rowData[0]})
        };
        console.log('my projects', this.props)
        const { redirect, project, booksPane } = this.state;
        if(redirect) {
            return <Redirect to={`/app/translations/projects/${redirect}`} />
        }
        return (
            <div className={classes.root}>
                { isFetching && <CircleLoader />}
                <MuiThemeProvider theme={getMuiTheme()}>
                    <BooksDownloadable isFetching={isFetching} updateState={this.updateState} project={project} booksPane={booksPane} />
                <MUIDataTable 
                    title={"My Projects"} 
                    data={data} 
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
    userProjects: state.project.userProjects
})

const mapDispatchToProps = (dispatch) => ({
    dispatch
})

export default compose(
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps)
 )(withRouter(MyProjects))