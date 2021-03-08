import React, { Component } from 'react';
import { Button, Grid } from '@material-ui/core';
import { ListItem, Typography} from '@material-ui/core';
import { Divider } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import apiUrl from '../GlobalUrl';
import { connect } from 'react-redux';
import swal from 'sweetalert';



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
		backgroundColor: '#fff',
		height: '120px',
		overflow: 'auto',
		textAlign: 'justify',
		lineHeight: '20px',
	}
});

class Concordance extends Component {
	
	state = {
		concordance: '',
		tokenSelected:'',
	};


	componentWillReceiveProps(nextProps) {
		if(this.props.tokenSelected != nextProps.tokenSelected){
			this.setState({
        	        tokenSelected:'',			
					concordance:''
        	    })
			}

	}

	// Fetching data from db
	async  getConcordance(){
		if(this.props.tokenSelected !=''){
		if(this.state.tokenSelected !== this.props.tokenSelected){
			const  sourceId  = this.props.selectedProject.sourceId;
			const book  = this.props.bkvalue;
			const token  = this.props.tokenSelected


			try {
				const response = await fetch(apiUrl + 'v1/concordances/' + sourceId + '/' + book + '/' + token, {
					method: 'GET'
				});
				const json = await response.json();
				this.setState({concordance:json})
			}
			catch (ex) {
				swal({
					title: 'Token translation',
					text: 'Token translation failed, check your internet connection or contact admin',
					icon: 'error'
				});
			}
		
			this.setState({
				tokenSelected:this.props.tokenSelected
			})
		}}
        
        
    }

	// display concordance in list view
	displayConcordance(value, token) {
		if (value) {
			if(value.length >0){
				return value.map((item, index) => {
					const bcv = item.book + item.chapterNumber + item.verseNumber;
					const { book, chapterNumber, verseNumber, verse, bookCode } = item;
					return (
						<div key={bcv + 'p' + index} style={{paddingTop:"0%"}}>
							<ListItem>
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
		} 
	}

	render() {
		return (
			<Grid container sm={12}>
				<Grid item sm={12} >
					<Typography component="h4" variant="h7" style={{textAlign:"left" ,padding:"1%"}}>
                   		{this.props.bkvalue.toUpperCase()} Concordance
					</Typography>
				</Grid>

				<Grid item sm={12} style={{height: '100px'}}>
					<Grid item sm={12} style={{height: "100%",overflowX: "hidden", overflowY: "auto"}}>
						{!this.state.concordance &&
						<Grid style={{paddingTop:'11%', paddingLeft:'38%'}}>
							<Button size={'small'} 
							color={'primary'} 
							variant="contained" 
							disabled={!this.props.tokenSelected}
							onClick={()=>{this.getConcordance()}}>
								<span style={{fontSize:'68%'}}>Load</span>
							</Button>
						</Grid>
						}
						{this.displayConcordance(this.state.concordance[this.props.bkvalue.toLowerCase()], this.props.tokenSelected)}
					</Grid>
				</Grid>

				<Typography component="h4" variant="h7" style={{textAlign:"left" ,padding:"1%"}}>
                	All Books Concordance
				</Typography>
				<Grid item sm={12} style={{height: '100px'}}>
					<Grid item sm={12} style={{height: "100%",overflowX: "hidden", overflowY: "auto"}}>
						{this.displayConcordance(this.state.concordance.all, this.props.tokenSelected)}
					</Grid>
				</Grid>
				
			</Grid>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		selectedProject: state.project.selectedProject,
		selectedBook: state.project.selectedBook,
	};
};

const mapDispatchToProps = (dispatch) => ({
	dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Concordance));
