import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {createMuiTheme, Button, Tooltip } from '@material-ui/core';
import { fetchUserProjects } from '../../store/actions/projectActions';
import CircleLoader from '../loaders/CircleLoader';
import { connect } from 'react-redux';   
import MUIDataTable from "mui-datatables";
import { Redirect, Link } from 'react-router-dom';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';
import BooksDownloadable from '../BooksDownloadable';
import swal from 'sweetalert';
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
    disabled: {
        color: "lightgrey"
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
        listBooks: false,                //
        userId: '',                      //
        projectId: '',                  
        columns: [
            {
                name: 'id',
                options: {    
                    display: false,
                    filter: false
                }
            },
            {
                name: <th>Project Name</th>,
                options: {
                    filter: false,
                    sort: false,
                }
            },
            {
                name: <th>Organisation</th>,
                options: {
                    filter: false,
                    sort: false,
                }
            },
            {
                name: <th>Source Details</th>,
                options: {
                    filter: false,
                    sort: false
                }
            },
            {
                name: <th>Books Assigned</th>,
                options: {
                    filter: false,
                    sort: false,
                    customBodyRender: (value) => {                                                                                                                                                  //added
                        return <div><MyProjectFunction books={value} /></div>                    
                        
                        }
                }
            },



            {
                name: <th></th>,
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
                name: <th></th>,
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
                                    style={{"color":"black", "text-decoration": "none"}}
                                    to={`/app/translations/projects/${valuesTran}`}>
                                    Open Project</Link>
                                </Button>
                        }
                    },
                }
            }
            
            
            
            
        ]
    }

    handleTooltipClose = () => {
        this.setState({open:false});
      };
    
    handleTooltipOpen = () => {
        this.setState({open:true});
      };

    handleDownload = (projectId) => {
        var project = this.props.userProjects.filter(item => item.projectId == projectId)
        // console.log(">>>>>>>>>>>>>>>>>>>>>>>",typeof(projectId) )
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
        // console.log('???????????????????????????????', data)
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
            console.log("myProject=",project)
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
                    title={<th>MY PROJECTS</th>}
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
 )(withRouter(MyProjects));

















 // {
            //     name: <h4>BOOKS</h4>,
            //     options: {
            //         filter: true,
            //         customBodyRender: (value) => {                                                                                                                                                  //added
            //         return <div><MyProjectFunction books={value} />   
                    {/*<LightTooltip title={<Typography color="inherit"><b>{value}</b></Typography>}> 
                    <Button variant="contained" size="small" color="primary" >Books</Button></LightTooltip>*/}
            //         </div>            
                    
            //         }
            //     }
            // },
            /*{*/
                /*name: 'Download',*/
                /*name: '',
                options: {
                    filter: true,
                    customBodyRender: (value, row) => {*/
                        /*return <Button variant="contained" size="small" color="primary" onClick={() => this.handleDownload(value)}>Download drafts</Button>*/
                       /* return <Button variant="contained" size="small" color="primary" onClick={() => this.handleDownload(value)}>View Books</Button>
                    }
                }*/
           /* },*/