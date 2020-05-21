import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { InputLabel, FormControl, Select, MenuItem } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { fetchBibleLanguages, fetchAllLanguages } from '../../store/actions/sourceActions';
import { fetchOrganisations } from '../../store/actions/organisationActions';
import { createProject } from '../../store/actions/projectActions';
import VirtualizedSelect from 'react-virtualized-select';
import CircleLoader from '../loaders/CircleLoader';
import 'react-select/dist/react-select.css';
import 'react-virtualized-select/styles.css';
import './style.css';

const styles = (theme) => ({
	root: {
		margin: 0,
		padding: theme.spacing(2),
	},
	dailog: {
		minHeight: '300px',
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500],
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: '100%',
		margin: 0,
	},
	selectMenu: {
		width: '95%',
	},
	virtualSelect: {
		width: '95%',
	},
	label: {
		paddingLeft: '10px',
	},
	labelOrd: {
		paddingTop: '12px',
	},
});

class CreateProject extends Component {
	state = {
		source: [],
		sourceId: '',
		targetId: '',
		target: '',
		organisationId: '',
	};
	componentDidMount() {
		const { dispatch } = this.props;
		dispatch(fetchBibleLanguages());
		dispatch(fetchAllLanguages());
		dispatch(fetchOrganisations());
	}

	clearState = () => {
		this.setState({
			source: [],
			sourceId: '',
			targetId: '',
			target: '',
			organisationId: '',
		});
	};

	displayLanguage = () => {
		const { bibleLanguages } = this.props;
		if (bibleLanguages.length > 0) {
			return bibleLanguages.map((lang) => {
				const langObj = lang.languageVersions[0];
				const landId = langObj.language.id;
				return (
					<MenuItem key={langObj.language.id} value={lang.languageVersions}>
						{langObj.language.name}
					</MenuItem>
				);
			});
		} else {
			return <MenuItem>No languages</MenuItem>;
		}
		// const { }
	};

	displayVersions = () => {
		const { source } = this.state;
		if (source.length > 0) {
			return source.map((item) => {
				return (
					<MenuItem key={item.sourceId} value={item.sourceId}>
						{item.version.code}
					</MenuItem>
				);
			});
		} else {
			return <MenuItem>No version</MenuItem>;
		}
	};

	displayOrganisations = () => {
		const { organisations } = this.props;
		if (organisations.length > 0) {
			return organisations.map((item) => {
				return (
					<MenuItem key={item.organisationId} value={item.organisationId}>
						{item.organisationName}
					</MenuItem>
				);
			});
		} else {
			return <MenuItem>No organisations</MenuItem>;
		}
	};

	handleSubmit = () => {
		const { sourceId, targetId, organisationId } = this.state;
		const { dispatch, close } = this.props;
		const apiData = {
			sourceId: sourceId,
			targetLanguageId: targetId,
			organisationId: organisationId,
		};
		dispatch(createProject(apiData, close, this.clearState));
    };
    

    canBeSubmitted() {
        const { sourceId, targetId, target, organisationId } = this.state;
        // console.log(sourceId, targetId, target, organisationId)
        return sourceId.toString().length > 0 && targetId.toString().length > 0 && target.toString().length > 0 && organisationId.toString().length > 0;
	}

	render() {
		const { source, sourceId, targetId, organisationId } = this.state;
        const { classes, open, close, allLanguages, isFetching } = this.props;
        const isEnabled = this.canBeSubmitted();


		var languageData = [];
		if (this.state.allLanguages !== null) {
			Object.values(allLanguages).map((lang) => {
				languageData.push({
					label: lang.languageName,
					value: lang.languageId,
					code: lang.languageCode,
				});
			});
		}
		console.log('Create Project', this.props);
		console.log('State Projects', this.state);
		return (
			<Dialog
				onClose={close}
				aria-labelledby="customized-dialog-title"
				open={open}
				fullWidth={true}
				maxWidth={'sm'}
			>
				{isFetching && <CircleLoader />}
				<DialogTitle id="customized-dialog-title" onClose={close}>
					<Typography variant="h6">Create project</Typography>
					<IconButton aria-label="close" className={classes.closeButton} onClick={close}>
						<CloseIcon />
					</IconButton>
				</DialogTitle>
				<DialogContent dividers className={classes.dailog}>
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<FormControl className={classes.formControl}>
								<InputLabel className={classes.label} htmlFor="select-language">
									Language
								</InputLabel>
								<Select
									className={classes.selectMenu}
									inputProps={{
										id: 'select-language',
									}}
									value={source}
									variant={'outlined'}
									onChange={(e) => this.setState({ source: e.target.value })}
									// onChange={(e) => this.setState({
									//     language: e.target.value,
									//     version: '',
									//     targetLanguage: ''
									// })
									// }
								>
									{this.displayLanguage()}
								</Select>
							</FormControl>
						</Grid>
						{/* <Grid item xs={6}> */}
						<Grid item xs={6}>
							<FormControl className={classes.formControl}>
								<InputLabel className={classes.label} htmlFor="select-version">
									Version
								</InputLabel>
								<Select
									className={classes.selectMenu}
									inputProps={{
										id: 'select-version',
									}}
									value={sourceId}
									variant={'outlined'}
									onChange={(e) => this.setState({ sourceId: e.target.value })}
								>
									{this.displayVersions()}
								</Select>
							</FormControl>
						</Grid>
						{/* </Grid> */}
						<Grid item xs={6}>
							{/* <FormControl className={classes.formControl}> */}
							<InputLabel className={classes.label} htmlFor="select-target">
								Target
							</InputLabel>
							<VirtualizedSelect
								className={classes.virtualSelect}
								options={languageData}
								onChange={(e) =>
									this.setState({
										target: e.label,
										targetId: e.value,
									})
								}
								value={targetId}
							/>
							{/* </FormControl> */}
						</Grid>
						<Grid item xs={6}>
							<FormControl className={classes.formControl} style={{ paddingTop: '16px' }}>
								<InputLabel className={classes.labelOrg} htmlFor="select-organisation">
									Organisation
								</InputLabel>
								<Select
									className={classes.selectMenu}
									inputProps={{
										id: 'select-organisation',
									}}
									value={organisationId}
									variant={'outlined'}
									onChange={(e) => this.setState({ organisationId: e.target.value })}
								>
									{this.displayOrganisations()}
								</Select>
							</FormControl>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button autoFocus onClick={close} color="secondary" size={'small'} variant={'contained'}>
						Close
					</Button>
					<Button autoFocus onClick={this.handleSubmit} color="primary" disabled={!isEnabled} size={'small'} variant={'contained'}>
						Create
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

const mapStateToProps = (state) => ({
	projects: state.project.projects,
	isFetching: state.project.isFetching,
	bibleLanguages: state.sources.bibleLanguages,
	allLanguages: state.sources.allLanguages,
	organisations: state.organisation.organisations,
});

const mapDispatchToProps = (dispatch) => ({
	dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CreateProject));
