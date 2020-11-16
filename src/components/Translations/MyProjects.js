import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Typography, CardContent, Paper, createMuiTheme, MuiThemeProvider, Button, Tooltip } from '@material-ui/core';
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
import purple from '@material-ui/core/colors/purple';
import swal from 'sweetalert';
import color from '@material-ui/core/colors/amber';
import MyProjectFunction from './MyProjectFunction';

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
        padding: theme.spacing(8),
        paddingLeft:'5%',
        paddingRight:'5%'

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
                name: <h4>Project Name</h4>,
                options: {
                    filter: false,
                    sort: false,
                }
            },
            {
                name: <h4>Organisation</h4>,
                options: {
                    filter: false,
                    sort: false,
                }
            },
            {
                name: <h4>Source Details</h4>,
                options: {
                    filter: false,
                    sort: false
                }
            },
            {
                name: <h4>Books Assigned</h4>,
                options: {
                    filter: false,
                    sort: false,
                    customBodyRender: (value) => {                                                                                                                                                  //added
                        return <div><MyProjectFunction books={value} /></div>                    
                        
                        }
                }
            },



            {
                name: <h4></h4>,
                options: {
                    filter: false,
                    sort:false,
                    customBodyRender: (value, row) => {
                        var valuesbook = value.split('/')[1]
                        var valuesTran = value.split('/')[0]
                        if (valuesbook == 0){
                        return <Tooltip title="Book is not assigned yet">
                        <span>
                            <Button size="small" variant="outlined" disabled style={{fontSize:'80%'}} >
                                Download Draft
                            </Button>
                        </span>
                        </Tooltip>
                        }
                        else{
                            return <Button 
                                        size="small" 
                                        variant="contained" 
                                        onClick={() => this.handleDownload(valuesTran)}
                                        style={{fontSize:'80%', backgroundColor: "#21b6ae"}}>
                                        Download Draft
                                    </Button>
                        }
                    },
                }
            },

            {
                name: <h4></h4>,
                options: {
                    filter: false,
                    sort:false,
                    customBodyRender: (value) => {
                        var valuesbook = value.split('/')[1]
                        var valuesTran = value.split('/')[0]
                        if (valuesbook == 0){
                        return <Tooltip title="Book is not assigned yet">
                        <Button 
                            variant="outlined" 
                            disabled 
                            size="small"
                            style={{fontSize:'80%'}}>
                                Open Project
                        </Button>
                      </Tooltip>
                        }
                        else{
                            return <Button 
                                variant="contained" 
                                style={{ backgroundColor: "#21b6ae",fontSize:'80%'}} 
                                size="small">
                                    <Link 
                                    style={{color:"black", textDecoration: "none"}}
                                    to={`/app/translations/projects/${valuesTran}`}>
                                    Open Project</Link>
                                </Button>
                        }
                    },
                }
            }
            
            
            
            
        ]
    }

    handleDownload = (projectId) => {
        var project = this.props.userProjects.filter(item => item.projectId == projectId)
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
                // project.projectName.split('|')[1], 
                project.organisationName, 
                project.projectName.split('-')[0]+' - '+ project.version.code + ' - ' + project.version.revision, 
                // project.version.name,
                // project.books.length,
                project.books,
                project.projectId+'/'+project.books.length, 
                project.projectId+'/'+project.books.length, 
            ]
        });
        const options = {
            selectableRows: false,
            download: false,
            print: false,
            filter: false,
            viewColumns: false,
            pagination:false,
            // responsive: "scroll"
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
                {/* <MuiThemeProvider theme={getMuiTheme()}> */}
                    <BooksDownloadable isFetching={isFetching} updateState={this.updateState} project={project} booksPane={booksPane} />
                <MUIDataTable 
                    title={<h4>MY PROJECTS</h4>}
                    data={data} 
                    columns={columns} 
                    options={options} 
                />
                {/* </MuiThemeProvider> */}
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