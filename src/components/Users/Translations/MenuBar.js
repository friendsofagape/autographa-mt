import React, { Component } from 'react';
import { FormControl, Grid, MenuItem, Select, InputLabel } from '@material-ui/core';
import apiUrl from '../../GlobalUrl';
import { withStyles } from '@material-ui/core/styles';


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
    
    async getTokenList(book) {
        // const { updateState } = this.props
        // updateState({book: book})

        const { sourceId, updateState } = this.props
        console.log(apiUrl +  'v1/tokenlist/' + sourceId + '/' + book)
        var bookData = await fetch(apiUrl +  'v1/tokenlist/' + sourceId + '/' + book, {
            method: 'GET'
        })
        const tokenList = await bookData.json();
        updateState({tokenList: tokenList, book})
    }

    onBookSelection = (book) => {
        this.getTokenList(book)
    }

    displayBooks() {
        const { books } = this.props
        if (books) {
            return books.map(item => {
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
        // console.log(this.props)
        return (
            <Grid container item xs={12} className={classes.selectionGrid}>
            <Grid container item xs={8}>
                <Grid item xs={2} md={2}>
                        <FormControl>
                            <InputLabel htmlFor="select-books">Books</InputLabel>
                            <Select
                                className={classes.selectMenu}
                                value={book}
                                onChange={(e) => this.onBookSelection(e.target.value)}
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

export default withStyles(styles)(MenuBar);