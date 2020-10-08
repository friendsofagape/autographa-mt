import React, { Component } from "react";
import { Grid, ListItem, Divider, Button, Alert } from "@material-ui/core";
// import ComponentHeading from "../ComponentHeading";
// import apiUrl from "../GlobalUrl";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
// import { selectToken, selectedBooks } from "../../store/actions/sourceActions";
import {
  fetchTokenList,
  setSelectedToken,
} from "../../store/actions/projectActions";
// import { saveAs } from 'file-saver';
// import XLSX from 'xlsx';
// const accessToken = localStorage.getItem('accessToken');

// import ReactToExcel from "react-html-table-to-excel";


const styles = (theme) => ({
  root: {
    display: "flex",
  },
  tokenList: {
    height: "100%",
    overflowX: "hidden",
    overflowY: "auto",
    backgroundColor: "#fff",
  },
  containerGrid: {
    backgroundColor: "#fff",
    height: "305px",
  },
});

class TokenList extends Component {
  state = {
    tokenList: [],
    // checkBox:true
  };

  
  getTokens() {
    console.log('afdfacasfc', this.props.checkvalue)
    if(this.props.checkvalue==false){
      const { tokenList, dispatch } = this.props;
      if (tokenList) {
        return tokenList.map((item, index) => {
          return (
            <div key={item + index}>
              <ListItem
                button
                name={item}
                style={{fontSize:'14px'}}
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
    }else{
      const { untoken, dispatch } = this.props;
      if (untoken) {
        return untoken.map((item, index) => {
          return (
            <div key={item + index}>
              <ListItem
                button
                name={item}
                style={{fontSize:'14px', color:'#a3811c'}}
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
    
  }


  render() {
    const { classes } = this.props;
    
    return (
        <Grid item xs={12} className={classes.containerGrid}>
          <Grid item xs={12} className={classes.tokenList}>
            {this.getTokens()}
          </Grid>
        </Grid>
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
