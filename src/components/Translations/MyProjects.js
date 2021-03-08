import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { createMuiTheme, Button, Tooltip } from '@material-ui/core';
import { fetchUserProjects } from '../../store/actions/projectActions';
import CircleLoader from '../loaders/CircleLoader';
import { connect } from 'react-redux'
import MUIDataTable from "mui-datatables";                                                                                                                                                                                                                                                    
import { Redirect, Link } from 'react-router-dom';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';
import BooksDownloadable from '../BooksDownloadable';
import swal from 'sweetalert';
import MyProjectReportPopup from './MyProjectReportPopup';

const styles = theme => ({
    root: {
        flexGrow: 1,
        paddingLeft:'5%',
        paddingRight:'5%'
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
                    filter: false,
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
                    customBodyRender: (value) => {    
                        let valueBooks = value.split('/')[1].split(',')                       
                        let valueId = value.split('/')[0]
                        valueBooks = valueBooks.filter(function(entry) { return entry.trim() != ''; });                                  
                        if (valueBooks.length == 0){
                            return <Tooltip title="Book is not assigned yet">
                            <span>
                                <Button size="small" variant="outlined" disabled style={{fontSize:'80%'}} >
                                    View
                                </Button>
                            </span>
                            </Tooltip>
                            }
                            else{
                        return <div><MyProjectReportPopup projectBooks = {valueBooks} projectWiseId= {valueId} bookCount= {valueBooks.length} /></div>                    
                    }
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
                        <span>
                            <Button 
                                variant="outlined" 
                                disabled 
                                size="small"
                                style={{fontSize:'80%'}}>
                                    Open Project
                            </Button>
                        </span>
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

        const { columns } = this.state;

        const data = userProjects.map(project => {
            return [
                project.projectId, 
                project.projectName.split('|')[0], 
                project.organisationName, 
                project.projectName.split('-')[0]+' - '+ project.version.code + ' - ' + project.version.revision, 
                project.projectId+'/'+project.books,
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
        };
        const { redirect, project, booksPane } = this.state;
        if(redirect) {
            return <Redirect to={`/app/translations/projects/${redirect}`} />
        }
        return (
            <div className={classes.root}>
                { isFetching && <CircleLoader />}
                <BooksDownloadable isFetching={isFetching} updateState={this.updateState} project={project} booksPane={booksPane} />
                <MUIDataTable 
                    title={<h4>MY PROJECTS</h4>}
                    data={data} 
                    columns={columns} 
                    options={options} 
                />
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