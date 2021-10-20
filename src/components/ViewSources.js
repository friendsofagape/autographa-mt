import React, { Component } from "react";
import { Button, Tooltip } from "@material-ui/core";
import UploadTexts from "./UploadTexts";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import CreateSources from "./CreateSources";
import {
	fetchBibleLanguages,
	fetchSourceBooks,
} from "../store/actions/sourceActions";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import MUIDataTable from "mui-datatables";
import CircleLoader from "./loaders/CircleLoader";
import moment from "moment";

const styles = (theme) => ({
	root: {
		flexGrow: 1,
		overflowY: "hidden",
		padding: theme.spacing(8),
		paddingLeft: "15%",
		paddingRight: "15%",
	},
	fab: {
		position: "fixed",
		bottom: "20px",
		right: "20px",
	},
});

class ViewSources extends Component {
	state = {
		dialogOpen: false,
		sourceId: "",
		decoded: {},
		accessToken: "",
		availableBooksData: [],
		createSourceDialog: false,
		columns: [
			{
				name: "id",
				options: {
					display: false,
					filter: false,
				},
			},
			{
				name: <h4>Language</h4>,
				options: {
					filter: false,
					sort: false,
				},
			},
			{
				name: <h4>Version</h4>,
				options: {
					filter: false,
					sort: false,
				},
			},
			{
				name: <h4>Revision</h4>,
				options: {
					filter: false,
					sort: false,
				},
			},
			{
				name: <h4>Updated Date</h4>,
				options: {
					filter: false,
					sort: false,
					customBodyRender: (value) => {
						return moment(value).format("D/M/Y");
					},
				},
			},
		],
	};

	closeDialog = () => {
		this.setState({ dialogOpen: false });
	};

	componentDidMount() {
		var { dispatch } = this.props;
		dispatch(fetchBibleLanguages());
		let { columns } = this.state;
		columns = [
			...columns,
			{
				name: <h4>Books</h4>,
				options: {
					filter: false,
					sort: false,
					customBodyRender: (value) => {
						return (
							<Button
								size="small"
								color={"primary"}
								variant="contained"
								onClick={() =>
									this.setState(
										{
											dialogOpen: true,
											sourceId: value,
										},
										this.handleBookSelect(value)
									)
								}
							>
								<span>Books</span>
							</Button>
						);
					},
				},
			},
		];
		this.setState({ columns });
	}

	handleClose = (value) => {
		this.setState({
			[value]: false,
		});
	};

	handleBookSelect = (sourceId) => (e) => {
		const { dispatch } = this.props;
		dispatch(fetchSourceBooks(sourceId));
	};

	render() {
		const { classes, bibleLanguages, isFetching, current_user } =
			this.props;
		const { columns, createSourceDialog } = this.state;
		var data = [];
		bibleLanguages.forEach((bible) => {
			bible["languageVersions"].forEach((version) => {
				data.push([
					version.sourceId,
					version.language.name,
					version.version.name,
					version.version.longName,
					version.updatedDate,
					version.sourceId,
					version.sourceId,
				]);
			});
		});
		const options = {
			selectableRows: false,
			download: false,
			print: false,
			filter: false,
			viewColumns: false,
			pagination: false,
			// onRowClick: rowData => this.setState({redirect: rowData[0]})
		};
		return (
			<div className={classes.root}>
				{isFetching && <CircleLoader />}
				<MUIDataTable
					title={<h4>SOURCES</h4>}
					data={data}
					columns={columns}
					options={options}
				/>
				{createSourceDialog && (
					<CreateSources
						open={createSourceDialog}
						close={this.handleClose}
						isFetching={isFetching}
					/>
				)}
				{current_user.role === "sa" && (
					<Tooltip title="Click to add new source">
						<Fab
							aria-label={"add"}
							className={classes.fab}
							color={"primary"}
							onClick={() =>
								this.setState({ createSourceDialog: true })
							}
						>
							<AddIcon />
						</Fab>
					</Tooltip>
				)}
				{this.state.dialogOpen && (
					<UploadTexts
						sourceId={this.state.sourceId}
						dialogOpen={this.state.dialogOpen}
						close={this.closeDialog}
						newData={data}
					/>
				)}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		isFetching: state.sources.isFetching,
		bibleLanguages: state.sources.bibleLanguages,
		sourceBooks: state.sources.sourceBooks,
		current_user: state.auth.current_user,
	};
};

const mapDispatchToProps = (dispatch) => ({
	dispatch,
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withStyles(styles)(ViewSources));
