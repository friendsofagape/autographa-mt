import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import ComponentHeading from '../ComponentHeading';
import { ListItem, Typography} from '@material-ui/core';
import { Divider } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import apiUrl from '../GlobalUrl';
import { saveReference } from '../../store/actions/sourceActions';
import { connect } from 'react-redux';
import { fetchConcordances, setReference } from '../../store/actions/projectActions';

const styles = (theme) => ({
	root: {
		display: 'flex',
		flexGrow: 1,
	},
	highlightToken: {
		color: 'blue',
		backgroundColor: 'yellow',
	},
	textDisplay: {
		// padding: theme.spacing(),
		// color: theme.palette.text.secondary,
		backgroundColor: '#fff',
		height: '120px',
		overflow: 'auto',
		textAlign: 'justify',
		lineHeight: '20px',
	},
	containerGrid: {
		// width: '97%',
		// marginLeft: '2%',
		// marginRight: '2%',
		// border: '1px solid "#2a2a2fbd"',
		// // boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
		// height: '320px',
		// backgroundColor: '#fff',
	},
});

class Concordance extends Component {
	state = {
		concordance: '',
		currentToken: '',
	};

	lengthCheck(item) {
		var num = item.toString();
		if (num.length === 1) {
			return '0' + num;
		} else {
			return num;
		}
	}

	async getVerseText(token, sourceId, book) {
		if (book) {
			const data = await fetch(apiUrl + 'v1/concordances/' + sourceId + '/' + book + '/' + token, {
				method: 'GET',
			});
			const concordance = await data.json();
			await this.setState({ concordance: concordance });
		}
	}

	componentDidUpdate(prevProps) {
		const { selectedToken, selectedProject, selectedBook, dispatch } = this.props;
		if (prevProps.selectedToken !== selectedToken) {
			dispatch(fetchConcordances(selectedToken, selectedProject.sourceId, selectedBook));
			// this.getVerseText(token, project.sourceId, book )
		}
	}

	// componentWillReceiveProps(nextProps){

	// }

	storeBCV = (book, chapter, verse) => {
		this.props.dispatch(
			setReference({
				reference: book + this.lengthCheck(chapter) + this.lengthCheck(verse),
				verseNum: {
					book: book,
					chapter: this.lengthCheck(chapter),
					verse: this.lengthCheck(verse),
				},
			})
		);
	};

	displayConcordance(value, token) {
		if (!value) {
			return <p style={{paddingLeft:"3%", fontSize:"75%", color:'#b1b2b3'}} >Select token to load data</p>;
		}else if(value.length >0){
			return value.map((item, index) => {
				const bcv = item.book + item.chapterNumber + item.verseNumber;
				const { book, chapterNumber, verseNumber, verse, bookCode } = item;
				return (
					<div key={bcv + 'p' + index} style={{paddingTop:"0%"}}>
						<ListItem
							button
							value={bcv}
							onClick={() => this.storeBCV(bookCode, chapterNumber, verseNumber)}
						>
							<p style={{margin:"0%", fontSize:"75%"}}>
								{book.toUpperCase()} {chapterNumber}:{verseNumber}&nbsp;
								{verse.split(' ').map((span, index) => {
									if (span.includes(token.split(' ')[0])) {
										return (
											<span
												key={bcv + span + index}
												className={this.props.classes.highlightToken}
											>
												{token}&nbsp;
											</span>
										);
									} else {
										return <span key={bcv + span + index}  > {span}&nbsp; </span>;
									}
								})}
							</p>
						</ListItem>
						<Divider />
					</div>
				);
			});
		} 
		else {
			return <p style={{paddingLeft:"3%", fontSize:"75%", color:'#b1b2b3'}} >No data available</p>;
		}
	}
	render() {
		const { classes } = this.props;
		const { selectedBook, selectedToken, concordance } = this.props;
		// const { concordance } = this.state
		return (
			<Grid container sm={12} className={classes.containerGrid}>
				<Grid item sm={12} >
					<Typography component="h4" variant="h7" style={{textAlign:"left" ,padding:"1%"}}>
                   		{selectedBook.toUpperCase()} Concordance
					</Typography>
				</Grid>
				<Grid item sm={12} style={{height: '100px'}}>
					<Grid item sm={12} style={{height: "100%",overflowX: "hidden", overflowY: "auto"}}>
						{this.displayConcordance(concordance[selectedBook.toLowerCase()], selectedToken)}
					</Grid>
				</Grid>

				<Typography component="h4" variant="h7" style={{textAlign:"left" ,padding:"1%"}}>
                	All Books Concordance
				</Typography>
				<Grid item sm={12} style={{height: '100px'}}>
					<Grid item sm={12} style={{height: "100%",overflowX: "hidden", overflowY: "auto"}}>
						{this.displayConcordance(concordance.all, selectedToken)}
					</Grid>
				</Grid>


				{/* <Grid item sm={12} >
					<Typography component="h4" variant="h7" style={{textAlign:"left" ,padding:"1%"}}>
                   		All Books Concordance
					</Typography>
					<Grid item sm={12} style={{overflow:'auto', height:"20%"}}>
						{this.displayConcordance(concordance.all, selectedToken)}
					</Grid>
				</Grid>
				 */}



				
				{/* <Grid item xs={12} className={classes.textDisplay}>
					{this.displayConcordance(concordance.all, selectedToken)}
				</Grid> */} 



				{/* </Grid> */}
				{/* </Paper> */}
			</Grid>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		selectedProject: state.project.selectedProject,
		selectedToken: state.project.selectedToken,
		selectedBook: state.project.selectedBook,
		concordance: state.project.concordance,
	};
};

const mapDispatchToProps = (dispatch) => ({
	dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Concordance));
