import React, { Component } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import PopUpMessages from '../PopUpMessages'
import CircleLoader from '../loaders/CircleLoader';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { fetchUsers, updateAdminStatus, deleteUserAccess } from '../../store/actions/userActions';
import { Switch } from '@material-ui/core';
import MUIDataTable from "mui-datatables";
import { createMuiTheme, Button, Tooltip } from '@material-ui/core';
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";

// const getMuiTheme = () => createMuiTheme({
//     overrides: {
//       MUIDataTable: {
//         root: {
//         },
//         paper: {
//           boxShadow: "none",
//         }
//       },
//       MUIDataTableBodyRow: {
//         root: {
//           '&:nth-child(odd)': { 
//             backgroundColor: '#eaeaea'
//           }
//         }
//       },
//       MUIDataTableBodyCell: {
//       }
//     }
//   })

const styles = theme => ({
    root: {
        flexGrow: 1,
        // padding: '16px'
        paddingTop: '2%',
        paddingLeft:'8%',
        paddingRight:'8%'
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
                name: <h4>Name</h4>,
                options: {
                    filter: false,
                    sort: false
                }
            },
            {
                name: <h4>Email</h4>,
                options: {
                    filter: false,
                    sort: false
                }
            },
            {
                name: <h4>Verified</h4>,
                options: {
                    filter: false,
                    sort: false,
                    customBodyRender: (value, row) => {
                        return <FormControlLabel
                        control={
                            <Switch
                            checked={value}
                            disabled
                        />
                        }
                        label={value ? "Verified" : "Unverified"}
                      />
                        
                        
                    }
                }
            },
            {
                name: <h4>Admin</h4>,
                options: {
                    filter: false,
                    customBodyRender: (value, row) => {
                        // const { current_user } = this.props;
                        return <span>{value ? "Admin" : "Member"}</span>
                    //     <FormControlLabel
                    //     control={
                    //         <Switch
                    //             checked={value}
                    //             onChange={() => this.changeAdminStatus(row.rowData[0], !value)}
                    //             disabled={current_user.role === 'm' ? true : false}
                    //         />
                    //     }
                    //     label={value ? "Admin" : "Member"}
                    //   />
                        
                        
                    }
                }
            },
            {
                name: <h4>Remove User</h4>,
                options: {
                    filter: false,
                    customBodyRender: (value) => {
                        return <Button 
                        // variant="contained" 
                        // style={{ backgroundColor: "#21b6ae",fontSize:'80%'}} 
                        size="small"
                        onClick={() => this.handleDelete(value)}>
                        <DeleteOutlinedIcon />
                        </Button>
                    }
                }
            },

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

    handleDelete = (userEmail) => {
        console.log("LISTUSERSSSSSS>>>>>>>",userEmail)
        const { dispatch } = this.props;
        const apiData = {
          userEmail: userEmail,
        };
        dispatch(deleteUserAccess(apiData));
      };

    closeSnackBar = (item) => {
        this.setState(item)
    }

    render() {
        const {  classes, users, isFetching } = this.props;
        const { columns } = this.state;
        const data =  Object.values(users)
        const sortedData = [] 
        data.map(user => {
            if (user.roleId != 3 & user.active === true) {
                sortedData.push(user)
            }    
        });
        const filteredData = sortedData.map(user=>{
            return [
                user.userId,
                user.firstName + " " + user.lastName,
                user.emailId,
                user.verified,
                user.roleId > 1,
                user.emailId
            ]
        })
                
        const options = {
            selectableRows: false,
            download: false,
            print: false,
            filter: false,
            viewColumns: false,
            pagination:false
          };
        return (
            <div className={classes.root}>
                <PopUpMessages />
                { isFetching && <CircleLoader />}
                <MUIDataTable 
                    title={<h4>USERS LIST</h4>} 
                    data={filteredData} 
                    columns={columns} 
                    options={options} 
                />
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