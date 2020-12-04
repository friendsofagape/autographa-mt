import React, { Component } from 'react';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { fetchOrganisations, updateOrganisationVerifiedStatus } from '../../store/actions/organisationActions';
import CircleLoader from '../loaders/CircleLoader';

import { Switch } from '@material-ui/core';
import MUIDataTable from "mui-datatables";


const styles = theme => ({
    root: {
        flexGrow: 1,
        paddingTop:'3%',
        paddingLeft:'10%',
        paddingRight:'10%',
        paddingBottom:'3%'
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
                name: <h4>Organisation Name</h4>,
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
                name: <h4>Address</h4>,
                options: {
                    filter: false,
                    sort: false
                }
            },
            {
                name: <h4>Phone</h4>,
                options: {
                    filter: false,
                    sort: false
                }
            },
            {
                name: <h4>Verified</h4>,
                options: {
                    filter: false,
                    // sort: false,
                    customBodyRender: (value, row) => {
                        return <Switch
                                checked={value}
                                onChange={() => this.updateOrganisationStatus(row.rowData[0], !value)}
                            />
                    }
                }
            },
            {
                name: <h4>Admin Id</h4>,
                options: {
                    filter: false,
                    sort: false,
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
            selectableRows: false,download: false,
            print: false,
            filter: false,
            viewColumns: false,
            pagination:false
          };
        return (
            <div className={classes.root}>
                { isFetching && <CircleLoader />}
                <MUIDataTable 
                    title={<h4>ORGANISATION LIST</h4>} 
                    data={data} 
                    columns={columns} 
                    options={options} 
                />
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