import React, { Component } from "react";
import { Grid, Button, Divider, Tooltip, Paper } from "@material-ui/core";
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
import XLSX from "xlsx";
import { saveAs } from "file-saver";
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
    checkBox: false,
    allTokenList: [],
    untranslatedToken: [],
    translatedTokens: [],
    tokenData: [],
    allList: [],
    untoken: [],
    translatedTokensCount: "",
    tokenUpdateData: "",
    tokenSelected: "",
  };

  // Update the tokens details
  updateState = (bk) => {
    this.setState({ loading: true, bkvalue: bk, tokenSelected: "" });
    var proId = this.props.selectedProject.projectId;
    var bookname = bk;
    fetch(apiUrl + "v1/tokentranslationlist/" + proId + "/" + bookname + "", {
      method: "GET",
      headers: {
        Authorization: "bearer " + accessToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        let excelUnTokens = [];

        let allTokenArray = [];
        let unTokenArray = [];

        data.map((i) => {
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

  // check box for unknow translation
  checkHandleChange = () => {
    if (this.state.checkBox === true) {
      this.setState({ checkBox: false });
    } else {
      this.setState({ checkBox: true });
    }
  };

  // download token in excel
  // clickdownload = () => {
  //   //  full token translations
  //   if (this.state.checkBox === false) {
  //     let tokenarray = [["token", "translation", "senses"]];
  //     tokenarray.push(...this.state.allTokenList);
  //     var wb = XLSX.utils.book_new();
  //     wb.Props = {
  //       Title: "TokenList",
  //       Subject: "TokenList",
  //       Author: "TokenList",
  //       CreatedDate: new Date(),
  //     };
  //     wb.SheetNames.push("TokenList");
  //     var ws_data = tokenarray;
  //     var ws = XLSX.utils.aoa_to_sheet(ws_data);
  //     wb.Sheets["TokenList"] = ws;
  //     var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
  //     function s2ab(s) {
  //       var buf = new ArrayBuffer(s.length);
  //       var view = new Uint8Array(buf);
  //       for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
  //       return buf;
  //     }
  //     saveAs(
  //       new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
  //       this.state.bkvalue + ".xlsx"
  //     );
  //   } else {
  //     //  ----------Untraslated Tokens----------
  //     let untokenarray = [["token", "translation", "senses"]];
  //     untokenarray.push(...this.state.untranslatedToken);
  //     var wb = XLSX.utils.book_new();
  //     wb.Props = {
  //       Title: "TokenList",
  //       Subject: "TokenList",
  //       Author: "TokenList",
  //       CreatedDate: new Date(),
  //     };
  //     wb.SheetNames.push("TokenList");
  //     var ws_data = untokenarray;
  //     var ws = XLSX.utils.aoa_to_sheet(ws_data);
  //     wb.Sheets["TokenList"] = ws;
  //     var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
  //     function s2ab(s) {
  //       var buf = new ArrayBuffer(s.length);
  //       var view = new Uint8Array(buf);
  //       for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
  //       return buf;
  //     }
  //     saveAs(
  //       new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
  //       this.state.bkvalue + ".xlsx"
  //     );
  //   }
  // };

  // Upload tokens from excel file
  // clickupload = (e) => {
  //   const stoploading = () => {
  //     this.setState({ loading: false });
  //   };
  //   this.setState({ loading: true });
  //   var proId = this.props.selectedProject.projectId;
  //   var files = e.target.files,
  //     f = files[0];
  //   var that = this;
  //   var reader = new FileReader();
  //   reader.onload = function (e) {
  //     var data = new Uint8Array(e.target.result);
  //     var workbook = XLSX.read(data, { type: "array" });
  //     var first_sheet_name = workbook.SheetNames[0];
  //     var worksheet = workbook.Sheets[first_sheet_name];
  //     var tknlist = XLSX.utils.sheet_to_json(worksheet);
  //     var jsondata = {
  //       projectId: proId,
  //       tokenTranslations: tknlist,
  //     };
  //     fetch(apiUrl + "v1/autographamt/projects/bulktranslations", {
  //       method: "POST",
  //       body: JSON.stringify(jsondata),
  //       headers: {
  //         Authorization: "bearer " + accessToken,
  //       },
  //     })
  //       .then((response) => {
  //         stoploading();
  //         return response.json();
  //       })
  //       .then((data) => {
  //         that.updateState(that.state.bkvalue);
  //         alert(data.message);
  //       });
  //   };
  //   reader.onerror = function (e) {
  //     console.error("File could not be read! Code " + e.target.error.code);
  //   };
  //   reader.readAsArrayBuffer(f);
  // };

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
          <Typography component="h3" variant="h9">
            {this.props.selectedProject.projectName &&
              this.props.selectedProject.projectName
                .split("|")[0]
                .toUpperCase()}
          </Typography>
        </Grid>

        {this.state.bkvalue && (
          <Grid item container sm={5} style={{ marginTop: "1%" }}>
            <Grid item sm={4}>
              <Typography
                component="h5"
                variant="h9"
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
              {/* <span style={{fontSize:'78%'}}>{this.state.translatedTokensCount}/{alltokenProgress}</span> */}
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
            item
            container
            style={{ paddingTop: "2%", paddingLeft: "10px" }}
            spacing={0}
          >
            <Grid item sm={3} style={{ paddingRight: "2%" }}>
              <Paper elevation="2">
                <Grid sm={12} style={{ backgroundColor: "#f2eddf" }}>
                  <Typography
                    component="h4"
                    variant="h7"
                    style={{
                      textAlign: "center",
                      padding: "4%",
                    }}
                  >
                    Source Tokens
                  </Typography>
                </Grid>
              </Paper>

              <Grid item sm={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={this.checkHandleChange}
                      size="small"
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
                      // onChange={this.checkHandleChange}
                      color="primary"
                      size="small"
                      inputProps={{
                        "aria-label": "checkbox with small size",
                      }}
                    />
                  }
                  label="Single word"
                />
              </Grid>

              <Grid container style={{ paddingBottom: "2%" }}>
                <Grid item sm={1}></Grid>
                {/* <Grid item sm={4}>
                  <Tooltip title="Download tokens for offline translation">
                    <Button
                      color="primary"
                      variant="contained"
                      size="small"
                      disabled={!this.state.bkvalue}
                      onClick={this.clickdownload}
                    >
                      <span style={{ fontSize: "78%" }}> Download</span>
                    </Button>
                  </Tooltip>
                </Grid>

                <Grid item sm={4}>
                  <label tmlFor="upload-photo">
                    <input
                      style={{ display: "none" }}
                      id="upload-photo"
                      name="upload-photo"
                      type="file"
                      onChange={this.clickupload}
                    />
                    <Tooltip title="Upload translated tokens">
                      <Button
                        color="primary"
                        variant="contained"
                        size="small"
                        disabled={!this.state.bkvalue}
                        component="span"
                      >
                        {this.state.loading && <CircleLoader />}
                        <span style={{ fontSize: "78%" }}>Upload</span>
                      </Button>
                    </Tooltip>
                  </label>
                </Grid> */}
                <Grid item sm={2}>
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
                <Grid item sm={1}></Grid>
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
                <Paper elevation="1">
                  <TokenList
                    checkvalue={this.state.checkBox}
                    untoken={this.state.untoken}
                    allList={this.state.allList}
                    bk={this.state.bkvalue}
                    tokenUpdateState={this.tokenUpdateState}
                  />
                </Paper>
              </Grid>
            </Grid>

            <Grid item sm={5} style={{ paddingRight: "2%" }}>
              <Paper elevation="2">
                <Grid item sm={12} style={{ backgroundColor: "#f2eddf" }}>
                  <Typography
                    component="h4"
                    variant="h7"
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
                <Paper elevation="1">
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
              <Paper elevation="2">
                <Grid item sm={12} style={{ backgroundColor: "#f2eddf" }}>
                  <Typography
                    component="h4"
                    variant="h7"
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
                <Paper elevation="1">
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
