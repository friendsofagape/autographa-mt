import React, { Component } from "react";
import { Grid, ListItem, Divider} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import apiUrl from "../GlobalUrl";
import swal from 'sweetalert';



const styles = (theme) => ({
  root: {
    display: "flex",
  },
  tokenList: {
    height: "100%",
    overflowX: "hidden",
    overflowY: "auto",
    backgroundColor: "#ededed",
  },
  containerGrid: {
    backgroundColor: "#ededed",
    height: "330px",
  },
});

class TokenList extends Component {
  state = {
    loading:'',
    selectToken:'',
    bk:''
  };

  // fetch tokens from database
  gettokenDetails(item){
    if(this.state.selectToken!=item){
      const { sourceId, targetId} =this.props.selectedProject;
      
      fetch(apiUrl + '/v1/translations/' + sourceId + '/' + targetId + '/' + item, {
        method: 'GET' })
        .then(response => response.json())
        .then(data =>
          {
            this.setState({selectToken:item}) 
            if(data.success==false){
              const emptyData = {
                translation: '',
                senses: ''
              }
              this.props.tokenUpdateState(emptyData,this.state.selectToken);
            }
            else{
              this.props.tokenUpdateState(data,this.state.selectToken);
            }
          }
      ).catch( error => {
        swal({
        title: 'Translation fetch error',
        text: 'Failed to fetch token translation, check your internet connection or contact admin',
        icon: 'error'
        });
      })
    };
    
  }
  
  // display token in list view and get details on onclick function
  getTokens(){
    const { untoken, allList, checkvalue } = this.props;
    if(checkvalue==false){
      if (allList) {
        return allList.map((item, index) => {
          return (
            <div key={item + index}>
              <ListItem
                button
                name={item}
                style={{fontSize:'14px'}}
                value={item}
                onClick={() => this.gettokenDetails(item)}
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
      if (untoken) {
        return untoken.map((item, index) => {
          return (
            <div key={item + index}>
              <ListItem
                button
                name={item}
                style={{fontSize:'14px', color:'#a3811c'}}
                value={item}
                onClick={() => this.gettokenDetails(item)}
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
  selectedProject: state.project.selectedProject,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TokenList));
