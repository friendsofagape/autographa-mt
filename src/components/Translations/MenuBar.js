import React, { Component } from 'react';
import { FormControl, Grid, MenuItem, Select, InputLabel } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { selectBook } from '../../store/actions/sourceActions';
import { setSelectedBook, fetchUserProjects } from '../../store/actions/projectActions';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';
// import CircleLoader from '../loaders/CircleLoader';

const styles = theme => ({
    selectionGrid: {
        marginLeft: '4%',
        marginTop: '1%'
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        // width: '100%'
      },
    selectMenu: {
        width: '140px',
        padding: '2px',
        border: '1px solid black',
        borderRadius: '10px'
    },
});

class MenuBar extends Component {
    state= {
        selectbook:''
    }
    // componentDidMount() {
    //     // const { dispatch } = this.props;
    //     // dispatch(fetchUserProjects());
    // }

    displayBooks() {
        const { userProjects, location } = this.props
        if (userProjects.length > 0 ) {
            const data = userProjects.filter(project => project.projectId === parseInt(location.pathname.split('/').pop()));
            return data[0].books.map(item => {
                return (
                    <MenuItem key={item} value={item}>{item}</MenuItem>
                )
            })
        } else {
            return (
                <MenuItem key="" value="" disabled>No books assigned</MenuItem>
            )
        }
    }



    onSelect = (e) => {
        this.setState({
            selectbook:e.target.value
        })
        this.props.updateState(e.target.value);
        const { dispatch } = this.props
        dispatch(setSelectedBook(e.target.value))
    }

    render() {
        const { classes, selectedBook, dispatch } = this.props
        console.log('Menu Bar', this.props)
        return (
            <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Select Book</InputLabel>
                <Select
                    variant="filled"
                    margin="dense"
                    // className={classes.selectMenu}
                    value={this.state.selectbook}
                    onChange={this.onSelect}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                >
                {this.displayBooks()}
                </Select>
            </FormControl>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userProjects: state.project.userProjects,
        selectedBook: state.project.selectedBook
    }
}

const mapDispatchToProps = (dispatch) => ({
    dispatch
})

export default compose(
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps)
 )(withRouter(MenuBar))