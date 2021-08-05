import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import { Paper } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Typography } from "@material-ui/core";
import { connect } from "react-redux";
import apiUrl from "../GlobalUrl";
import { getAssignedUsers, fetchUsers } from "../../store/actions/userActions";
import compose from "recompose/compose";
import { withRouter } from "react-router-dom";
import CircleLoader from "../loaders/CircleLoader";
import swal from "sweetalert";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

import DataTable from "react-data-table-component";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
	bibleBookNewTestments,
	bibleBookOldTestments,
} from "./BibleOldNewTestment";

// const styles = (theme) => ({
// root: {
// 	flexGrow: 1,
//     padding: theme.spacing(8),
//     paddingLeft:'4%',
//     paddingRight:'4%'
// },
// disabled: {
// 	color: "lightgrey"
//   },
// toolbar: theme.mixins.toolbar,
// gridSize: {
// 	height: 340,
// 	width: 300,
// },
// listItem: {
// 	border: '1px solid #eee',
// },
// checkBox: {
// 	border: '1px solid #eee',
// },
// statisticsPane: {
// 	minHeight: '50px',
// },
// bookCard: {
// 	width: '400px',
// },
// });

function LinearProgressWithLabel(props) {
	//This function is to get linear progress bar
	return (
		<Box display="flex" alignItems="center">
			<Box
				width="100%"
				mr={2}
				style={{ width: "30%", marginRight: "0px" }}
				alignItems="right"
			>
				<LinearProgress
					variant="determinate"
					value={props.completedValue}
					style={{ width: "50px" }}
				/>
			</Box>
			<Box minWidth={65} style={{ align: "top" }}>
				<Typography
					variant="h2"
					color="textSecondary"
					style={{ fontSize: 12 }}
				>
					{`${props.translatedValue} / ${props.value}`}
				</Typography>
			</Box>
		</Box>
	);
}

// const useStyles = makeStyles((theme) => createStyles({}));

const accessToken = localStorage.getItem("accessToken");

export default function UsersReports(props) {
	const [assignedUsers, setAssignedUsers] = React.useState([]);
	// const [userId, setUserId] = React.useState("");
	// const [projectId, setProjectId] = React.useState("");
	// const [oldBooksLength, setOldBooksLength] = React.useState(null);
	// const [newBooksLength, setNewBooksLength] = React.useState(null);
	const [bookList, setBookList] = React.useState({});
	const [bookNTlist, setbookNTlist] = React.useState(null);

	const [open, setOpen] = React.useState(false);
	const [scroll, setScroll] = React.useState("paper");
	const [loading, setLoading] = React.useState(false);

	const [proId, setProId] = React.useState(0);

	const stoploading = () => {
		setLoading(false);
	};

	const handleCloses = () => {
		setOpen(false);
	};

	const descriptionElementRef = React.useRef(null);
	React.useEffect(() => {
		if (open) {
			const { current: descriptionElement } = descriptionElementRef;
			if (descriptionElement !== null) {
				descriptionElement.focus();
			}
		}
	}, [open]);

	const getResults = async () => {
		const projectId = props.value.split("/")[0];
		// statstic page
		const data = await fetch(
			apiUrl + "v1/autographamt/statistics/projects/" + projectId
		);
		const response = await data.json();
		if (data.status != 200) {
			swal({
				title: "Statistics",
				text:
					"Unable to fetch statistics information: " +
					response.message,
				icon: "error",
			});
		} else {
			setBookList(response);
		}
		//  user information
		const data1 = await fetch(
			apiUrl + "v1/autographamt/projects/assignments/" + projectId,
			{
				method: "GET",
				headers: {
					Authorization: "bearer " + accessToken,
				},
			}
		);
		const response1 = await data1.json();
		if (data1.status != 200) {
			swal({
				title: "Statistics",
				text: "Unable to fetch User information: " + response.message,
				icon: "error",
			});
		} else {
			setAssignedUsers(response1);
		}
		setProId(projectId);
		stoploading();
	};

	const handleClickOpen = (scrollType) => () => {
		const projectIdCheck = props.value.split("/")[0];

		if (proId != projectIdCheck) {
			setLoading(true);
			setOpen(true);
			setScroll(scrollType);
			getResults();
		} else {
			setOpen(true);
		}
	};

	const displayOldBooks = () => {
		//Function for old testament books along with the assigned users
		//This function is for the datas of assigned users
		const bookWiseDatas = bookList.bookWiseData;
		const combineDict = {};
		assignedUsers.map((data) => {
			const { books } = data;
			const { userName, email } = data.user;
			books.map((bk) => {
				const checkBook = bookWiseDatas[bk];
				if (checkBook) {
					const addData = checkBook;
					addData.userName = userName;
					addData.email = email;
					combineDict[bk] = addData;
				}
			});
		});

		const book_keys = Object.keys(combineDict);
		const sortOT = [];
		bibleBookOldTestments.map((book) => {
			if (book_keys.includes(book)) {
				sortOT.push(combineDict[book]);
			}
		});
		if (sortOT.length != 0) {
			return sortOT.map((bkdetails, i) => {
				return (
					<TableRow key={i}>
						<TableCell align="left">
							{bkdetails.bookName.toUpperCase()}
						</TableCell>
						<TableCell align="center">
							{bkdetails.userName}
						</TableCell>
						<TableCell align="center">{bkdetails.email}</TableCell>
						<TableCell align="center" key={i}>
							<LinearProgressWithLabel
								value={bkdetails.allTokensCount}
								translatedValue={
									bkdetails.translatedTokensCount
								}
								completedValue={bkdetails.completed}
							/>
						</TableCell>
						<TableCell align="center">
							{bkdetails.completed}%
						</TableCell>
					</TableRow>
				);
			});
		} else {
			return <span style={{ color: "red" }}>No book assigned</span>;
		}
	};

	const displayNewBooks = () => {
		//Function for new testament books along with the assigned users
		const bookWiseDatas = bookList.bookWiseData;
		const combineDict = {};
		assignedUsers.map((data) => {
			const { books } = data;
			const { userName, email } = data.user;
			books.map((bk) => {
				const checkBook = bookWiseDatas[bk];
				if (checkBook) {
					const addData = checkBook;
					addData.userName = userName;
					addData.email = email;
					combineDict[bk] = addData;
				}
			});
		});
		const book_keys = Object.keys(combineDict);

		const sortNT = [];

		bibleBookNewTestments.map((book) => {
			if (book_keys.includes(book)) {
				sortNT.push(combineDict[book]);
			}
		});

		if (sortNT != 0) {
			return sortNT.map((bkdetails, i) => {
				return (
					<TableRow key={i}>
						<TableCell align="left">
							{bkdetails.bookName.toUpperCase()}
						</TableCell>
						<TableCell align="center">
							{bkdetails.userName}
						</TableCell>
						<TableCell align="center">{bkdetails.email}</TableCell>
						<TableCell align="center" key={i}>
							<LinearProgressWithLabel
								value={bkdetails.allTokensCount}
								translatedValue={
									bkdetails.translatedTokensCount
								}
								completedValue={bkdetails.completed}
							/>
						</TableCell>
						<TableCell align="center">
							{bkdetails.completed}%
						</TableCell>
					</TableRow>
				);
			});
		} else {
			return <span style={{ color: "red" }}>No book assigned</span>;
		}
	};

	const displayAssignedUsersNumber = () => {
		//for the headings in the POPUP
		const bookWiseDatas = bookList.bookWiseData;
		let bookData = [];
		if (assignedUsers.length > 0) {
			let booksNumber = assignedUsers.map((user, i) => {
				let { books } = user;
				books = books.filter((item) => item); //Filtering the empty string and saving the assigned users books length
				return books.length;
			});
			for (var i in bookWiseDatas) {
				bookData.push(bookWiseDatas[i]); //converting object to array
			}
			let assignedUsersSum = 0;
			const reducer = (a, c) => a + c;
			assignedUsersSum = booksNumber.reduce(reducer, 0); //total of assigned books to the users
			return (
				<React.Fragment>
					<span style={{ fontSize: "80%", fontWeight: "bold" }}>
						&nbsp;Assigned Books- ({assignedUsersSum})
					</span>
					<span
						style={{
							fontSize: "80%",
							fontWeight: "bold",
							paddingLeft: "5%",
						}}
					>
						&nbsp;Unassigned Books- (
						{bookData.length - assignedUsersSum})
					</span>
				</React.Fragment>
			);
		}
	};

	let projectName = props.value.split("/")[1].toUpperCase();

	return (
		<div>
			<Button
				onClick={handleClickOpen("paper")}
				size="small"
				variant="contained"
				style={{ fontSize: "80%", backgroundColor: "#21b6ae" }}
			>
				View
			</Button>
			{/* {loading && <CircleLoader />} */}
			<Dialog
				open={open}
				onClose={handleCloses}
				scroll={scroll}
				aria-labelledby="scroll-dialog-title"
				aria-describedby="scroll-dialog-description"
				fullWidth={true}
				maxWidth={"md"}
			>
				<DialogTitle id="scroll-dialog-title">
					<Grid container>
						<Grid
							item
							sm={6}
							style={{ fontSize: "80%", fontWeight: "bold" }}
						>
							{
								(projectName = props.value
									.split("/")[1]
									.toUpperCase())
							}
						</Grid>
						<Grid
							item
							sm={6}
							style={{
								fontSize: "80%",
								fontWeight: "bold",
								textAlign: "right",
							}}
						>
							{displayAssignedUsersNumber()}
						</Grid>
					</Grid>
				</DialogTitle>

				<DialogContent dividers={scroll === "paper"}>
					<DialogContentText
						id="scroll-dialog-description"
						ref={descriptionElementRef}
						tabIndex={-1}
					>
						{loading ? (
							<CircleLoader />
						) : assignedUsers.length > 0 ? (
							<div>
								<Table>
									<TableHead>
										<span
											style={{
												fontSize: "100%",
												fontWeight: "bold",
											}}
										>
											&nbsp;&nbsp;&nbsp;OLD TESTAMENT
										</span>
										<TableRow>
											<TableCell align="left">
												<h4>BOOK NAME</h4>
											</TableCell>
											{/*Heading for the old testament table*/}
											<TableCell align="center">
												<h4>USER NAME</h4>
											</TableCell>
											<TableCell align="center">
												<h4>EMAIL ID</h4>
											</TableCell>
											<TableCell align="left">
												<h4>TRANSLATION PROGRESS</h4>
											</TableCell>
											<TableCell align="center">
												<h4>DRAFT READY</h4>
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>{displayOldBooks()}</TableBody>
								</Table>

								<Table>
									<TableHead>
										<h4></h4>
										<span
											style={{
												fontSize: "100%",
												fontWeight: "bold",
											}}
										>
											&nbsp;&nbsp;&nbsp;NEW TESTAMENT
										</span>
										<TableRow>
											<TableCell align="left">
												<h4>BOOK NAME</h4>
											</TableCell>
											{/*Heading for the old testament table*/}
											<TableCell align="center">
												<h4>USER NAME</h4>
											</TableCell>
											<TableCell align="center">
												<h4>EMAIL ID</h4>
											</TableCell>
											<TableCell align="left">
												<h4>TRANSLATION PROGRESS</h4>
											</TableCell>
											<TableCell align="center">
												<h4>DRAFT READY</h4>
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>{displayNewBooks()}</TableBody>
								</Table>
							</div>
						) : (
							<div> Books are not assigned to Users</div>
						)}
					</DialogContentText>
				</DialogContent>

				<DialogActions>
					<Button onClick={handleCloses} color="primary">
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
