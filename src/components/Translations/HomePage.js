import React, { Component } from "react";
import { Grid, Divider, Tooltip, Paper } from "@material-ui/core";
import MenuBar from "./MenuBar";
import TokenList from "./TokenList";
import Concordance from "./Concordance";
import TranslationsWords from "./TranslationWords";
import UpdateTokens from "./UpdateTokens";
import { Typography } from "@material-ui/core";
import { connect } from "react-redux";
import {
  setSelectedProject,
  fetchUserProjects,
} from "../../store/actions/projectActions";
import CircleLoader from "../loaders/CircleLoader";
import { withRouter } from "react-router-dom";
import apiUrl from "../GlobalUrl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CachedIcon from "@material-ui/icons/Cached";
const accessToken = localStorage.getItem("accessToken");

class HomePage extends Component {
  state = {
    token: "",
    error: null,
    bkvalue: "",
    loading: false,
    untranslated: false,
    allTokenList: [],
    untranslatedToken: [],
    translatedTokens: [],
    tokenData: [],
    allList: [],
    untoken: [],
    translatedTokensCount: "",
    tokenUpdateData: "",
    tokenSelected: "",
    singleWord: false,
  };

  // Update the tokens details
  updateState = (bk) => {
    this.setState({ loading: true, bkvalue: bk, tokenSelected: "" });
    var proId = this.props.selectedProject.projectId;
    var bookname = bk;
    fetch(
      apiUrl +
        "v1/tokentranslationlist/" +
        proId +
        (this.state.singleWord ? "?only_words=True" : "?") +
        "&books=" +
        bookname +
        "",
      {
        method: "GET",
        headers: {
          Authorization: "bearer " + accessToken,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        let excelUnTokens = [];

        let allTokenArray = [];
        let unTokenArray = [];

        data.forEach((i) => {
          allTokenArray.push(i[0]);
          if (i[1] == null) {
            excelUnTokens.push(i);
            unTokenArray.push(i[0]);
          }
        });

        let translatedTokenCount = data.length - unTokenArray.length;
        this.setState({
          untranslatedToken: excelUnTokens.sort(),
          allTokenList: data.sort(),
          translatedTokensCount: translatedTokenCount,
          untoken: unTokenArray.sort(),
          allList: allTokenArray.sort(),
          loading: false,
        });
      })
      .catch((error) => this.setState({ error, isLoading: false }));
  };

  tokenUpdateState = (data, token) => {
    this.setState({ tokenUpdateData: data, tokenSelected: token });
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchUserProjects());
  }

  // Check if the previous values has been changed
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

  // check box for untranslated token
  checkHandleChange = () => {
    this.setState({ untranslated: !this.state.untranslated });
  };
  checkSinglekWord = () => {
    this.setState({ singleWord: !this.state.singleWord }, () => {
      this.updateState(this.state.bkvalue);
    });
  };

  render() {
    const { isFetching } = this.props;
    var alltokenProgress = this.state.allTokenList.length;

    return (
      <Grid container>
        {isFetching && <CircleLoader />}
        <Grid item sm={3}>
          <MenuBar updateState={this.updateState} />
        </Grid>
        <Grid item sm={4} style={{ textAlign: "center", paddingTop: "10px" }}>
          <Typography component="h3" variant="h6">
            {this.props.selectedProject.projectName &&
              this.props.selectedProject.projectName
                .split("|")[0]
                .toUpperCase()}
          </Typography>
        </Grid>
        {this.state.bkvalue && (
          <Grid container item  sm={5} style={{ marginTop: "1%" }}>
            <Grid item sm={4}>
              <Typography
                component="h5"
                variant="h6"
                style={{
                  textAlign: "right",
                  paddingRight: "10px",
                }}
              >
                Translation Progress
              </Typography>
            </Grid>
            <Grid
              item
              sm={4}
              style={{ textAlign: "right", paddingRight: "5px" }}
            >
              <progress
                value={this.state.translatedTokensCount}
                max={alltokenProgress}
              />
            </Grid>
            <Grid item sm={2}>
              <span style={{ fontSize: "78%" }}>
                {this.state.translatedTokensCount}/{alltokenProgress}
              </span>
            </Grid>
            <Grid item sm={2}>
              <Tooltip title="Click here to reload tokens">
                <CachedIcon
                  fontSize="default"
                  color="secondary"
                  onClick={() => {
                    this.updateState(this.state.bkvalue);
                  }}
                />
              </Tooltip>
            </Grid>
          </Grid>
        )}
        <Grid item sm={12} style={{ marginTop: "2%" }}>
          <Divider />
        </Grid>
        {this.state.bkvalue && (
          <Grid
            container
            style={{ paddingTop: "2%", paddingLeft: "10px" }}
            spacing={0}
          >
            <Grid item sm={3} style={{ paddingRight: "2%" }}>
              <Paper elevation={2}>
                <Grid container style={{ backgroundColor: "#f2eddf" }}>
                  <Grid item sm={11}>
                    <Typography
                      component="h4"
                      variant="h6"
                      style={{
                        textAlign: "center",
                        padding: "4%",
                      }}
                    >
                      Source Tokens
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    sm={1}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <Tooltip title="Click here to reload tokens">
                      <CachedIcon
                        fontSize="small"
                        color="secondary"
                        onClick={() => {
                          this.updateState(this.state.bkvalue);
                        }}
                      />
                    </Tooltip>
                  </Grid>
                </Grid>
              </Paper>
              <Grid item sm={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={this.checkHandleChange}
                      size="small"
                      checked={this.state.untranslated}
                      inputProps={{
                        "aria-label": "checkbox with small size",
                      }}
                    />
                  }
                  label="Untranslated Tokens"
                />
              </Grid>
              <Grid item sm={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      inputProps={{
                        "aria-label": "checkbox with small size",
                      }}
                      checked={this.state.singleWord}
                      onChange={this.checkSinglekWord}
                    />
                  }
                  label="Single Word"
                />
              </Grid>
              <Grid
                item
                sm={12}
                style={{
                  paddingLeft: "0%",
                  paddingRight: "0%",
                  paddingTop: "3%",
                  paddingBottom: "2%",
                }}
              >
                <Grid item sm={12}></Grid>
                <Paper elevation={1}>
                  <TokenList
                    checkvalue={this.state.untranslated}
                    untoken={this.state.untoken}
                    allList={this.state.allList}
                    bk={this.state.bkvalue}
                    tokenUpdateState={this.tokenUpdateState}
                  />
                </Paper>
              </Grid>
            </Grid>
            <Grid item sm={5} style={{ paddingRight: "2%" }}>
              <Paper elevation={2}>
                <Grid item sm={12} style={{ backgroundColor: "#f2eddf" }}>
                  <Typography
                    component="h4"
                    variant="h6"
                    style={{
                      textAlign: "center",
                      padding: "2%",
                    }}
                  >
                    Token Translation
                  </Typography>
                </Grid>
              </Paper>
              <Grid
                item
                sm={12}
                style={{
                  paddingLeft: "0%",
                  paddingRight: "0%",
                  paddingTop: "2%",
                  paddingBottom: "2%",
                }}
              >
                <Paper elevation={1}>
                  <UpdateTokens
                    updateState={this.updateState}
                    bkvalue={this.state.bkvalue}
                    tokenUpdateData={this.state.tokenUpdateData}
                    tokenSelected={this.state.tokenSelected}
                  />
                </Paper>
              </Grid>
            </Grid>
            <Grid item sm={4} style={{ paddingRight: "2%" }}>
              <Paper elevation={2}>
                <Grid item sm={12} style={{ backgroundColor: "#f2eddf" }}>
                  <Typography
                    component="h4"
                    variant="h6"
                    style={{
                      textAlign: "center",
                      padding: "3%",
                    }}
                  >
                    References
                  </Typography>
                </Grid>
              </Paper>
              <Grid
                item
                sm={12}
                style={{
                  paddingLeft: "0%",
                  paddingRight: "0%",
                  paddingTop: "2%",
                  paddingBottom: "2%",
                }}
              >
                <Paper elevation={1}>
                  <Concordance
                    updateState={this.updateState}
                    bkvalue={this.state.bkvalue}
                    tokenUpdateData={this.state.tokenUpdateData}
                    tokenSelected={this.state.tokenSelected}
                  />
                  <TranslationsWords
                    updateState={this.updateState}
                    bkvalue={this.state.bkvalue}
                    tokenUpdateData={this.state.tokenUpdateData}
                    tokenSelected={this.state.tokenSelected}
                  />
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  isFetching: state.project.isFetching,
  userProjects: state.project.userProjects,
  selectedProject: state.project.selectedProject,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(HomePage));
