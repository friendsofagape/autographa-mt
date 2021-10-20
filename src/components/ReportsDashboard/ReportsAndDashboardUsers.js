import React from "react";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Typography } from "@material-ui/core";
import apiUrl from "../GlobalUrl";
import CircleLoader from "../loaders/CircleLoader";
import swal from "sweetalert";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
	bibleBookNewTestments,
	bibleBookOldTestments,
} from "../Common/BibleOldNewTestment";

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

const accessToken = localStorage.getItem("accessToken");

export default function UsersReports(props) {
	const [assignedUsers, setAssignedUsers] = React.useState([]);
	const [bookList, setBookList] = React.useState({});
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
		if (data.status !== 200) {
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
		if (data1.status !== 200) {
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
		if (proId !== parseInt(projectIdCheck)) {
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
		assignedUsers.forEach((data) => {
			const { books } = data;
			const { userName, email } = data.user;
			books.forEach((bk) => {
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
		bibleBookOldTestments.forEach((book) => {
			if (book_keys.includes(book)) {
				sortOT.push(combineDict[book]);
			}
		});
		if (sortOT.length !== 0) {
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
			return <TableRow><TableCell colSpan={5} style={{ color: "red" }}>No book assigned</TableCell></TableRow>;
		}
	};

	const displayNewBooks = () => {
		//Function for new testament books along with the assigned users
		const bookWiseDatas = bookList.bookWiseData;
		const combineDict = {};
		assignedUsers.forEach((data) => {
			const { books } = data;
			const { userName, email } = data.user;
			books.forEach((bk) => {
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

		bibleBookNewTestments.forEach((book) => {
			if (book_keys.includes(book)) {
				sortNT.push(combineDict[book]);
			}
		});
		if (sortNT.length !== 0) {
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
			return <TableRow><TableCell colSpan={5} style={{ color: "red" }}>No book assigned</TableCell></TableRow>;
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
				</React.Fragment>
			);
		}
	};

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
							{props.value.split("/")[1].toUpperCase()}
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
				<DialogContent dividers={scroll === "paper"} ref={descriptionElementRef}>
					{loading ? (
						<CircleLoader />
					) : assignedUsers.length > 0 ? (
						<div>
							<div style={{fontSize: "100%",fontWeight: "bold",margin :"15px 0 0 15px" }}>
								OLD TESTAMENT
							</div>
							<Table>
								<TableHead>
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
							<div style={{ fontSize: "100%", fontWeight: "bold",margin :"25px 0 0 15px" }}>
								NEW TESTAMENT
							</div>
							<Table>
								<TableHead>
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
