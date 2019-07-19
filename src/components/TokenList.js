import React, { Component } from 'react';
import { Grid, ListItem, Divider } from '@material-ui/core';
import ComponentHeading from './ComponentHeading';
import apiUrl from './GlobalUrl'

export default class TokenList extends Component {
    state = {
        tokenList: [],
        currentBook: '',
        currentToken: ''
    }

    async getTokenList(currentBook, sourceId) {
        var bookData = await fetch(apiUrl + 'v1/tokenlist/' + sourceId + '/' + currentBook, {
            method: 'GET'
        })
        const tokenList = await bookData.json();
        this.setState({ tokenList: tokenList })
    }

    componentWillReceiveProps(nextProps) {
        const { book, sourceId, token } = nextProps.data
        this.setState({ currentBook: book, sourceId: sourceId, currentToken:token})
        if(book){
            this.getTokenList(book, sourceId)
        }
    }

    handleClick = e => {
        var word = e.target.getAttribute('value')
        const { currentToken } =  this.state
        if(word !== currentToken){
            this.props.data.updateState({ token: word, reference:'', verseNum: '' })
        }
    }

    getTokens() {
        const { tokenList } = this.state
        if (tokenList) {
            return tokenList.map((item, index) => {
                return (
                    <div
                        key={item + index}>
                        <ListItem button
                            name={item}
                            value={item}
                            onClick={this.handleClick}>{item}
                        </ListItem>
                        <Divider />
                    </div>
                )
            })
        }else{
            return <ListItem>No tokens</ListItem>
        }
    }

    render() {
        const { classes } = this.props.data
        return (
            <Grid item xs={12} className={classes.containerGrid}>
                <Grid item xs={12}>
                    <ComponentHeading data={{ classes: classes, text: "Token List" }} />
                </Grid>
                <Grid item xs={12} className={classes.tokenList}>
                    {this.getTokens()}
                </Grid>
            </Grid>
        )
    }
}
