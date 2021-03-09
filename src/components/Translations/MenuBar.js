import React, { Component } from 'react';
import { FormControl, Grid, MenuItem, Select, InputLabel } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';

const styles = theme => ({
    selectionGrid: {
        marginLeft: '4%',
    },
    formControl: {
        minWidth: 120,
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
    
    // sort the books in bible order
    displayBooks() {
        const { userProjects, location } = this.props
        const books = ["gen", "exo", "lev", "num", "deu", "jos", "jdg", "rut", "1sa", "2sa", 
        "1ki", "2ki", "1ch", "2ch", "ezr", "neh", "est", "job", "psa", "pro", "ecc", "sng", 
        "isa", "jer", "lam", "ezk", "dan", "hos", "jol", "amo", "oba", "jon", "mic", "nam", "hab",
        "zep", "hag", "zec", "mal", "mat", "mrk", "luk", "jhn", "act", "rom", "1co", "2co", "gal",
        "eph", "php", "col", "1th", "2th", "1ti", "2ti", "tit", "phm", "heb", "jas", "1pe", "2pe", "1jn", 
        "2jn", "3jn", "jud", "rev"]
        if (userProjects.length > 0 ) {
            const data = userProjects.filter(project => project.projectId === parseInt(location.pathname.split('/').pop()));
            let assignedBooks = [];
            books.map((book)=>{                                                                              //map function for pushing the books in order
            return data[0].books.includes(book)? assignedBooks.push(book): null
            })
            return assignedBooks.map(item => {                                                               //map function for displaying books on UI
                return ( 
                    <MenuItem key={item} value={item} style={{fontSize:"80%"}}>{item.toUpperCase()}</MenuItem>
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
    }

    render() {
        const { classes } = this.props
        return (
            <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Select Book</InputLabel>
                <Select
                    margin="dense"
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
    }
}

const mapDispatchToProps = (dispatch) => ({
    dispatch
})

export default compose(
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps)
 )(withRouter(MenuBar))