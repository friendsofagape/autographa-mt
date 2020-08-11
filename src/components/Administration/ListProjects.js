import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Typography, CardContent, Paper, createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import apiUrl from '../GlobalUrl';
import { Card } from '@material-ui/core';
import { CardHeader } from '@material-ui/core';
import { displaySnackBar, selectProject } from '../../store/actions/sourceActions'
import { fetchProjects } from '../../store/actions/projectActions';
import CircleLoader from '../loaders/CircleLoader';
import { connect } from 'react-redux'
import PopUpMessages from '../PopUpMessages';
import MUIDataTable from "mui-datatables";
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import CreateProject from './CreateProject';
import { Redirect, Link } from 'react-router-dom';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';

const accessToken = localStorage.getItem('accessToken')

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

class ListProjects extends Component {
    state = {
        redirect: null,
        open: false,
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
                name: 'Action',
                options: {
                    filter: true,
                    customBodyRender: (value) => {
                        return <Link to={`/app/projects/${value}`}>Assign users</Link>
                    }
                }
            }
        ]
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(fetchProjects());
    }

    handleClose = () => {
        this.setState({ open: false })
    }

    render() {
        const { classes, projects, isFetching, current_user } = this.props;
        const { columns, open } = this.state;
        const data = projects.map(project => {
            return [
                project.projectId,
                project.projectName.split('|')[0],
                project.projectName.split('|')[1],
                project.organisationName,
                project.version.name,
                project.projectId,
            ]
        });
        const options = {
            selectableRows: false,
            // onRowClick: rowData => this.setState({ redirect: rowData[0] })
        };
        console.log('projects', this.props)
        const { redirect } = this.state;
        // if (redirect) {
        //     return <Redirect to={`/app/projects/${redirect}`} />
        // }
        return (
            <div className={classes.root}>
                {/* <PopUpMessages /> */}
                {isFetching && <CircleLoader />}
                <MuiThemeProvider theme={getMuiTheme()}>
                    <MUIDataTable
                        title={"Projects List"}
                        data={data}
                        columns={columns}
                        options={options}
                    />
                </MuiThemeProvider>
                <CreateProject open={open} close={this.handleClose} />
                {
                    current_user.role !== 'm' &&
                    <Fab aria-label={'add'} className={classes.fab} color={'primary'} onClick={() => this.setState({ open: true })}>
                        <AddIcon />
                    </Fab>
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    projects: state.project.projects,
    isFetching: state.project.isFetching,
    current_user: state.auth.current_user
})

const mapDispatchToProps = (dispatch) => ({
    dispatch
})


// export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ListProjects));
export default compose(
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps)
)(withRouter(ListProjects))