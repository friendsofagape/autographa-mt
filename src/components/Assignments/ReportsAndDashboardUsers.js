import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import { Paper } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import apiUrl from '../GlobalUrl';
import {
	getAssignedUsers,
	fetchUsers,
} from '../../store/actions/userActions';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';
import CircleLoader from '../loaders/CircleLoader';
import swal from 'sweetalert';
import Box from '@material-ui/core/Box';


const styles = (theme) => ({
	root: {
		flexGrow: 1,
        padding: theme.spacing(8),
        paddingLeft:'4%',
        paddingRight:'4%'
	},
	disabled: {
		color: "lightgrey"
	  },
	toolbar: theme.mixins.toolbar,
	gridSize: {
		height: 340,
		width: 300,
	},
	listItem: {
		border: '1px solid #eee',
	},
	checkBox: {
		border: '1px solid #eee',
	},
	statisticsPane: {
		minHeight: '50px',
	},
	bookCard: {
		width: '400px',
	},
});

function LinearProgressWithLabel(props){                    //This function is to get linear progress bar
	return (
		<Box display="flex" alignItems="center" >
			<Box width= "100%" mr={2} style={{width: "30%", marginRight: "0px"}} alignItems="right">
				<LinearProgress variant="determinate" value={props.completedValue} style={{width: '50px'}} />
			</Box>
			<Box minWidth={65} style={{align: "top"}}>
				<Typography variant="h2" color="textSecondary" style={{fontSize: 12}}>
					{`${props.translatedValue} / ${props.value}`}
				</Typography>
			</Box>
		</Box>
	)
}

class AssignUser extends Component {
	state = {
		assignedUsers: [],
		userId: '',
		projectId: '',
		statistics: null,
		bookList: {},
	};

	async getProjectStatistcs() {                               //To get the Project Statistics
        try {
			const { location } = this.props;
		    const projectId = location.pathname.split('/').pop();
            // console.log("statisticsSummary",this.props)
            const data = await fetch(apiUrl + 'v1/autographamt/statistics/projects/' + projectId)
            const response = await data.json()
            // console.log('statistics response', response)
            if (response.success === false) {
                swal({
                    title: 'Statistics',
                    text: 'Unable to fetch statistics information: ' + response.message,
                    icon: 'error'
                })
            } else {
                this.setState({ bookList: response })
            }
        }
        catch (ex) {
            swal({
                title: 'Statistics',
                text: 'Unable to fetch statistics, check your internet connection or contact admin ' + ex,
                icon: 'error'
            })
        }
    }

	componentDidMount() {
		const { dispatch, location } = this.props;
		const projectId = location.pathname.split('/').pop();
		dispatch(fetchUsers());
		dispatch(getAssignedUsers(projectId));
		this.getProjectStatistcs()
	}

	displayAssignedUsers = () => {                                 //This function is for the datas of assigned users
		const { assignedUsers } = this.props;
		const { bookList } = this.state
		const bookWiseDatas = bookList.bookWiseData
	    //  console.log('stateeeeeeeeeee',bookList )
		return assignedUsers.map((user, i) => {
			const { books } = user
			const { userName, email, userId } = user.user;
			// console.log('stateeeeeeeeeee',user )
			let matches = [];
			if(bookWiseDatas != null){ 
			for(var i in books){
                    for (var j in Object.keys(bookList.bookWiseData)){
						if(books[i] == Object.keys(bookList.bookWiseData)[j]) 
							matches.push(Object.values(bookList.bookWiseData)[j])
					}
			    }
		    }
         // console.log('stateeeeeeeeeee',user )
          return matches.map ((matches,i) =>{
			return (
				<TableRow key={i}>
				   <TableCell align="left">
						{matches.bookName}
					</TableCell>
					<TableCell align="center">{userName}</TableCell>
					<TableCell align="center">{email}</TableCell>
					<TableCell align="center"  key={i}>
				    	<LinearProgressWithLabel 
						value={matches.allTokensCount} 
						translatedValue = {matches.translatedTokensCount} 
						completedValue ={matches.completed} />
					</TableCell>
					<TableCell align="center">
						{matches.completed}%
					</TableCell>
		 		</TableRow>
			);
		  })
		});
	};
	
	displayAssignedUsersCount =() => {                                 //This function is for the total assigned books and users
		const { assignedUsers } = this.props;
		const booksNumber = assignedUsers.map((user,i) => {
			const {books } = user
			return books.length
		})
		let sum = 0;
		const reducer = (a,c) => a + c;
		sum = booksNumber.reduce(reducer,0);
	    // console.log('stateeeeeeeeeee',sum)
		return (
			<TableRow >
				<TableCell align="right"> 
				</TableCell>
				<TableCell align="right"> 
				</TableCell>
				<TableCell align="right"> 
				</TableCell>
				<TableCell align="right" style ={{color: 'blue'}}> <h4>Assigned Books: {sum}</h4>
				</TableCell>
				<TableCell align="right" style ={{color: 'blue'}}><h4> Assigned Users: {assignedUsers.length}</h4>
				</TableCell>
			</TableRow>
		    )
}

	render() {
		const { classes, isFetching, location } = this.props;
		return (
			<div className={classes.root}>
            {isFetching && <CircleLoader />}
				<Paper className={classes.root}>       
				<Grid item sm={12} style={{backgroundColor:'#f2eddf'}}>
                    <Typography component="h4" variant="h6" style={{textAlign:"center" ,padding:"2%"}}>
				        ASSIGNED BOOKS{/*Heading of the page*/}
				    </Typography>
                </Grid>    
				<Table className={classes.table}>            
					<TableHead>                                                                  
						<TableRow>
							<TableCell align="left"><h4>BOOK NAME</h4></TableCell>{/*Headings of the columns*/}
							<TableCell align="center"><h4>USER</h4></TableCell>
							<TableCell align="center"><h4>EMAIL ID</h4></TableCell>
							<TableCell align="left"><h4>TRANSLATION PROGRESS</h4></TableCell>
							<TableCell align="center"><h4>DRAFT READY</h4></TableCell>
						</TableRow>
					</TableHead>
				<TableBody >{this.displayAssignedUsers()}</TableBody>{/*To get user data*/}
				<TableBody>{this.displayAssignedUsersCount()}</TableBody>{/*To get users and books count*/}
				</Table>
				</Paper> 
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		assignedUsers: state.user.assignedUsers,
		isFetching: state.user.isFetching,
	};
};

const mapDispatchToProps = (dispatch) => ({
	dispatch,
});

export default compose(withStyles(styles), 
connect(mapStateToProps, mapDispatchToProps))
(withRouter(AssignUser));
