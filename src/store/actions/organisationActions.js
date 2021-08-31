import { SET_ORGANISATIONS, SET_IS_FETCHING } from "./actionConstants";
import apiUrl from "../../components/GlobalUrl.js";
import swal from "sweetalert";

const accessToken = localStorage.getItem("accessToken");

export const fetchOrganisations = () => async (dispatch) => {
	try {
		dispatch(setIsFetching(true));
		const data = await fetch(apiUrl + "v1/autographamt/organisations", {
			method: "GET",
			headers: {
				Authorization: "bearer " + accessToken,
			},
		});
		const organisations = await data.json();
		if ("success" in organisations) {
			// swal({
			//     title: 'Fetch Organisations',
			//     text: 'Unable to fetch organisations, ' + organisations.message,
			//     icon: 'error'
			// })
			console.log("No organisation data");
		} else {
			dispatch(setOrganisations(organisations));
		}
	} catch (e) {
		swal({
			title: "Organisations",
			text: "Unable to fetch organisations, check your internet connection or contact admin",
			icon: "error",
		});
	}
	dispatch(setIsFetching(false));
};

export const updateOrganisationVerifiedStatus = (data) => async (dispatch) => {
	try {
		dispatch(setIsFetching(true));
		const update = await fetch(
			apiUrl + "v1/autographamt/approvals/organisations",
			{
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					Authorization: "bearer " + accessToken,
				},
			}
		);
		const response = await update.json();
		if (response.success) {
			dispatch(fetchOrganisations());
			swal({
				title: "Organisation status",
				text: "Organisation status has been updated successfully",
				icon: "success",
			});
		} else {
			swal({
				title: "Organisation status",
				text: "Organisation status could not be updated. Please try again later",
				icon: "error",
			});
		}
	} catch (e) {
		swal({
			title: "Organisations status",
			text: "Unable to update organisations, check your internet connection or contact admin",
			icon: "error",
		});
	}
	dispatch(setIsFetching(false));
};

export const createOrganisation = (apiData, clear) => async (dispatch) => {
	dispatch(setIsFetching(true));
	try {
		const data = await fetch(apiUrl + "/v1/autographamt/organisations", {
			method: "POST",
			body: JSON.stringify(apiData),
			headers: {
				Authorization: "bearer " + accessToken,
			},
		});
		const myJson = await data.json();
		if (myJson.success) {
			swal({
				title: "Create organisations",
				text: myJson.message,
				icon: "success",
			});
			dispatch(fetchOrganisations());
			clear();
		} else {
			swal({
				title: "Create organisations",
				text: myJson.message,
				icon: "error",
			});
		}
	} catch (e) {
		swal({
			title: "Create Organisations",
			text: "Unable to create organisations, check your internet connection or contact admin",
			icon: "error",
		});
	}
	dispatch(setIsFetching(false));
};

export const deleteOrginisation = (apiData) => async (dispatch) => {
	dispatch(setIsFetching(true));
	try {
		const data = await fetch(
			apiUrl + "v1/autographamt/organisation/delete",
			{
				method: "DELETE",
				headers: {
					Authorization: "bearer " + accessToken,
				},
				body: JSON.stringify(apiData),
			}
		);
		const response = await data.json();
		dispatch(setIsFetching(false));
		if (response.success) {
			swal({
				title: "Removed Organisation",
				text: "Organisation successfully removed",
				icon: "success",
			});
			dispatch(fetchOrganisations());
		} else {
			swal({
				title: "Organisation cannot be removed",
				text: response.message,
				icon: "error",
			});
		}
	} catch (e) {
		swal({
			title: "Organisation assignment",
			text: "Unable to remove user, check your internet connection or contact admin",
			icon: "error",
		});
	}
};

export const setOrganisations = (organisations) => ({
	type: SET_ORGANISATIONS,
	organisations,
});

export const setIsFetching = (status) => ({
	type: SET_IS_FETCHING,
	status,
});
