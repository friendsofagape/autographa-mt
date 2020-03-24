import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import { Checkbox, Paper, createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import ComponentHeading from '../ComponentHeading';
import { withStyles } from '@material-ui/styles';
import apiUrl from '../GlobalUrl';
import PopUpMessages from '../PopUpMessages';
import { connect } from 'react-redux';
import { fetchOrganisations, updateOrganisationVerifiedStatus } from '../../store/actions/organisationActions';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { displaySnackBar } from '../../store/actions/sourceActions';
import CircleLoader from '../loaders/CircleLoader';
import CreateOrganisation from './CreateOrganisation';

import { Switch } from '@material-ui/core';
import MUIDataTable from "mui-datatables";

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
        // padding: theme.spacing(2),
        padding: '16px'
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

const accessToken = localStorage.getItem('accessToken')

class ListOrganisations extends Component {
    state = {
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
                name: 'Organisation Name',
                options: {
                    filter: true
                }
            },
            {
                name: 'Email',
                options: {
                    filter: true
                }
            },
            {
                name: 'Address',
                options: {
                    filter: true
                }
            },
            {
                name: 'Phone',
                options: {
                    filter: true
                }
            },
            {
                name: 'Verified',
                options: {
                    filter: false,
                    customBodyRender: (value, row) => {
                        return <Switch
                                checked={value}
                                onChange={() => this.updateOrganisationStatus(row.rowData[0], !value)}
                            />
                    }
                }
            },
            {
                name: 'Admin Id',
                options: {
                    filter: true,
                    display: false
                }
            }
        ]
    }

    updateOrganisationStatus = (organisationId, status) => {
        const { dispatch } = this.props;
        const apiData = {
            organisationId: organisationId,
            verified: status
        }
        dispatch(updateOrganisationVerifiedStatus(apiData))
    }
    
    componentDidMount(){
        const { dispatch } = this.props;
        dispatch(fetchOrganisations())
    }

    handleClose = () => {
        this.setState({open: false})
    }

    render() {
        const {  classes, organisations, isFetching } = this.props;
        const { columns, open } = this.state;
        const data = organisations.map(organisation => {
            return [
                organisation.organisationId,
                organisation.organisationName,
                organisation.organisationEmail,
                organisation.organisationAddress,
                organisation.organisationPhone,
                organisation.verified,
                organisation.userId,
            ]
        });
        const options = {
            selectableRows: false,
          };
        return (
            <div className={classes.root}>
                {/* <PopUpMessages /> */}
                { isFetching && <CircleLoader />}
                <MuiThemeProvider theme={getMuiTheme()}>
                <MUIDataTable 
                    title={"Organisations List"} 
                    data={data} 
                    columns={columns} 
                    options={options} 
                />
                </MuiThemeProvider>
                {/* <CreateOrganisation open={open} close={this.handleClose} /> */}
                {/* <Fab aria-label={'add'} className={classes.fab} color={'primary'} onClick={() => this.setState({open: true})}>
                    <AddIcon />
                </Fab> */}
            </div>
        )
    }
}


const mapStateToProps = state => ({
    organisations: state.organisation.organisations,
    isFetching: state.organisation.isFetching
})

const mapDispatchToProps = (dispatch) => ({
    dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ListOrganisations))