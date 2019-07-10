import React, { Component } from 'react'
import { Grid } from '@material-ui/core';
import ComponentHeading from '../../ComponentHeading';
import { ListItem } from '@material-ui/core';
import { Divider } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        display: 'flex',
    },
    textDisplay: {
      padding: theme.spacing.unit,
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
    highlightToken: {
      color: 'blue',
      backgroundColor: 'yellow'
    },
});

class Concordance extends Component {
    state = {
        translationNotes:''
    }

    lengthCheck(item){
        var num = item.toString()
        if(num.length === 1){
            return '0' + num
        }else{
            return num
        }
    }

    async getTranslationNotes(book, chapter, verse){
        // const result
        try{
            const data = await await fetch('https://git.door43.org/api/v1/repos/BCS-EXEGETICAL/hi_tN/raw/Content%2F' + book.toUpperCase() +  '%2F' + chapter + '%2F' + verse + '.md', {
                // const data = await await fetch("https://git.door43.org/api/v1/repos/BCS-EXEGETICAL/hi_tN/raw/Content%2F1CO%2F01%2F01.md", {
                
                method:'GET',
                // mode: "no-cors",
                header: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
                }
              })
            // console.log('https://git.door43.org/BCS-EXEGETICAL/hi_tN/raw/branch/master/Content/' + book.toUpperCase() +'/' + chapter + '/' + verse + '.md')
            const result = await data.text()
            const { updateState } = this.props.data
            await this.setState({translationNotes:result})
            updateState({translationNotes: result})
        }
        catch(ex){
            console.log('No data')
            console.log(ex)
            const { updateState } = this.props.data
            await this.setState({translationNotes:"None"})
            updateState({translationNotes: "No data available"})
        }
    }
    

    storeBCV = (book, chapter, verse) => {
        const { updateState } = this.props.data
        this.getTranslationNotes(book, this.lengthCheck(chapter), this.lengthCheck(verse))
        updateState({translationNotes:this.state.translationNotes})
    }

    displayConcordance(value, token) {
        if (value) {
            return value.map((item, index) => {
                const bcv = item.book + item.chapterNumber + item.verseNumber
                const { book, chapterNumber, verseNumber, verse, bookCode } = item
                return (
                    <div>
                    <ListItem button
                    key={bcv + 'p' + index}
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
        const { concordance, book, token } = this.props.data
        const { classes } = this.props
        return (
            <Grid container item xs={12} className={classes.containerGrid}>
                <Grid item xs={12}>
                    <Grid item xs={12}>
                        <ComponentHeading data={{
                            classes: classes,
                            text: `${book.toUpperCase()} Concordance`,
                            styleColor:"#2a2a2fbd" 
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
                            styleColor:"#2a2a2fbd" 
                        }} />
                    </Grid>
                    <Grid item xs={12} className={classes.textDisplay}>
                        {this.displayConcordance(concordance.all, token)}
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles)(Concordance);