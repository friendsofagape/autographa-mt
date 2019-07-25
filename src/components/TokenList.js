import React, { Component } from 'react';
import { Grid, ListItem, Divider } from '@material-ui/core';
import ComponentHeading from './ComponentHeading';
import apiUrl from './GlobalUrl'
import { connect } from 'react-redux'
import { saveToken } from '../store/actions/sourceActions'
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        display:'flex',
        flexGrow: 1,
      },
      tokenList: {
        textAlign: 'center',
        color: theme.palette.text.secondary,
        height: 360,
        overflowX: 'hidden',
        overflowY: 'auto',
        backgroundColor: '#fff',
      },
      containerGrid: {
        width: '97%',
        marginLeft: '2%',
        marginRight: '2%',
        border: '1px solid #3e51b5',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
        height: '100%',
        backgroundColor: '#fff',
      },
});


class TokenList extends Component {
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
        const { book, sourceId } = nextProps
        // this.setState({ currentBook: book, sourceId: sourceId, currentToken:token})
        if(book){
            this.getTokenList(book, sourceId)
        }else{
            this.setState({tokenList: []})
        }
    }

    handleClick = e => {
        var word = e.target.getAttribute('value')
        const { currentToken } =  this.state
        if(word !== currentToken){
            this.props.saveToken({ token: word, reference:'', verseNum: '' })
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
        const { classes } = this.props
        // console.log("REDUX - toeknlidt", this.props)
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

const mapStateToProps = (state) =>{
    return {
        sourceId: state.sources.sourceId,
        book: state.sources.book,
        token: state.sources.token
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveToken: (token) => dispatch(saveToken(token))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TokenList))