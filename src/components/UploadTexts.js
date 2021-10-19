import React, { Component } from "react";
import {
	Grid,
	Button,
	Dialog,
	DialogActions,
	DialogTitle,
	DialogContent,
} from "@material-ui/core";
import PopUpMessages from "./PopUpMessages";
import ComponentHeading from "./ComponentHeading";
import {
	uploadBibleTexts,
	setCompletedUpload,
	clearUploadError,
} from "../store/actions/sourceActions";
import Chip from "@material-ui/core/Chip";
import DoneIcon from "@material-ui/icons/Done";
import Tooltip from "@material-ui/core/Tooltip";
import LinearProgress from "@material-ui/core/LinearProgress";
import AddIcon from "@material-ui/icons/Add";
import { fetchSourceBooks } from "../store/actions/sourceActions";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import CircleLoader from "./loaders/CircleLoader";
import { books } from "../components/Common/BibleOldNewTestment";
var grammar = require("usfm-grammar");

const styles = (theme) => ({
	progress: {
		margin: theme.spacing(2),
	},
	bookCard: {
		width: "430px",
		margin: "0 auto",
	},
	btnBooks: {
		height: "25px",
		margin: "4px",
		color: "#28a745",
	},
	success: {
		marginBottom: "10px",
	},
	message: {
		display: "block",
		paddingTop: "5px",
	},
	title: {
		textAlign: "center",
		backgroundColor: "#eee",
	},
	uploadLabel: {
		lineHeight: "40px",
	},
	uploadChip: {
		margin: "4px",
	},
	progressbar: {
		marginTop: "10px",
	},
});

class UploadTexts extends Component {
	state = {
		fileContent: [],
		parsedUsfm: [],
		disableUpload: true,
		progress: false,
		text: "",
		success: [],
		errorFiles: [],
		openDailog: false,
		failedBook: "",
		successBook: "",
		uploading: false,
		uploadSuccess: [],
		uploadErrors: [],
	};

	componentDidUpdate(prevProps) {
		const { completedUpload, uploadErrorBooks } = this.props;

		if (
			prevProps.uploadErrorBooks.length !==
				this.props.uploadErrorBooks.length ||
			prevProps.completedUpload !== this.props.completedUpload
		) {
			if (completedUpload) {
				if (uploadErrorBooks.length > 0) {
					for (const book of uploadErrorBooks) {
						let item = book.split("-");
						if (item[1].substring(0, 8) === "Inserted") {
							const { uploadSuccess } = this.state;
							if (!uploadSuccess.includes(item[0])) {
								uploadSuccess.push(item[0]);
								this.setState({
									uploadSuccess,
								});
							}
						} else {
							const { uploadErrors } = this.state;
							if (!uploadErrors.includes(book)) {
								uploadErrors.push(book);
								this.setState({
									uploadErrors,
								});
							}
						}
						if (
							uploadErrorBooks.length ===
							this.state.success.length
						) {
							this.setState({ progress: false });
						}
					}
				}
			}
		}
	}

	uploadFiles() {
		const { parsedUsfm, fileContent } = this.state;
		const { sourceId, dispatch } = this.props;
		dispatch(setCompletedUpload(false));
		parsedUsfm.map(async (item, index) => {
			var apiData = {
				sourceId: sourceId,
				wholeUsfmText: fileContent[index],
				parsedUsfmText: item,
			};
			await dispatch(
				uploadBibleTexts(apiData, parsedUsfm[index].book.bookCode)
			);
		});
	}

	async handleFileChosen(file) {
		let fileReader = await new FileReader();
		fileReader.onloadend = (e) => {
			const { fileContent, parsedUsfm, errorFiles, success } = this.state;
			const content = fileReader.result;
			const myUsfmParser = new grammar.USFMParser(content);
			try {
				var jsonOutput = myUsfmParser.toJSON();
				fileContent.push(content);
				parsedUsfm.push(jsonOutput);
				success.push(jsonOutput.book.bookCode);
				this.setState({
					fileContent,
					parsedUsfm,
					success,
				});
			} catch (error) {
				errorFiles.push(file.name);
				this.setState({ errorFiles });
			} finally {
				if (
					success.length + errorFiles.length ===
					this.state.totalFile
				) {
					this.uploadFiles();
				}
			}
		};
		await fileReader.readAsText(file);
	}

	openDailogBox = () => {
		this.setState({ openDailog: true });
	};

	closeDailogBox = () => {
		const { sourceId, dispatch } = this.props;
		this.setState({
			openDailog: false,
			uploadSuccess: [],
			uploadErrors: [],
		});
		dispatch(clearUploadError());
		dispatch(fetchSourceBooks(sourceId));
	};

	addFiles = (e) => {
		e.preventDefault();
		this.openDailogBox();
		const filesObj = e.target.files;
		const filesKeys = Object.keys(filesObj);
		this.setState({
			fileContent: [],
			parsedUsfm: [],
			errorFiles: [],
			progress: true,
			success: [],
			totalFile: filesKeys.length,
			uploading: true,
		});
		filesKeys.map(async (key) => {
			await this.handleFileChosen(filesObj[key]);
		});
		e.target.value = null;
	};

	displayAllBooks = () => {
		const { sourceBooks } = this.props;
		var totalBooks = [].concat.apply([], sourceBooks); //merging the arrays
		return books.map((book, i) => {
			return (
				<Grid item xs={2} key={i}>
					<Button
						className={this.props.classes.btnBooks}
						variant="outlined"
						disabled={!totalBooks.includes(book)}
						style={{ backgroundColor: "transparent" }}
					>
						{book.toUpperCase()}
					</Button>
				</Grid>
			);
		});
	};

	//display heading of the popup onclick book button
	displayHeading = () => {
		const { newData, sourceId } = this.props;
		for (let index = 0; index < newData.length; index++) {
			const element = newData[index];
			if (element[0] === sourceId) {
				return `Books - ${
					element[1].charAt(0).toUpperCase() + element[1].slice(1)
				} ${element[2]} ${element[3]}`;
			}
		}
	};
	handleDelete = () => {
		console.info("You clicked the delete icon.");
	};

	render() {
		const { dialogOpen, close, isFetching, current_user } = this.props;
		const { success, errorFiles, uploadSuccess, uploadErrors, totalFile } =
			this.state;
		return (
			<div>
				<Dialog
					open={dialogOpen}
					aria-labelledby="form-dialog-title"
					className={this.props.classes.dailogWidth}
					maxWidth="sm"
					fullWidth={true}
				>
					<PopUpMessages />
					{isFetching && <CircleLoader />}
					<ComponentHeading
						data={{
							text: `${this.displayHeading()}`,
							styleColor: "#2a2a2fbd",
						}}
					/>
					<DialogContent>
						<Grid
							container
							item
							className={this.props.classes.bookCard}
						>
							{this.displayAllBooks()}
						</Grid>
						{current_user.role === "sa" && (
							<div>
								<Grid container spacing={2}>
									<Grid item xs={7}></Grid>
									<Grid item xs={2}>
										<Button
											size="small"
											onClick={close}
											variant="contained"
											color="secondary"
										>
											Close
										</Button>
									</Grid>
									<Grid item xs={3}>
										<input
											style={{ display: "none" }}
											id="raised-button-file"
											multiple
											type="file"
											accept=".usfm,.sfm"
											onChange={this.addFiles}
										/>
										<label htmlFor="raised-button-file">
											<Button
												variant="contained"
												color="primary"
												size="small"
												component="span"
											>
												<AddIcon /> Add Books
											</Button>
										</label>
									</Grid>
								</Grid>
							</div>
						)}
					</DialogContent>
					<DialogActions>
						{current_user.role !== "sa" && (
							<Button
								size="small"
								onClick={close}
								variant="contained"
								color="secondary"
							>
								Close
							</Button>
						)}
					</DialogActions>
				</Dialog>
				<Dialog
					open={this.state.openDailog}
					aria-labelledby="form-dialog-title"
					onClose={this.handleClose}
					fullWidth
					maxWidth="sm"
				>
					<DialogTitle className={this.props.classes.title}>
						Book Upload Status
					</DialogTitle>
					<DialogContent>
						<div className={this.props.classes.success}>
							<Grid container>
								<Grid item xs={3}>
									<span
										className={
											this.props.classes.uploadLabel
										}
									>
										Parsed (
										{success.length + errorFiles.length}/
										{totalFile}) :
									</span>
								</Grid>
								<Grid item xs={9}>
									{success.map((item, i) => (
										<Chip
											className={
												this.props.classes.uploadChip
											}
											key={i}
											variant="outlined"
											color="primary"
											deleteIcon={<DoneIcon />}
											onDelete={this.handleDelete}
											label={item}
										/>
									))}
									{errorFiles.map((item, i) => (
										<Chip
											className={
												this.props.classes.uploadChip
											}
											key={i}
											variant="outlined"
											color="secondary"
											onDelete={this.handleDelete}
											label={item}
										/>
									))}
								</Grid>
								<Grid item xs={12}>
									<LinearProgress
										className={
											this.props.classes.progressbar
										}
										variant="determinate"
										value={
											((success.length +
												errorFiles.length) /
												totalFile) *
											100
										}
									/>
								</Grid>
							</Grid>
						</div>

						<div className={this.props.classes.message}>
							<Grid container>
								<Grid item xs={3}>
									<span
										className={
											this.props.classes.uploadLabel
										}
									>
										Uploaded (
										{uploadSuccess.length +
											uploadErrors.length}
										/{success.length}) :
									</span>
								</Grid>
								<Grid item xs={9}>
									{uploadSuccess.map((item, i) => (
										<Chip
											className={
												this.props.classes.uploadChip
											}
											key={i}
											variant="outlined"
											color="primary"
											deleteIcon={<DoneIcon />}
											onDelete={this.handleDelete}
											label={item}
										/>
									))}
									{uploadErrors.map((book, i) => {
										const item = book.split("-");
										return (
											<Tooltip key={i} title={item[1]}>
												<Chip
													className={
														this.props.classes
															.uploadChip
													}
													variant="outlined"
													color="secondary"
													onDelete={this.handleDelete}
													label={item[0]}
												/>
											</Tooltip>
										);
									})}
								</Grid>
								<Grid item xs={12}>
									<LinearProgress
										className={
											this.props.classes.progressbar
										}
										variant="determinate"
										value={
											((uploadSuccess.length +
												uploadErrors.length) /
												success.length) *
											100
										}
									/>
								</Grid>
							</Grid>
						</div>
					</DialogContent>
					<DialogActions>
						<Button
							disabled={this.state.progress}
							size="small"
							onClick={this.closeDailogBox}
							variant="contained"
							color="primary"
						>
							Ok
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	isFetching: state.sources.isFetching,
	uploadErrorBooks: state.sources.uploadErrorBooks,
	completedUpload: state.sources.completedUpload,
	sourceBooks: state.sources.sourceBooks,
	current_user: state.auth.current_user,
});

const mapDispatchToProps = (dispatch) => ({
	dispatch,
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withStyles(styles)(UploadTexts));
