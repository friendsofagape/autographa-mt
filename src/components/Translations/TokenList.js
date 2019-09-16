import React, { Component } from 'react';
import { Grid, ListItem, Divider } from '@material-ui/core';
import ComponentHeading from '../ComponentHeading';
import apiUrl from '../GlobalUrl'
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { selectToken } from '../../store/actions/sourceActions';

const styles = theme => ({
    root: {
        display: 'flex',
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
        border: '1px solid "#2a2a2fbd"',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
        height: '100%',
        backgroundColor: '#fff',
    },
});

class TokenList extends Component {
    state = {
        tokenList: []
    }

    async getTokenList(currentBook, sourceId) {
        var bookData = await fetch(apiUrl + 'v1/tokenlist/' + sourceId + '/' + currentBook, {
            method: 'GET'
        })
        const tokenList = await bookData.json();
        this.setState({ tokenList: tokenList })
    }

    componentWillReceiveProps(nextProps) {
        const { book, project } = nextProps
        if(book){
            this.getTokenList(book, project.sourceId)
        }else{
            this.setState({tokenList: []})
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
                            onClick={() => this.props.selectToken({token: item})}>{item}
                        </ListItem>
                        <Divider />
                    </div>
                )
            })
        } else {
            return <ListItem>Select Target Language to display tokens</ListItem>
        }
    }

    render() {
        const { classes } = this.props
        return (
            <Grid item xs={12} className={classes.containerGrid}>
                <Grid item xs={12}>
                    <ComponentHeading data={{
                        classes: classes, text: "Token List",
                        styleColor: "#2a2a2fbd"
                    }} />
                </Grid>
                <Grid item xs={12} className={classes.tokenList}>
                    {this.getTokens()}
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
        selectToken: (project) => dispatch(selectToken(project))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TokenList))