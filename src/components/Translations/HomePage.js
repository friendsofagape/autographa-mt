import React, { Component } from "react";
import { Grid, Button, Divider, CssBaseline, Toolbar,Tooltip, Paper } from "@material-ui/core";
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
import {
  fetchTokenList,
  setSelectedToken,
} from "../../store/actions/projectActions";
import XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import apiUrl from "../GlobalUrl";
const accessToken = localStorage.getItem('accessToken');


const styles = (theme) => ({
  root: {
    // backgroundColor: '#ededf4',
    // paddingTop: "8px",
    // margin: 0,
    // width: "100%",
  }
  
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
    bkvalue:"",
    loading: false
  };

  updateState = (bk) => {
    this.setState({bkvalue:bk});
     console.log("pppppppppppppppppppppppp", bk)
    this.props.dispatch(
      fetchTokenList(
        bk,
        this.props.selectedProject.sourceId
      )
    );
    
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




  clickdownload = () => {
      //  full translations
    var proId = this.props.selectedProject.projectId;
    var bookname = this.state.bkvalue
    
    fetch(apiUrl + 'v1/tokentranslationlist/'+proId+'/'+bookname+'', {
      method: 'GET',
      headers: {
          Authorization: 'bearer ' + accessToken
      }
      })
      .then(response => response.json())
      .then(data =>
        {
          var tokenarray =  data
          tokenarray.unshift(['token','translation','senses'])
          // console.log('lllllllllllllllllllllllllll', tokenarray)
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
        saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}),this.state.bkvalue+'.xlsx');
        }
        
      )
      .catch(error => this.setState({ error, isLoading: false }));


      //  -------------------- 2nd trnasln---------------------
      
    // console.log("dddddddddddddddd", this.props.currentBook);
    // console.log('ffffffffffffffffffff',this.props)
    // var tokenarray =  this.props.tokenList.map(i => [i])
    // tokenarray.unshift(['token','translation','senses'])
    // var wb = XLSX.utils.book_new();
    //   wb.Props = {
    //     Title : "TokenList",
    //     Subject : "TokenList",
    //     Author : "TokenList",
    //     CreatedDate : new Date()
    //     };
    //     wb.SheetNames.push("TokenList");
    //     var ws_data = tokenarray;
    //     var ws = XLSX.utils.aoa_to_sheet(ws_data);
    //     wb.Sheets["TokenList"] = ws;

    //     var wbout = XLSX.write(wb, {bookType:'xlsx', type:'binary'});
    //     function s2ab(s) {
    //       var buf = new ArrayBuffer(s.length);
    //       var view = new Uint8Array(buf);
    //       for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    //       return buf;
    //     }
    // saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}),this.state.bkvalue+'.xlsx');
  };


  clickupload = (e) => {
    const stoploading = () => {
      this.setState({loading:false})
    }
    this.setState({loading:true});
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
      .then(response => {
        console.log('kkkkkk', data)
        stoploading();
        return response.json()
      })
      .then(data => {
        alert(data.message)
        console.log('jjjjjjj', data)
      });
    };

    reader.onerror = function(e) {
      console.error("File could not be read! Code " + e.target.error.code);
    };
    reader.readAsArrayBuffer(f);
  }


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
    var projName = this.props.selectedProject.projectName
    // console.log("saaaaaaaaaaaaaaaa",projName.split('|'))
    return (
      <Grid container /*className={classes.root}*/>
        {isFetching && <CircleLoader />}
        
					<Grid item sm={3}>
            <MenuBar updateState={this.updateState} />
					</Grid>
					
          <Grid item sm={4} style={{textAlign:'center'}}>
            <Typography component="h2" variant="h7">
						  {this.props.selectedProject.projectName && this.props.selectedProject.projectName.split('|')[0].toUpperCase()}
            </Typography>
					</Grid>
					
          <Grid item container sm={5} style={{marginTop:'1%'}}>
            <Grid item sm={4}></Grid>
            <Grid item sm={4} style={{paddingLeft:'5%'}}>
            <Tooltip title="Download source tokens for offline translation">
              <Button
                color="primary"
                variant="contained"
                size='small'
                disabled={!this.state.bkvalue}
                onClick ={this.clickdownload}>
                <span style={{fontSize:'78%'}}>Download Tokens</span>
              </Button>
              </Tooltip>
            </Grid>
            <Grid item sm={4} >
              <label tmlFor="upload-photo">
                <input
                  style={{ display: 'none' }}
                  id="upload-photo"
                  name="upload-photo"
                  type="file"
                  onChange={this.clickupload}
                />
                <Tooltip title="Upload translated tokens">
                <Button
                  color="primary"
                  variant="contained"
                  size='small'
                  disabled={!this.state.bkvalue}
                  component="span"
                >{this.state.loading && <CircleLoader />}
                  <span style={{fontSize:'78%'}}>Upload Tokens</span>
                </Button>
                </Tooltip>
              </label>
            </Grid>

            {/* <Grid item sm={3}>
              <Tooltip title="Download the target draft">
                <Button
                  color="primary"
                  variant="contained"
                  size='small'
                  disabled={!this.state.bkvalue}
                >
                <span style={{fontSize:'76%'}}>Download Draft</span>
                </Button>
              </Tooltip>
            </Grid> */}
          </Grid>
        
     
          <Grid item sm={12} style={{marginTop:'2%'}}>
            <Divider />
          </Grid>


          
          { this.state.bkvalue &&
            <Grid item container style={{paddingTop:'2%'}} spacing={0}>
            
            
            <Grid item sm={3} style={{paddingRight:'2%'}}>
              <Paper elevation='2'>
                  <Grid sm={12} style={{backgroundColor:'#f2eddf'}}>
                    <Typography component="h4" variant="h7" style={{textAlign:"center" ,padding:"4%"}}>
						          Source Tokens
					          </Typography>
                  </Grid>
              </Paper>
              <Grid item sm={12} style={{paddingLeft:'0%',paddingRight:'0%',paddingTop:'2%',paddingBottom:'2%'}}>
                <Paper elevation='1'>
              <TokenList/>
              </Paper>
              </Grid>
            </Grid>





            <Grid item sm={5}  style={{paddingRight:'2%'}}>
              <Paper elevation='2'>
              <Grid item sm={12} style={{backgroundColor:'#f2eddf'}}>
                <Typography component="h4" variant="h7" style={{textAlign:"center" ,padding:"2%"}}>
						      Token Translation
					      </Typography>
              </Grid>
              </Paper>
              
              <Grid item sm={12} style={{paddingLeft:'0%',paddingRight:'0%',paddingTop:'2%',paddingBottom:'2%'}}>
                <Paper elevation='1'>
                  {/* <Typography component="h4" variant="h7" style={{textAlign:"left" ,paddingLeft:"3%", paddingBottom:'1%',paddingTop:'1%'}}>
						        Update Selected Token
					        </Typography> */}
                  <UpdateTokens />
                </Paper>
              </Grid>
              
            </Grid>



            <Grid item sm={4} style={{paddingRight:'2%'}}>
              <Paper elevation='2'>
                <Grid item sm={12} style={{backgroundColor:'#f2eddf'}}>
                  <Typography component="h4" variant="h7" style={{textAlign:"center" ,padding:"3%"}}>
						        References
					        </Typography>
                </Grid>
              </Paper>
              <Grid item sm={12} style={{paddingLeft:'0%',paddingRight:'0%',paddingTop:'2%',paddingBottom:'2%'}}>
                <Paper elevation='1'>
                
                
{/*                 
                
                
                
                <Grid style={{paddingBottom:"1%"}}>
                  <Typography component="h4" variant="h7" style={{textAlign:"left" ,padding:"2%"}}>
                    Token Meaning
					        </Typography>
                  <Grid item sm={12}>
                    <p style={{margin:'0%', paddingRight:'3%', paddingLeft:'3%',paddingBottom:'1%', fontSize:"85%", color:'#b1b2b3'}}> Check the word meaning and strong number details</p>
                  </Grid>
                  
                  <Grid item sm={12} style={{textAlign:'right', marginBottom:'2%', paddingRight:'3%'}}>
                    <Button size="small" variant="contained" color="primary" ><span style={{fontSize:'78%'}}>Open</span></Button>
                  </Grid>
                  </Grid>
                  <Divider />


                  <Grid style={{paddingBottom:"1%"}}>
                  <Typography component="h4" variant="h7" style={{textAlign:"left" ,padding:"2%"}}>
                    Concordance
					        </Typography>
                  <Grid item sm={12}>
                    <p style={{margin:'0%', paddingRight:'3%', paddingLeft:'3%',paddingBottom:'1%', fontSize:"85%", color:'#b1b2b3'}}> Bible references in the selected book</p>
                  </Grid>
                  
                  <Grid item sm={12} style={{textAlign:'right', marginBottom:'2%', paddingRight:'3%'}}>
                    <Button size="small" variant="contained" color="primary" ><span style={{fontSize:'78%'}}>Open</span></Button>
                  </Grid>
                  </Grid>

                  <Divider />

                  <Grid style={{paddingBottom:"1%"}}>
                  <Typography component="h4" variant="h7" style={{textAlign:"left" ,padding:"2%"}}>
                    All Concordance
					        </Typography>
                  <Grid item sm={12}>
                    <p style={{margin:'0%', paddingRight:'3%', paddingLeft:'3%',paddingBottom:'1%', fontSize:"85%", color:'#b1b2b3'}}> Bible references from all books</p>
                  </Grid>
                  
                  <Grid item sm={12} style={{textAlign:'right', marginBottom:'2%', paddingRight:'3%'}}>
                    <Button size="small" variant="contained" color="primary" ><span style={{fontSize:'78%'}}>Open</span></Button>
                  </Grid>
                  </Grid>

                  <Divider />
                  


                  <Grid style={{paddingBottom:"1%"}}>
                  <Typography component="h4" variant="h7" style={{textAlign:"left" ,padding:"2%"}}>
                    Translation Notes
					        </Typography>
                  <Grid item sm={12}>
                    <p style={{margin:'0%', paddingRight:'3%', paddingLeft:'3%',paddingBottom:'1%', fontSize:"85%", color:'#b1b2b3'}}> Translation Notes from the bible</p>
                  </Grid>
                  
                  <Grid item sm={12} style={{textAlign:'right', marginBottom:'2%', paddingRight:'3%'}}>
                    <Button size="small" variant="contained" color="primary" ><span style={{fontSize:'78%'}}>Open</span></Button>
                  </Grid>
                  </Grid> */}










                  <Concordance />
                  {/* <TranslationsNotes /> */}
                  <TranslationsWords />
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        }
        


        </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  projects: state.project.projects,
  isFetching: state.project.isFetching,
  userProjects: state.project.userProjects,
  selectedProject: state.project.selectedProject,
  tokenList: state.project.tokenList,
  selectedToken: state.project.selectedToken,
  translation: state.project.translation,
  senses: state.project.senses
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

// export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(HomePage))
export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(withRouter(HomePage));
