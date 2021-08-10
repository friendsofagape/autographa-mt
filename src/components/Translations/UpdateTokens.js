import React, { Component } from "react";
import { Grid, Button, Typography, Divider } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import swal from "sweetalert";
import apiUrl from "../GlobalUrl";
import CircleLoader from "../loaders/CircleLoader";

const accessToken = localStorage.getItem("accessToken");

const styles = (theme) => ({
  root: {
    display: "flex",
    flexGrow: 1,
  },
  inputField: {
    width: "90%",
    marginLeft: "10px",
  },
  containerGrid: {
    border: '1px solid "#2a2a2fbd"',
    boxShadow:
      "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    height: "320px",
    backgroundColor: "#fff",
  },
  tokenDetails: {
    height: "100%",
    overflowX: "hidden",
    overflowY: "auto",
    backgroundColor: "#fff",
  },
  containerGridToken: {
    backgroundColor: "#fff",
    height: "130px",
  },
  button: {
    margin: "10px",
  },
});

class UpdateTokens extends Component {
  state = {
    token: "",
    updateToken: "",
    translation: "",
    updateTranslation: "",
    sense: "",
    addSense: "",
    bkvalueChange: "",
    loading: "",
    senses: [],
  };

// set state into empty
  componentWillMount() {
    this.setState({
      token: this.props.tokenSelected,
      updateToken: this.props.tokenSelected,
      translation: this.props.tokenUpdateData.translation,
      updateTranslation: this.props.tokenUpdateData.translation,
      sense: this.props.tokenUpdateData.senses,
    });
  }

//   check previous value
  componentWillReceiveProps(nextProps) {
    const oldSelectBook = this.props.bkvalue;
    const newSelectBook = nextProps.bkvalue;

    this.setState({
      token: nextProps.tokenSelected,
      updateToken: nextProps.tokenSelected,
      translation: nextProps.tokenUpdateData.translation,
      updateTranslation: nextProps.tokenUpdateData.translation,
      sense: nextProps.tokenUpdateData.senses,
    });

    if (oldSelectBook != newSelectBook) {
      this.setState({
        token: "",
        updateToken: "",
        translation: "",
        updateTranslation: "",
        sense: "",
        addSense: "",
      });
    }

    if (!nextProps.tokenSelected) {
      this.setState({
        token: "",
        updateToken: "",
        translation: "",
        updateTranslation: "",
        sense: "",
        addSense: "",
      });
    }
  }

//   update token details and save to db
  updateTokenSense = () => {
    const { selectedProject } = this.props;
    const { addSense, updateTranslation, updateToken } = this.state;
    const apiData = {
      projectId: selectedProject.projectId,
      token: updateToken,
      translation: updateTranslation,
      senses: [addSense]
    };
    this.saveTokenDetails(apiData);
  };

  async saveTokenDetails(apiData) {
    try {
      const response = await fetch(
        apiUrl + "v1/autographamt/projects/translations",
        {
          method: "POST",
          body: JSON.stringify(apiData),
          headers: {
            Authorization: "bearer " + accessToken,
          },
        }
      );
      const json = await response.json();
      if (json.success) {
        this.newTokenState(this.state.updateToken);
        swal({
          title: "Token translation",
          text: json.message,
          icon: "success",
        });
      } else {
        swal({
          title: "Token translation",
          text: json.message,
          icon: "error",
        });
      }
    } catch (ex) {
      swal({
        title: "Token translation",
        text:
          "Token translation failed, check your internet connection or contact admin",
        icon: "error",
      });
    }
  }


  newTokenState(item) {
    const { sourceId, targetId } = this.props.selectedProject;
    fetch(
      apiUrl + "/v1/translations/" + sourceId + "/" + targetId + "/" + item,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          translation: data.translation,
          sense: data.senses,
          addSense: "",
        });
      })
      .catch((error) => {
        swal({
          title: "Translation fetch error",
          text:
            "Failed to fetch token translation, check your internet connection or contact admin",
          icon: "error",
        });
      });
  }


  render() {
    const { classes, selectedProject } = this.props;
    const { updateToken, translation, updateTranslation, sense } = this.state;
    var displayLanguage = "";
    if (selectedProject.projectName) {
      displayLanguage = selectedProject.projectName.split("|")[0].split("-")[2];
    }
    return (
      <Grid item xs={12}>
        {this.state.loading && <CircleLoader />}
        <Typography
          component="h4"
          variant="h7"
          style={{
            textAlign: "left",
            paddingLeft: "3%",
            paddingBottom: "1%",
            paddingTop: "1%",
          }}
        >
          Token Details
        </Typography>
        <Grid className={classes.containerGridToken}>
          <Grid className={classes.tokenDetails}>
            <Grid item container sm={12}>
              <Grid item sm={4} style={{ paddingTop: "3%", paddingLeft: "4%" }}>
                <Typography
                  variant="inherit"
                  align="left"
                  style={{ color: "#c20a6e" }}
                >
                  Token:
                </Typography>
              </Grid>
              <Grid item sm={7} style={{ paddingLeft: "4%", paddingTop: "3%" }}>
                {updateToken}
              </Grid>
            </Grid>

            <Grid item container sm={12}>
              <Grid item sm={4} style={{ paddingTop: "3%", paddingLeft: "4%" }}>
                <Typography
                  variant="inherit"
                  align="left"
                  style={{ color: "#c20a6e" }}
                >
                  Translation:
                </Typography>
              </Grid>
              <Grid item sm={7} style={{ paddingLeft: "4%", paddingTop: "3%" }}>
                {translation}
              </Grid>
            </Grid>

            <Grid item container sm={12}>
              <Grid item sm={4} style={{ paddingTop: "3%", paddingLeft: "4%" }}>
                <Typography
                  variant="inherit"
                  align="left"
                  style={{ color: "#c20a6e" }}
                >
                  Synonyms:
                </Typography>
              </Grid>
              <Grid item sm={7} style={{ paddingLeft: "4%", paddingTop: "3%" }}>
                {sense && sense.filter(item=>item).join(", ")}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Divider />
        <Typography
          component="h4"
          variant="h7"
          style={{
            textAlign: "left",
            paddingLeft: "3%",
            paddingBottom: "2%",
            paddingTop: "1%",
          }}
        >
          Update Selected Token
        </Typography>

        <Grid item container xs={12}>
          <Grid item sm={1}></Grid>
          <Grid item sm={5}>
            <TextField
              disabled
              margin="dense"
              variant="outlined"
              value={updateToken}
              label={"Token"}
              className={classes.inputField}
            />
          </Grid>
          <Grid item sm={5}>
            <TextField
              margin="dense"
              variant="outlined"
              value={updateTranslation}
              className={classes.inputField}
              onChange={(e) =>
                this.setState({ updateTranslation: e.target.value })
              }
            />
          </Grid>
          <Grid item sm={1}></Grid>
        </Grid>

        <Grid container justify="center" alignItems="center">
          <Typography
            variant="inherit"
            align="left"
            style={{ color: "rgb(145, 148, 151)", paddingTop: "10px" }}
          >
            Add alternate translations, not mandatory
          </Typography>
        </Grid>

        <Grid item container xs={12}>
          <Grid item sm={1}></Grid>
          <Grid item xs={12} sm={10}>
            <TextField
              required
              label="Add Senses"
              value={this.state.addSense}
              onChange={(e) => this.setState({ addSense: e.target.value })}
              margin="dense"
              helperText="Note: Enter each senses seprated by commas(,) "
              variant="outlined"
              className={classes.inputField}
            />
          </Grid>
          <Grid item sm={1}></Grid>
        </Grid>

        <Grid container justify="center" alignItems="center">
          <Button
            variant="contained"
            color="primary"
            size="small"
            disabled={!this.state.updateTranslation}
            className={classes.button}
            onClick={this.updateTokenSense}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedProject: state.project.selectedProject,
    translation: state.project.translation,
    senses: state.project.senses
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(UpdateTokens));
