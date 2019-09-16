import React, { Component } from 'react'
import { Grid } from '@material-ui/core';
import ComponentHeading from '../ComponentHeading';
import { ListItem } from '@material-ui/core';
import { Divider } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import apiUrl from '../GlobalUrl';
import { saveReference } from '../../store/actions/sourceActions';
import { connect } from 'react-redux';

const styles = theme => ({
    root: {
        display:'flex',
        flexGrow: 1,
      },
      highlightToken: {
        color: 'blue',
        backgroundColor: 'yellow'
      },
      textDisplay: {
        padding: theme.spacing(),
        color: theme.palette.text.secondary,
        backgroundColor: '#fff',
        height: 165,
        overflow: 'auto',
        textAlign: 'justify',
        lineHeight: '20px',
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

class Concordance extends Component {
    state = {
        concordance: '',
        currentToken: ''
    }

    lengthCheck(item){
        var num = item.toString()
        if(num.length === 1){
            return '0' + num
        }else{
            return num
        }
    }

    async getVerseText(token, sourceId, book ) {
        if(book){
            const data = await fetch(apiUrl + '/v1/concordances/' + sourceId + '/' + book + '/' + token, {
                method: 'GET'
            })
            const concordance = await data.json()
            await this.setState({ concordance: concordance })
        }
    }

    componentWillReceiveProps(nextProps){
        const { token, project, book } = nextProps
        if(token){
            this.getVerseText(token, project.sourceId, book )
        }
    }

    storeBCV = (book, chapter, verse) => {
        this.props.saveReference({
            reference: book + this.lengthCheck(chapter) + this.lengthCheck(verse),
            verseNum:{
                book:book,
                chapter: this.lengthCheck(chapter),
                verse: this.lengthCheck(verse)
            }
        })
    }

    displayConcordance(value, token) {
        if (value) {
            return value.map((item, index) => {
                const bcv = item.book + item.chapterNumber + item.verseNumber
                const { book, chapterNumber, verseNumber, verse, bookCode } = item
                return (
                    <div
                    key={bcv + 'p' + index}>
                    <ListItem button
                    value={bcv}
                    onClick={() => this.storeBCV(bookCode, chapterNumber, verseNumber)}>
                    <p>{book.toUpperCase()} {chapterNumber}:{verseNumber}&nbsp;
                    {verse.split(" ").map((span, index) => {
                        if (span.includes(token)) {
                            return (
                                <span key={bcv + span + index} 
                                className={this.props.classes.highlightToken} 
                                >
                                 {span}&nbsp;
                                 </span>
                            )
                        } else {
                            return (
                                <span key={bcv + span + index}> {span}&nbsp; </span>
                            )
                        }
                    }
                    )}
                    </p>
                    </ListItem>
                    <Divider />
                    </div>
                )
            })
        } else {
            return <p>Select Token to Load Data</p>
        }
    }
    render() {
        const { classes } = this.props
        const { book, token } = this.props
        const { concordance } = this.state
        return (
            <Grid container item xs={12} className={classes.containerGrid}>
                {/* <Paper className={classes.tokenList}> */}
                <Grid item xs={12}>
                    <Grid item xs={12}>
                        <ComponentHeading data={{
                            classes: classes,
                            text: `${book.toUpperCase()} Concordance`,
                            styleColor: "#2a2a2fbd"
                        }} />
                    </Grid>
                    <Grid item xs={12} className={classes.textDisplay}>

                        {this.displayConcordance(concordance[book.toLowerCase()], token)}
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid item xs={12}>
                        <ComponentHeading data={{
                            classes: classes,
                            text: `All Books Concordance`,
                            styleColor: "#2a2a2fbd"
                        }} />
                    </Grid>
                    <Grid item xs={12} className={classes.textDisplay}>
                        {this.displayConcordance(concordance.all, token)}
                    </Grid>
                </Grid>
                {/* </Paper> */}
            </Grid>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        project: state.sources.project,
        token: state.sources.token,
        book: state.sources.book
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveReference: (reference) => dispatch(saveReference(reference))
    }
}

export default connect(mapStateToProps,mapDispatchToProps )(withStyles(styles)(Concordance))