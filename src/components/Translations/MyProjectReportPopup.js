import React from "react";
import Button from "@material-ui/core/Button";
import { Grid, Typography } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import DataTable from "react-data-table-component";
import Box from "@material-ui/core/Box";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import apiUrl from "../GlobalUrl";
import CircleLoader from "../loaders/CircleLoader";
import {
	bibleBookNewTestments,
	bibleBookOldTestments,
} from "../Common/BibleOldNewTestment";

function LinearProgressWithLabel(props) {
	return (
		<Box display="flex" alignItems="center">
			<Box>
				<LinearProgress
					variant="determinate"
					value={props.completedValue}
					style={{ width: "50px" }}
				/>
			</Box>
			<Box>
				<Typography
					variant="body1"
					color="textSecondary"
					style={{ fontSize: 9 }}
				>{`${props.translatedValue} / ${props.value}`}</Typography>
			</Box>
		</Box>
	);
}

const useStyles = makeStyles((theme) => createStyles({}));

export default function SimplePopover(props) {
	const classes = useStyles();
	const [BookDetails, setBookDetails] = React.useState(null);
	const [unTokenisedOldBooks, setUnTokenisedOldBooks] = React.useState(0);
	const [unTokenisedNewBooks, setUnTokenisedNewBooks] = React.useState(0);
	const [newTestmentBooks, setNewTestmentBooks] = React.useState(null);
	const [oldTestmentBooks, setOldTestmentBooks] = React.useState(null);
	const [open, setOpen] = React.useState(false);
	const [scroll, setScroll] = React.useState("paper");
	const [loading, setLoading] = React.useState(false);
	const [proId, setProId] = React.useState(0);

	const handleClickOpen = (scrollType) => () => {
		setLoading(true);
		setOpen(true);
		setScroll(scrollType);
		const stoploading = () => {
			setLoading(false);
		};
		if (proId != props.projectWiseId) {
			fetch(
				apiUrl +
					"/v1/autographamt/statistics/projects/" +
					props.projectWiseId
			)
				.then((results) => {
					stoploading();
					return results.json();
				})
				.then((data) => {
					let matches = [];
					if (
						data.bookWiseData != null &&
						Object.keys(data.bookWiseData).length != 0
					) {
						let oldTestments = [];
						bibleBookOldTestments.map((book) => {
							//map function to push old testament books in order
							return props.projectBooks.includes(book)
								? oldTestments.push(book)
								: null;
						});
						let newTestments = [];
						bibleBookNewTestments.map((book) => {
							//map function to push new testament books in order
							return props.projectBooks.includes(book)
								? newTestments.push(book)
								: null;
						});
						let oldBooks = [];
						for (let book of oldTestments) {
							//for order objects and also adding three code book name to the object
							let booksKey = data.bookWiseData[book];
							if (booksKey !== undefined) {
								oldBooks.push(booksKey);
							}
						}
						setUnTokenisedOldBooks(
							oldTestments.length - oldBooks.length
						);
						setOldTestmentBooks(oldBooks);
						let newBooks = [];
						for (let book of newTestments) {
							//for order objects and also adding three code book name to the object
							let booksKey = data.bookWiseData[book];
							if (booksKey !== undefined) {
								newBooks.push(booksKey);
							}
						}
						setUnTokenisedNewBooks(
							newTestments.length - newBooks.length
						);
						setNewTestmentBooks(newBooks);
					}
					setBookDetails(matches);
					setProId(props.projectWiseId);
				});
		} else {
			stoploading();
		}
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

	const columns = [
		{
			name: (
				<span style={{ fontSize: "90%", fontWeight: "bold" }}>
					BOOK NAME
				</span>
			),
			selector: "bookCode",
			sortable: true,
			cell: (row) => (
				<React.Fragment>{`${row.bookName.toUpperCase()}`}</React.Fragment>
			),
		},
		{
			name: (
				<span style={{ fontSize: "90%", fontWeight: "bold" }}>
					TOKEN TRANSLATION PROGRESS
				</span>
			),
			sortable: true,
			cell: (row) => (
				<div className={classes.fullWidth}>
					<LinearProgressWithLabel
						value={row.allTokensCount}
						translatedValue={row.translatedTokensCount}
						completedValue={row.completed}
					/>
				</div>
			),
		},
		{
			name: <span style={{ fontSize: "90%" }}>DRAFT PROGRESS</span>,
			selector: "completed",
			sortable: true,
			cell: (row) => (
				<React.Fragment>{`${row.completed}%`}</React.Fragment>
			),
		},
	];

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
				fullWidth={true}
				maxWidth={"md"}
				aria-labelledby="scroll-dialog-title"
				aria-describedby="scroll-dialog-description"
			>
				<DialogTitle id="scroll-dialog-title">
					<Grid container>
						<Grid
							item
							sm={6}
							style={{ fontSize: "80%", fontWeight: "bold" }}
						>
							Bookwise Translation Progress
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
							{"Books Assigned  -  " + props.bookCount}
						</Grid>
					</Grid>
				</DialogTitle>

				<DialogContent dividers={scroll === "paper"}>
					<div
						id="scroll-dialog-description"
						ref={descriptionElementRef}
						tabIndex={-1}
					>
						{loading ? (
							<CircleLoader />
						) : (
							<div style={{ height: 400, width: "100%" }}>
								{oldTestmentBooks != null && (
									<DataTable
										title={
											<span
												style={{
													fontSize: "70%",
													fontWeight: "bold",
												}}
											>
												OLD TESTAMENT
											</span>
										}
										columns={columns}
										data={oldTestmentBooks}
									/>
								)}
								&nbsp;&nbsp;&nbsp;
								{unTokenisedOldBooks !== 0
									? unTokenisedOldBooks +
									  " " +
									  "Untokenised Books"
									: "BOOKS TO BE TOKENISED"}
								{newTestmentBooks != null && (
									<DataTable
										title={
											<span
												style={{
													fontSize: "70%",
													fontWeight: "bold",
												}}
											>
												NEW TESTAMENT
											</span>
										}
										columns={columns}
										data={newTestmentBooks}
									/>
								)}
								&nbsp;&nbsp;&nbsp;
								{unTokenisedNewBooks !== 0
									? unTokenisedNewBooks +
									  " " +
									  "Untokenised Books"
									: ""}
							</div>
						)}
					</div>
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
