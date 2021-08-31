import React, { Component } from "react";
import { Grid, TextField, Button, Typography } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { withStyles } from "@material-ui/styles";
import { connect } from "react-redux";
import { createOrganisation } from "../../store/actions/organisationActions";
import CircleLoader from "../loaders/CircleLoader";

const styles = () => ({
	root: {
		margin: 0,
	},
	dailog: {
		minHeight: "300px",
	},
});

class CreateOrganisations extends Component {
	state = {
		organisationName: "",
		organisationAddress: "",
		organisationEmail: "",
		organisationPhone: "",
		phError: false,
		phMessage: "",
		isloading: false,
	};

	closeSnackBar = (item) => {
		this.setState(item);
	};

	clearState = () => {
		this.setState({
			organisationName: "",
			organisationAddress: "",
			organisationEmail: "",
			organisationPhone: "",
			isloading: false,
		});
	};

	handleSubmit = (e) => {
		this.setState({ phError: false, phMessage: "" });
		const { dispatch, close } = this.props;
		const {
			organisationName,
			organisationAddress,
			organisationEmail,
			organisationPhone,
		} = this.state;
		if (isNaN(organisationPhone)) {
			this.setState({
				phError: true,
				phMessage: "Invalid phone number. Use only digits",
			});
		} else {
			this.setState({ isloading: true });
			const apiData = {
				organisationName: organisationName,
				organisationAddress: organisationAddress,
				organisationEmail: organisationEmail,
				organisationPhone: organisationPhone,
			};
			dispatch(createOrganisation(apiData, close, this.clearState));
			// this.clearState();
		}
	};

	handleClose = () => {
		this.setState({ verificationDialogOpen: false });
	};

	canBeSubmitted() {
		const {
			organisationName,
			organisationAddress,
			organisationEmail,
			organisationPhone,
		} = this.state;
		return (
			organisationName.toString().length > 0 &&
			organisationAddress.toString().length > 0 &&
			organisationEmail.toString().length > 0 &&
			organisationPhone.toString().length > 0
		);
	}

	render() {
		const { classes, open, close } = this.props;
		const isEnabled = this.canBeSubmitted();
		return (
			<div className={classes.root}>
				<Dialog
					onClose={close}
					aria-labelledby="customized-dialog-title"
					open={open}
					fullWidth={true}
					maxWidth={"sm"}
				>
					<DialogTitle id="customized-dialog-title" onClose={close}>
						<Typography variant="h6">
							Create organisation
						</Typography>
					</DialogTitle>
					<DialogContent dividers className={classes.dailog}>
						<form
							className={classes.form}
							onSubmit={this.handleLoginSubmit}
						>
							<Grid container spacing={2}>
								<Grid item xs={10}>
									<TextField
										variant="outlined"
										value={this.state.organisationName}
										margin="normal"
										required
										fullWidth
										id="organisationName"
										label="Organisation Name"
										name="organisationName"
										autoComplete="organisationName"
										size="small"
										onChange={(e) =>
											this.setState({
												organisationName:
													e.target.value,
											})
										}
									/>
								</Grid>
								<Grid item sm={10}>
									<TextField
										variant="outlined"
										value={this.state.organisationAddress}
										margin="normal"
										required
										fullWidth
										id="organisationAddress"
										label="Address"
										name="organisationAddress"
										autoComplete="organisationAddress"
										size="small"
										onChange={(e) =>
											this.setState({
												organisationAddress:
													e.target.value,
											})
										}
									/>
								</Grid>
								<Grid item sm={10}>
									<TextField
										variant="outlined"
										value={this.state.organisationEmail}
										margin="normal"
										required
										fullWidth
										id="organisationEmail"
										label="Email"
										type="email"
										name="organisationEmail"
										autoComplete="organisationEmail"
										size="small"
										onChange={(e) =>
											this.setState({
												organisationEmail:
													e.target.value,
											})
										}
									/>
								</Grid>
								<Grid item sm={10}>
									<TextField
										variant="outlined"
										error={this.state.phError}
										helperText={this.state.phMessage}
										value={this.state.organisationPhone}
										margin="normal"
										required
										fullWidth
										id="organisationPhone"
										label="Phone"
										name="organisationPhone"
										autoComplete="organisationPhone"
										size="small"
										onChange={(e) =>
											this.setState({
												organisationPhone:
													e.target.value,
											})
										}
									/>
								</Grid>
							</Grid>
						</form>
					</DialogContent>
					<DialogActions>
						<Button
							autoFocus
							onClick={close}
							color="secondary"
							size={"small"}
							variant={"contained"}
						>
							Close
						</Button>
						<Button
							autoFocus
							onClick={this.handleSubmit}
							color="primary"
							disabled={!isEnabled}
							size={"small"}
							variant={"contained"}
							type="submit"
						>
							Create
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch) => ({
	dispatch,
});

export default connect(
	null,
	mapDispatchToProps
)(withStyles(styles)(CreateOrganisations));
