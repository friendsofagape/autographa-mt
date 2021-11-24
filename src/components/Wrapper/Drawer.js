import React, { Component } from "react";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import apiUrl from "../GlobalUrl";
import { menus } from "../api/menu";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { Toolbar } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";

var accessToken = localStorage.getItem("accessToken");

const styles = (theme) => ({
	drawer: {
		width: 170,
		flexShrink: 0,
	},
	drawerPaper: {
		width: 168,
		backgroundColor: "black",
	},
	drawerContainer: {
		overflow: "auto",
	},
	content: {
		flexGrow: 1,
	},
});

class DrawerPane extends Component {
	async getOrganisations() {
		const { updateState, organisationsStatus } = this.props.data;

		const data = await fetch(apiUrl + "/v1/autographamt/organisations", {
			method: "GET",
			headers: {
				Authorization: "bearer " + accessToken,
			},
		});
		const organisationsData = await data.json();
		organisationsData.forEach((item) => {
			organisationsStatus[item.organisationId] = {
				verified: item.verified,
			};
		});
		updateState({
			organisationsStatus: organisationsStatus,
			organisationsData: organisationsData,
			listOrganisationsPane: true,
			listUsersPane: false,
			createProjectsPane: false,
			listProjectsPane: false,
			assignmentsPane: false,
			listUserProjectsPane: false,
		});
	}

	render() {
		const { classes, current_user } = this.props;
		return (
			<div>
				{menus.map((menu, i) => {
					return menu.roles.includes(current_user.role)?(
						<Drawer
							className={classes.drawer}
							key={i}
							variant="permanent"
							classes={{
								paper: classes.drawerPaper,
							}}
						>
							x <Toolbar />
							<div className={classes.drawerContainer}>
								<List>
									{menu.child &&
										menu.child.map((childMenu, i) => {
											return childMenu.roles.includes(
												current_user.role
											) ? (
												<NavLink
													exact
													className="main-nav"
													activeClassName="main-nav-active"
													to={childMenu.link}
													key={i}
												>
													<ListItem
														button
														key={childMenu.key}
														className={
															classes.exp
														}
													>
														<ListItemText
															disableTypography
															divider="true"
															primary={
																<Typography variant="caption">
																	{
																		childMenu.name
																	}
																</Typography>
															}
														/>
													</ListItem>
												</NavLink>
											) : (
												""
											);
										})}
								</List>
							</div>
						</Drawer>
					):"";
				})}
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	current_user: state.auth.current_user,
});

export default connect(mapStateToProps)(withStyles(styles)(DrawerPane));
