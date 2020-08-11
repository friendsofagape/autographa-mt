import React, { Component } from "react";
import { Grid, Button } from "@material-ui/core";
import MenuBar from "./MenuBar";
import TokenList from "./TokenList";
import Concordance from "./Concordance";
import TranslationsNotes from "./TranslationNotes";
import TranslationsWords from "./TranslationWords";
import UpdateTokens from "./UpdateTokens";
import { Switch } from "@material-ui/core";
import { Typography } from "@material-ui/core";
// import StatisticsSummary from '../StatisticsSummary';
import { withStyles } from "@material-ui/styles";
import { connect } from "react-redux";
import {
  setSelectedProject,
  fetchUserProjects,
} from "../../store/actions/projectActions";
import CircleLoader from "../loaders/CircleLoader";
import compose from "recompose/compose";
import { withRouter } from "react-router-dom";
// import Header from '../Header';

const styles = (theme) => ({
  root: {
    // backgroundColor: '#ededf4',
    paddingTop: "8px",
    margin: 0,
    width: "100%",
  },
});

class HomePage extends Component {
  state = {
    book: "",
    tokenList: "",
    token: "",
    concordance: "",
    targetLanguageId: 20,
    translationWords: "",
    tNswitchChecked: false,
    tWswitchChecked: false,
    tokenPane: 3,
    translationPane: 4,
    concordancePane: 5,
    displayConcordancePane: "block",
    translationWordsPane: 4,
    displayTranslationWords: "none",
    translationNotesPane: 3,
    displayTranslationNotes: "none",
    translationNotes: "",
    displayTranslationWordSwitch: "none",
    tokenTranslation: "",
    senses: [],
    bkvalue:""
  };

  updateState = (bk) => {
    this.setState({bkvalue:bk});
    // console.log("pppppppppppppppppppppppp", bk)
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchUserProjects());
  }

  componentDidUpdate(prevProps) {
    if (prevProps.userProjects !== this.props.userProjects) {
      const projectId = this.props.location.pathname.split("/").pop();
      const selectedProject = this.props.userProjects.filter(
        (item) => item.projectId === parseInt(projectId)
      );
      if (selectedProject.length > 0) {
        this.props.dispatch(setSelectedProject(selectedProject[0]));
      }
    }
  }

  handleTNSwitchChange = (e) => {
    const { tNswitchChecked } = this.state;
    if (tNswitchChecked) {
      this.setState({
        tNswitchChecked: !tNswitchChecked,
        tokenPane: 3,
        translationPane: 4,
        concordancePane: 5,
        displayTranslationNotes: "none",
        displayTranslationWordSwitch: "none",
        displayTranslationWords: "none",
        displayConcordancePane: "block",
        tWswitchChecked: false,
      });
    } else {
      this.setState({
        tNswitchChecked: !tNswitchChecked,
        tokenPane: 2,
        translationPane: 3,
        concordancePane: 4,
        displayTranslationNotes: "block",
        displayTranslationWordSwitch: "block",
      });
    }
  };

  handleTWSwitchChange = (e) => {
    const { tWswitchChecked } = this.state;
    if (!tWswitchChecked) {
      this.setState({
        tWswitchChecked: !tWswitchChecked,
        displayConcordancePane: "none",
        displayTranslationWords: "block",
        // displayTranslationWordSwitch:'block'
      });
    } else {
      this.setState({
        tWswitchChecked: !tWswitchChecked,
        displayConcordancePane: "block",
        displayTranslationWords: "none",
        // displayTranslationWordSwitch:'none'
      });
    }
  };

  render() {
    const { classes, isFetching } = this.props;
    const {
      tokenPane,
      translationPane,
      concordancePane,
      displayConcordancePane,
      translationWordsPane,
      translationNotesPane,
      displayTranslationWordSwitch,
    } = this.state;
    console.log("homepagessssssssssss", this.props);
    return (
      <Grid container direction='column' className={classes.root}>
        {/* <Grid item>
					Joel
				</Grid>
        <Grid item>
					Joel
				</Grid> */}
        {isFetching && <CircleLoader />}
        
        <Grid item container>
					{/* <Grid item sm={2}></Grid> */}
					<Grid item sm={4}>
            <MenuBar updateState={this.updateState} />
					</Grid>
					<Grid item sm={4}>
						Aaari Project
					</Grid>
					<Grid item sm={2}></Grid>
				</Grid>
        <Grid item container>
        <Grid item sm={3}>
            SOURCE TOKENS
            <Grid>
            <TokenList/>
            </Grid>
					</Grid>
					<Grid item sm={4}>
						TOKEN TRANSLATION
            <Grid>
            <UpdateTokens />
            <TranslationsWords />
            </Grid>
					</Grid>
					<Grid item sm={5}>
            TOKEN REFERENCE
            <Grid>
            <Concordance />
            <TranslationsNotes />
            </Grid>
          </Grid>
        </Grid>
        <Grid>
          <Grid container>
					<Grid item sm={4}>
						<Button variant="contained" color="primary">Upload tokens</Button>

						<Button variant="contained" color="secondary">Download tokens</Button>
					</Grid>
					<Grid item sm={4}>
						
					</Grid>
					<Grid item sm={2}>
          <Button variant="contained" color="secondary">Download Draft</Button>
          </Grid>
          </Grid>
        </Grid>
      </Grid>
      // <Grid container spacing={2} className={classes.root}>
      //   {isFetching && <CircleLoader />}
        
      //   <Grid item xs={3} style={{ minHeight: "480px" }}>
      //     <Grid item xs={12}>
      //       <MenuBar updateState={this.updateState} />
      //     </Grid>
      //      <TokenList/>
      //   </Grid>

        
      //   <Grid item xs={4}>
      //     <UpdateTokens />
      //     <TranslationsWords />
      //   </Grid>
      //   <Grid item xs={5}>
      //     <Grid item xs={12}>
      //       <Concordance />
      //     </Grid>
      //     <Grid item xs={12}>
      //       <TranslationsNotes />
      //     </Grid>
      //   </Grid>
        
      
      // </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  projects: state.project.projects,
  isFetching: state.project.isFetching,
  userProjects: state.project.userProjects,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

// export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(HomePage))
export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(withRouter(HomePage));
