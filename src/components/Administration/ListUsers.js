import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import { Checkbox, Paper, createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ComponentHeading from '../ComponentHeading';
import apiUrl from '../GlobalUrl'
import PopUpMessages from '../PopUpMessages'
import { displaySnackBar } from '../../store/actions/sourceActions';
import CircleLoader from '../loaders/CircleLoader';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';


import { fetchUsers, updateAdminStatus } from '../../store/actions/userActions';


import { Switch } from '@material-ui/core';
import MUIDataTable from "mui-datatables";

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
});


class ListUsers extends Component {
    state = {
        userId: '',
        admin: '',
        snackBarOpen: false,
        popupdata: {},
        userData:[], 
        userStatus: {},
        columns: [
            {
                name: 'id',
                options: {    
                    display: false,
                    filter: false
                }
            },
            {
                name: 'Name',
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
                name: 'Verified',
                options: {
                    filter: false,
                    customBodyRender: (value, row) => {
                        // console.log(rowIndex)
                        return <FormControlLabel
                        control={
                            <Switch
                            checked={value}
                            disabled
                            // onChange={() => this.changeAdminStatus(row.rowData[0], !value)}
                        />
                        }
                        label={value ? "Verified" : "Unverified"}
                      />
                        
                        
                    }
                }
            },
            {
                name: 'Admin',
                options: {
                    filter: false,
                    customBodyRender: (value, row) => {
                        const { current_user } = this.props;
                        return <FormControlLabel
                        control={
                            <Switch
                                checked={value}
                                onChange={() => this.changeAdminStatus(row.rowData[0], !value)}
                                disabled={current_user.role === 'm' ? true : false}
                            />
                        }
                        label={value ? "Admin" : "Member"}
                      />
                        
                        
                    }
                }
            }
        ]
    }

    componentDidMount(){
        const { dispatch } = this.props;
        dispatch(fetchUsers())
    }

    changeAdminStatus = (userId, status) => {
        const { dispatch } = this.props;
        const apiData = {
            userId: userId,
            admin: status
        }
        dispatch(updateAdminStatus(apiData));
    }

    handleChange = (userId) => {
        const { userStatus } = this.state
        const admin = !userStatus[userId]["admin"]
        this.userAdminAssignment(admin, userId)
        userStatus[userId]["admin"] = admin
        this.setState({ userId, admin: !admin })
    }

    closeSnackBar = (item) => {
        this.setState(item)
    }

    render() {
        const {  classes, users, isFetching } = this.props;
        const { columns } = this.state;
        const data = users.map(user => {
            return [
                user.userId,
                user.firstName + " " + user.lastName,
                user.emailId,
                user.verified,
                user.roleId > 1
            ]
        });
        const options = {
            selectableRows: false,
          };
        return (
            <div className={classes.root}>
                <PopUpMessages />
                { isFetching && <CircleLoader />}
                <MuiThemeProvider theme={getMuiTheme()}>
                <MUIDataTable 
                    title={"Users List"} 
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
    users: state.user.users,
    isFetching: state.user.isFetching,
    current_user: state.auth.current_user
})

const mapDispatchToProps = (dispatch) => ({
    dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ListUsers))