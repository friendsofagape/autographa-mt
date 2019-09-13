import React, { Component } from 'react';
import { FormControl, Grid, MenuItem, Select, InputLabel } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { selectBook } from '../../../store/actions/sourceActions';


const styles = theme => ({
    selectionGrid: {
        marginLeft: '4%',
        marginTop: '1%'
    },
    selectMenu: {
        width: '120px',
    },
});

class MenuBar extends Component {

    displayBooks() {
        const { project } = this.props
        if (project) {
            return project.books.map(item => {
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
        const { classes, book } = this.props
        console.log(this.props)
        return (
            <Grid container item xs={12} className={classes.selectionGrid}>
                <Grid container item xs={8}>
                    <Grid item xs={2} md={2}>
                        <FormControl>
                            <InputLabel htmlFor="select-books">Books</InputLabel>
                            <Select
                                variant="outlined"
                                className={classes.selectMenu}
                                value={book}
                                onChange={(e) => this.props.selectBook({ book: e.target.value })}
                                inputProps={{
                                    id: 'select-books',
                                }}
                            >
                                {this.displayBooks()}
                            </Select>
                        </FormControl>
                        <br />
                        <br />
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        project: state.sources.project,
        book: state.sources.book
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectBook: (project) => dispatch(selectBook(project))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MenuBar))