import React, { Component } from "react";
import { withStyles } from "@material-ui/styles";
import { connect } from "react-redux";
import {
	fetchOrganisations,
	updateOrganisationVerifiedStatus,
} from "../../store/actions/organisationActions";
import CircleLoader from "../loaders/CircleLoader";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { green } from "@material-ui/core/colors";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import { Button } from "@material-ui/core";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import { Switch } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import { deleteOrginisation } from "../../store/actions/organisationActions";
import CreateOrganisations from "../Assignments/CreateOrganisations";

const styles = (theme) => ({
	root: {
		flexGrow: 1,
		paddingTop: "3%",
		paddingLeft: "5%",
		paddingRight: "5%",
		paddingBottom: "3%",
	},
	fab: {
		position: "fixed",
		bottom: "16px",
		right: "16px",
	},
});

class ListOrganisations extends Component {
	state = {
		open: false,
		columns: [
			{
				name: "id",
				options: {
					display: false,
					filter: false,
				},
			},
			{
				name: <h4>Organisation Name</h4>,
				options: {
					filter: false,
					sort: false,
				},
			},
			{
				name: <h4>Email</h4>,
				options: {
					filter: false,
					sort: false,
				},
			},
			{
				name: <h4>Address</h4>,
				options: {
					filter: false,
					sort: false,
				},
			},
			{
				name: <h4>Phone</h4>,
				options: {
					filter: false,
					sort: false,
				},
			},
			{
				name: <h4>Verified</h4>,
				options: {
					filter: false,
					customBodyRender: (value, row) => {
						return this.props.current_user.role === "sa" ? (
							<Switch
								checked={value}
								color="primary"
								onChange={() =>
									this.updateOrganisationStatus(
										row.rowData[0],
										!value
									)
								}
							/>
						) : value ? (
							<CheckCircleIcon style={{ color: green[500] }} />
						) : (
							<CancelIcon color="secondary" />
						);
					},
				},
			},
			{
				name: <h4>Admin Id</h4>,
				options: {
					filter: false,
					sort: false,
					display: false,
				},
			},
			{
				name: <h4>Remove Organisation</h4>,
				options: {
					filter: false,
					display: this.props.current_user.role === "sa",
					customBodyRender: (value) => {
						return (
							<Button
								size="small"
								onClick={() => this.handleDelete(value)}
							>
								<DeleteOutlinedIcon />
							</Button>
						);
					},
				},
			},
		],
	};

	updateOrganisationStatus = (organisationId, status) => {
		const { dispatch } = this.props;
		const apiData = {
			organisationId: organisationId,
			verified: status,
		};
		dispatch(updateOrganisationVerifiedStatus(apiData));
	};

	componentDidMount() {
		const { dispatch } = this.props;
		dispatch(fetchOrganisations());
	}

	handleClose = () => {
		this.setState({ open: false });
	};

	handleDelete = (organisationId) => {
		const { dispatch } = this.props;
		const apiData = {
			organisationId: organisationId,
		};
		dispatch(deleteOrginisation(apiData));
	};

	render() {
		const { classes, organisations, isFetching, current_user } = this.props;
		const { columns, open } = this.state;
		const data = Object.values(organisations);
		const sortedData = [];
		data.map((organisation) => {
			if (organisation.active === true) {
				sortedData.push(organisation);
			}
		});
		const filteredData = sortedData.map((organisation) => {
			return [
				organisation.organisationId,
				organisation.organisationName,
				organisation.organisationEmail,
				organisation.organisationAddress,
				organisation.organisationPhone,
				organisation.verified,
				organisation.userId,
				organisation.organisationId,
			];
		});
		const options = {
			selectableRows: false,
			download: false,
			print: false,
			filter: false,
			viewColumns: false,
			pagination: false,
		};
		return (
			<div className={classes.root}>
				{isFetching && <CircleLoader />}
				<MUIDataTable
					title={<h4>ORGANISATION LIST</h4>}
					data={filteredData}
					columns={columns}
					options={options}
				/>
				{current_user.role !== "sa" && (
					<>
						<CreateOrganisations
							open={open}
							close={this.handleClose}
						/>
						<Fab
							aria-label={"add"}
							className={classes.fab}
							color={"primary"}
							onClick={() => this.setState({ open: true })}
						>
							<AddIcon />
						</Fab>
					</>
				)}
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	organisations: state.organisation.organisations,
	isFetching: state.organisation.isFetching,
	current_user: state.auth.current_user,
});

const mapDispatchToProps = (dispatch) => ({
	dispatch,
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withStyles(styles)(ListOrganisations));
