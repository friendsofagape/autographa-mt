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

    componentDidMount() {
        // const { dispatch } = this.props;
        // dispatch(fetchUserProjects());
    }

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

    render() {
        const { classes, selectedBook, dispatch } = this.props
        console.log('Menu Bar', this.props)
        return (
            // <Grid container item xs={12} className={classes.selectionGrid}>
            //     <Grid container item xs={8}>
            //         <Grid item xs={2} md={2}>
            //             <FormControl>
            //                 <InputLabel htmlFor="select-books">Books</InputLabel>
            //                 <Select
            //                     variant="filled"
            //                     margin="dense"
            //                     className={classes.selectMenu}
            //                     value={selectedBook}
            //                     onChange={(e) => dispatch(setSelectedBook(e.target.value))}
            //                     inputProps={{
            //                         id: 'select-books',
            //                     }}
            //                 >
            //                     {this.displayBooks()}
            //                 </Select>
            //             </FormControl>
            //             <br />
            //             <br />
            //         </Grid>
            //     </Grid>
            // </Grid>
            <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Select Book</InputLabel>
        <Select
                                variant="filled"
                                margin="dense"
                                // className={classes.selectMenu}
                                value={selectedBook}
                                onChange={(e) => dispatch(setSelectedBook(e.target.value))}
                                // inputProps={{
                                //     id: 'select-books',
                                // }}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
        //   value={age}
        //   onChange={handleChange}
        >
            {this.displayBooks()}
          {/* <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem> */}
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

// export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MenuBar))
export default compose(
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps)
 )(withRouter(MenuBar))