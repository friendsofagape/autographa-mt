import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Typography, CardContent, Paper, createMuiTheme, MuiThemeProvider, Button } from '@material-ui/core';
import apiUrl from '../GlobalUrl';
import { displaySnackBar, selectProject } from '../../store/actions/sourceActions'
import { fetchUserProjects } from '../../store/actions/projectActions';
import CircleLoader from '../loaders/CircleLoader';
import { connect } from 'react-redux'   
import Tooltip from '@material-ui/core/Tooltip';
import MUIDataTable from "mui-datatables";
// import CreateProject from './CreateProject';
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
        padding: theme.spacing(2),
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

const LightTooltip = withStyles((theme) => ({
    arrow: {
        color: theme.palette.common.white,
      },
    tooltip: {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }))(Tooltip);
 /* const useStylesBootstrap = makeStyles((theme) => ({
    arrow: {
      color: theme.palette.common.black,
    },
    tooltip: {
      backgroundColor: theme.palette.common.black,
    },
  }));
  
  function BootstrapTooltip(props) {
    const classes = useStylesBootstrap();
  
    return <Tooltip arrow classes={classes} {...props} />;
  }*/
  /*function TriggersTooltips() {
    const [open, setOpen] = React.useState(false);
  
    const handleTooltipClose = () => {
      setOpen(false);
    };
  
    const handleTooltipOpen = () => {
      setOpen(true);
    };*/
  

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
                name: <h4>PROJECT NAME</h4>,
                options: {
                    filter: true
                }
            },
            /*{
                name: 'Project Code',
                options: {
                    filter: true
                }
            },*/
            {
                name: <h4>ORGANISATION</h4>,
                options: {
                    filter: true
                }
            },
            {
                name: <h4>SOURCE</h4>,
                options: {
                    filter: true
                }
            },
            {
                name: <h4>ASSIGNED BOOKS</h4>,
                options: {
                    filter: true,
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
                    customBodyRender: (value) => {
                        var valuesbook = value.split('/')[1]
                        var valuesTran = value.split('/')[0]
                        // console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',valuesbook)
                        if (valuesbook == 0){
                        return <Tooltip title="Book is not assigned yet">
                        <span>
                        <Button variant="outlined" disabled color="secondary" size="small">Open Project</Button>
                        </span>
                      </Tooltip>
                        }
                        else{
                            return <Link style={{"text-decoration": "none"}}to={`/app/translations/projects/${valuesTran}`}><Button variant="contained"  size="small" color="primary">Open Project</Button></Link>
                        }
                    },
                }
            }
            // {
            //     /*name: 'Translate',*/
            //     name: '',
            //     options: {
            //         filter: true,
            //         customBodyRender: (value) => {
            //             /*return <Link to={`/app/translations/projects/${value}`}>Translate</Link>*/
            //             return <Link disabled= {this.books ==0 ? true : false} style={{textDecoration:'none'}} to={`/app/translations/projects/${value}`}><Button  disabled= {this.books ==0 ? true : false} variant="contained" size="small" color="primary" >Open Project</Button></Link>
            //         }
            //     }
            // }
        ]
    }

    handleTooltipClose = () => {
        this.setState({open:false});
      };
    
    handleTooltipOpen = () => {
        this.setState({open:true});
      };

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
            console.log("myProject=",project)
            return [
                project.projectId, 
                project.projectName.split('|')[0], 
                /*project.projectName.split('|')[1],*/ 
                project.organisationName, 
                project.projectName.split('-')[0]+' - '+ project.version.code + ' - ' + project.version.revision,
                project.books,
                // project.projectId, 
                // project.projectId, 
                project.projectId+'/'+project.books.length, 
                project.projectId+'/'+project.books.length,

            ]
        });

        const options = {
            selectableRows: false,
            print:false,                              
            search: true,                                    
            download: false,                                
            viewColumns: false,                        
            filter: false,                       
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
                    title={<h3>MY PROJECT</h3>} 
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