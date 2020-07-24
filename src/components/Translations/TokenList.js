import React, { Component } from "react";
import { Grid, ListItem, Divider, Button, Alert } from "@material-ui/core";
import ComponentHeading from "../ComponentHeading";
import apiUrl from "../GlobalUrl";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { selectToken, selectedBooks } from "../../store/actions/sourceActions";
import {
  fetchTokenList,
  setSelectedToken,
} from "../../store/actions/projectActions";
import { saveAs } from 'file-saver';
import XLSX from 'xlsx';
const accessToken = localStorage.getItem('accessToken');



// import ReactToExcel from "react-html-table-to-excel";







const styles = (theme) => ({
  root: {
    display: "flex",
  },
  tokenList: {
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: "93%",
    overflowX: "hidden",
    overflowY: "auto",
    backgroundColor: "#fff",
  },
  containerGrid: {
    // width: '97%',
    // marginLeft: '2%',
    // marginRight: '2%',
    border: '1px solid "#2a2a2fbd"',
    boxShadow:
      "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    height: "100%",
    backgroundColor: "#fff",
    height: "576px",
  },
});

class TokenList extends Component {
  state = {
    tokenList: [],
  };

  // async getTokenList(currentBook, sourceId) {
  //     var bookData = await fetch(apiUrl + 'v1/tokenlist/' + sourceId + '/' + currentBook, {
  //         method: 'GET'
  //     })
  //     const tokenList = await bookData.json();
  //     this.setState({ tokenList: tokenList })
  // }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedBook !== this.props.selectedBook) {
      // this.props.dispatch(fetchTokenList(this.props.book, this.props.selectedProject.sourceId))
      this.props.dispatch(
        fetchTokenList(
          this.props.selectedBook,
          this.props.selectedProject.sourceId
        )
      );
    }
  }

  // componentWillReceiveProps(nextProps) {
  //     const { book, project } = nextProps
  //     if(book){
  //         this.getTokenList(book, project.sourceId)
  //     }else{
  //         this.setState({tokenList: []})
  //     }
  // }

  getTokens() {
    const { tokenList, dispatch } = this.props;
    if (tokenList) {
      return tokenList.map((item, index) => {
        return (
          <div key={item + index}>
            <ListItem
              button
              name={item}
              value={item}
              onClick={() => dispatch(setSelectedToken(item))}
            >
              {item}
            </ListItem>
            <Divider />
          </div>
        );
      });
    } else {
      return <ListItem>Select Target Language to display tokens</ListItem>;
    }
  }

  clickdownload = () => {
    // console.log("dddddddddddddddd", this.props.currentBook);
    var tokenarray =  this.props.tokenList.map(i => [i])
    tokenarray.unshift(['token','translation','senses'])
    var wb = XLSX.utils.book_new();
      wb.Props = {
        Title : "TokenList",
        Subject : "TokenList",
        Author : "TokenList",
        CreatedDate : new Date()
        };
        wb.SheetNames.push("TokenList");
        var ws_data = tokenarray;
        var ws = XLSX.utils.aoa_to_sheet(ws_data);
        wb.Sheets["TokenList"] = ws;

        var wbout = XLSX.write(wb, {bookType:'xlsx', type:'binary'});
        function s2ab(s) {
          var buf = new ArrayBuffer(s.length);
          var view = new Uint8Array(buf);
          for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
          return buf;
        }
    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}),this.props.selectedBook+'.xlsx');
  };

  clickupload = (e) => {
    var proId = this.props.selectedProject.projectId;
    var files = e.target.files,
    f = files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
      // var contents = e.target.result;
      var data = new Uint8Array(e.target.result);
      var workbook = XLSX.read(data, {type: 'array'});
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      var tknlist = XLSX.utils.sheet_to_json(worksheet)
      var jsondata = {
        "projectId":proId,
        "tokenTranslations":tknlist
      }
      console.log("ttttttttttt", jsondata)
      var respdata = fetch(apiUrl + 'v1/autographamt/projects/bulktranslations',{
          method: 'POST',
          body: JSON.stringify(jsondata),
          headers: {
              Authorization: 'bearer ' + accessToken
          }
      })
      .then(response => response.json())
      .then(data => alert(data.message));
    };

    reader.onerror = function(e) {
      console.error("File could not be read! Code " + e.target.error.code);
    };
    reader.readAsArrayBuffer(f);
  }


  canBeSubmitted() {
        const {  tokenList } = this.props;
        // console.log('jjjjjjjjjjjjjjjjjjjjjj', tokenlist)
        // console.log("eeeeeeeeeeeeeeeeeeeeeeeeeee", this.state)
        return tokenList.length > 0 ;
  }


  render() {
    const { classes } = this.props;
    const isEnabled = this.canBeSubmitted();
    // console.log("Token list", this.props);
    // console.log("ddddddddddddd00000000000000000d", this.props.selectedProject.projectId);
    return (
      <div>
      <div>
         <Button size="small"
            variant="contained"
            color="primary"
            disabled={!isEnabled}
            onClick ={this.clickdownload}>
            Download Tokens
        </Button>
        </div>
        <br />
        <div>
        <label tmlFor="upload-photo">
          <input
            style={{ display: 'none' }}
            id="upload-photo"
            name="upload-photo"
            type="file"
            onChange={this.clickupload}
          />
          <Button
            color="secondary"
            variant="contained"
            disabled={!isEnabled}
            component="span">
            Upload Tokens
          </Button>
       </label>
       </div>
       <br />
        <Grid item xs={12} className={classes.containerGrid}>
          <Grid item xs={12}>
            <ComponentHeading
              data={{
                classes: classes,
                text: "Token List",
                styleColor: "#2a2a2fbd",
              }}
            />
          </Grid>
          <Grid item xs={12} className={classes.tokenList}>
            {this.getTokens()}
          </Grid>
        </Grid>
        </div>
    );
  }
}

const mapStateToProps = (state) => ({
  projects: state.project.projects,
  isFetching: state.project.isFetching,
  userProjects: state.project.userProjects,
  selectedBook: state.project.selectedBook,
  tokenList: state.project.tokenList,
  selectedProject: state.project.selectedProject,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TokenList));
