import React, { Component } from "react";
import { Grid, ListItem, Divider } from "@material-ui/core";
import ComponentHeading from "../ComponentHeading";
import apiUrl from "../GlobalUrl";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { selectToken, selectedBooks } from "../../store/actions/sourceActions";
import {
  fetchTokenList,
  setSelectedToken,
} from "../../store/actions/projectActions";

import ReactToExcel from "react-html-table-to-excel";

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

  download = () => {
    console.log("dddddddddddddddd", this.props.tokenList);
  };

  render() {
    const { classes } = this.props;
    // console.log("Token list", this.props);
    console.log("dddddddddddddd", this.props.tokenList);
    return (
      <div>
        {/* <button onClick={this.download}>DOWNLOAD TOKEN</button>
               <button>UPLOAD TOKEN</button> */}
        <div className="App">
          {/* <table id="table-to-xls">
            <tbody> */}
              {this.props.tokenList.map((message) => (
                <tr key={message}>
                  <td>{message} </td>
                </tr>
              ))}
            {/* </tbody>
          </table> */}
          <ReactToExcel
            table="table-to-xls"
            filename="excelFile"
            sheet="sheet 1"
            buttonText="DOWNLOD"
          />
        </div>

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
