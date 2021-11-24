import React from "react";
import Button from "@material-ui/core/Button";
import { Typography } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import LinearProgress from "@material-ui/core/LinearProgress";
import DataTable from "react-data-table-component";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import apiUrl from "../../components/GlobalUrl.js";
import {bibleBookNewTestments,bibleBookOldTestments} from "../Common/BibleOldNewTestment";

function LinearProgressWithLabel(props) {
	return (
		<Box display="flex" alignItems="center">
			<Box width="100%" mr={1}>
				<LinearProgress
					variant="determinate"
					value={props.completedValue}
					style={{ width: "50px" }}
				/>
			</Box>
			<Box minWidth={65}>
				<Typography
					variant="body2"
					color="textSecondary"
					style={{ fontSize: 9 }}
				>{`${props.translatedValue} / ${props.value}`}</Typography>
			</Box>
		</Box>
	);
}

const useStyles = makeStyles((theme) =>
	createStyles({
		fullWidth: {
			width: "100%",
		},
		disabled: {
			color: "lightgrey",
		},
		root: {
			width: 280,
			overflow: "auto",
			padding: theme.spacing(2),
		},
	})
);

export default function AvailableSourceReport(props) {
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [unTokenisedOldBooks, setUnTokenisedOldBooks] = React.useState(0);
	const [unTokenisedNewBooks, setUnTokenisedNewBooks] = React.useState(0);
	const [newTestmentBooks, setNewTestmentBooks] = React.useState(null);
	const [oldTestmentBooks, setOldTestmentBooks] = React.useState(null);
	const [FirstBookLength, setFirstBookLength] = React.useState(null);

	const handleClick = (event) => {
		/*To open the popup*/
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		/*To close the popup*/
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? "simple-popover" : undefined;

	React.useEffect(() => {
		/*fetching statistics data for the popup*/
		fetch(apiUrl+"v1/autographamt/statistics/projects/" +props.projectId) //popup
			.then((results) => results.json())
			.then((data) => {
				let matches = [];
				let oldBooks = [];
				let newBooks = [];
				if (
					data.bookWiseData != null &&
					Object.keys(data.bookWiseData).length !== 0
				) {
					for (let book of bibleBookOldTestments) {
						//for order objects and also adding three code book name to the object
						let booksKey = data.bookWiseData[book];
						if (booksKey !== undefined) {
							oldBooks.push(booksKey);
						}
					}
					setUnTokenisedOldBooks(
						bibleBookOldTestments.length - oldBooks.length
					);
					setOldTestmentBooks(oldBooks); //Data for the popup column
					for (let book of bibleBookNewTestments) {
						//for order objects and also adding three code book name to the object
						let booksKey = data.bookWiseData[book];
						if (booksKey !== undefined) {
							newBooks.push(booksKey);
						}
					}
					setUnTokenisedNewBooks(
						bibleBookNewTestments.length - newBooks.length
					);
					setNewTestmentBooks(newBooks); //Data for the popup column
					for (var j in Object.keys(data.bookWiseData)) {
						matches.push(Object.values(data.bookWiseData)[j]);
					}
				}
				setFirstBookLength(matches.length); //Data for the text on the button for popup
			});
	}, [props.projectId]);

	const columns = [
		//columns for the popup
		{
			name: "BOOK NAME",
			selector: "bookCode",
			sortable: true,
			cell: (row) => (
				<React.Fragment>{`${row.bookName.toUpperCase()}`}</React.Fragment>
			),
		},
		{
			name: "TOKEN PROGRESS",
			selector: "completed",
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
			name: "DRAFT PROGRESS",
			selector: "completed",
			sortable: true,
			cell: (row) => (
				<React.Fragment>{`${row.completed}%`}</React.Fragment>
			),
		},
	];

	return (
		<div>
			{FirstBookLength ? (
				<Button
					aria-describedby={id}
					size="small"
					variant="contained"
					style={{ fontSize: "80%", backgroundColor: "#21b6ae" }}
					onClick={handleClick}
				>
					{" "}
					{FirstBookLength}▼
				</Button>
			) : (
				<Button
					aria-describedby={id}
					size="small"
					disabled
					variant="contained"
					style={{ fontSize: "80%", backgroundColor: "#21b6ae" }}
					onClick={handleClick}
				>
					<CircularProgress
						className={classes.circularProgress}
						size={20}
					/>
					Loading
				</Button>
			)}{" "}
			{/*Popup of the Total Source Books */}
			{oldTestmentBooks !== null && newTestmentBooks !== null && (
				<Popover
					id={id}
					open={open}
					anchorEl={anchorEl}
					onClose={handleClose}
					// style={{height: 500, width:'100%'}}
					PaperProps={{
						style: { width: "35%", height: "70%" },
					}}
				>
					<DataTable
						title={
							<span
								style={{ fontSize: "80%", fontWeight: "bold" }}
							>
								OLD TESTAMENT
							</span>
						}
						columns={columns}
						data={oldTestmentBooks}
					/>
					&nbsp;&nbsp;&nbsp;&nbsp;
					{unTokenisedOldBooks !== 0
						? unTokenisedOldBooks + " Untokenised Books"
						: "BOOKS TO BE TOKENISED"}
					<DataTable
						title={
							<span
								style={{ fontSize: "80%", fontWeight: "bold" }}
							>
								NEW TESTAMENT
							</span>
						}
						columns={columns}
						data={newTestmentBooks}
					/>
					&nbsp;&nbsp;&nbsp;&nbsp;
					{unTokenisedNewBooks !== 0
						? unTokenisedNewBooks + " Untokenised Books"
						: ""}
				</Popover>
			)}
		</div>
	);
}
