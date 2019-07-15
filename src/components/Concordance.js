import React, { Component } from 'react'
import { Grid } from '@material-ui/core';
import ComponentHeading from './ComponentHeading';
import { ListItem } from '@material-ui/core';
import { Divider } from '@material-ui/core';

export default class Concordance extends Component {
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

            // this.setState({translationNotes:"No data available"})
        }
        finally{
            console.log('finally')
        }
        // if(result){
        //     return result
        // }
    }
    

    storeBCV = (book, chapter, verse) => {
        const { updateState } = this.props.data
        this.getTranslationNotes(book, this.lengthCheck(chapter), this.lengthCheck(verse))
        updateState({translationNotes:this.state.translationNotes})
    }


    // async getTranslationNotes(){
    //     const data = await fetch('https://git.door43.org/api/v1/repos/BCS-EXEGETICAL/hi_tN/raw/Content%2F1CO%2F01%2F01.md', {
    //         method:'GET',
    //         // mode: "no-cors",
    //         header: {
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json'
    //         }
    //       })
    //     console.log(data)
    //     // console.log(typeof data)
    //     // if(data.ok){
    //         const myJson = await data.text()
    //         this.setState({markdown: myJson})
    //     // }
    // }

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
                                className={this.props.data.classes.highlightToken} 
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
                    // <p key={bcv + 'p'}>
                    //     <span>{item.book.toUpperCase()} {item.chapterNumber}:{item.verseNumber} </span>
                    //     {item.verse.split(" ").map((span, index) => {
                    //         if (span.includes(token)) {
                    //             return (
                    //                 <span key={bcv + span + index} 
                    //                 className={this.props.data.classes.highlightToken} 
                    //                 onClick={() => this.storeBCV(item.bookCode, item.chapterNumber, item.verseNumber)}>
                    //                  {span} 
                    //                  </span>
                    //             )
                    //         } else {
                    //             return (
                    //                 <span key={bcv + span + index}> {span} </span>
                    //             )
                    //         }
                    //     }
                    //     )}
                    // </p>
                )
            })
        } else {
            return <p>Select Token to Load Data</p>
        }
    }
    render() {
        // console.log("concord", this.props.data)
        const { classes, concordance, book, token } = this.props.data
        return (
            <Grid container item xs={12} className={classes.containerGrid}>
                {/* <Paper className={classes.tokenList}> */}
                <Grid item xs={12}>
                    <Grid item xs={12}>
                        <ComponentHeading data={{
                            classes: classes,
                            text: `${book.toUpperCase()} Concordance`
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
                            text: `All Books Concordance`
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
