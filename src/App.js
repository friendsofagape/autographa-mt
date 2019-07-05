import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import './components/css/style.css';
import Header from './components/Header';
import HomePage from './components/HomePage';
import { BrowserRouter, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignUp from './components/SignUp';
import UploadSource from './components/UploadSource';
import AdminPage from './components/Administration/AdminPage';
import DownloadDraft from './components/DownloadDraft';
import Routes from './components/Routes';
// import {Router} from 'react-router-dom'

const styles = theme => ({
  root: {
    display:'flex',
    flexGrow: 1,
    backgroundColor: '#f8f9fa'
  },
  grow: {
    flexGrow: 1,
  },
  body: {
    backgroundColor: 'black'
  },
  h1: {
    backgroundColor: 'black',
    // backgroundColor:'#262f3d'
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  inputField: {
    width: '90%',
    marginLeft: '10px'
  },
  textDisplay: {
    padding: theme.spacing.unit,
    color: theme.palette.text.secondary,
    backgroundColor: '#fff',
    height: 165,
    overflow: 'auto',
    textAlign: 'justify',
    lineHeight: '20px',
  },
  tokenList: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: 360,
    overflowX: 'hidden',
    overflowY: 'auto',
    backgroundColor: '#fff',
  },
  tokenUpdation: {
    color: theme.palette.text.secondary,
    marginTop: '20px',
    marginLeft: '20px',
    height: 343,
    backgroundColor: '#fff',
  },
  containerGrid: {
    width: '97%',
    marginLeft: '2%',
    marginRight: '2%',
    border: '1px solid #3e51b5',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
    height: '100%',
    backgroundColor: '#fff',
  },
  selectButtonPaper: {
    padding: theme.spacing.unit,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginLeft: '20px',
    marginTop: '10%',
    marginBottom: '10px'
  },
  button: {
    marginLeft: '150px',
    marginTop: '20px'
  },
  buttonText: {
    textTransform: 'none'
  },
  spanning: {
    color: 'blue'
  },
  mainGrid: {
    width: '100%',
    paddingTop: '0',
    marginTop: '0',
    height: 'auto',
  },
  selectTwo: {
    padding: theme.spacing.unit,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginLeft: '0px',
    position: 'fixed',
    width: '29%',
  },
  inputLabel: {
    padding: '2px',
    width: '20px',
    marginBottom: '10px',
    marginRight: '10%',
    backgroundColor: 'blue'
  },
  ul: {
    marginRight: '-10%',
    marginTop: '20%',
  },
  li: {
    width: '100%',
    float: 'left',
    listStyle: 'none',
    border: '1px solid grey',
    padding: '5px'
  },
  ulDiv: {
    overflow: 'auto',
    height: 100,
    borderBottom: '1px solid black'
  },
  selectMenu: {
    width: '120px',
  },
  selectMenu2: {
    width: '120px',
    marginBottom: '5px'
  },
  highlightToken: {
    color: 'blue',
    backgroundColor: 'yellow'
  },
  loginPage: {
    marginTop: '5%'
  },
  forgot: {
    cursor: 'pointer',
  },
  uploadPane:{
    marginTop:'4%',
    // padding:'10px',
    // border: '1px solid black#3e51b5',
    // boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
  },
  versionUpdate: {
    // padding:'5px',
    width: '95%',
    marginLeft: '10px',
    marginRight: '10px',
    marginTop: '10px',
    // backgroundColor:'#3d6b7d'
  },
  versionDisplay: {
    width: '98%',
    marginLeft: '1%',
    marginTop:'1%'
  },
  versionTextField: {
    padding: '5px'
  },
  uploadLabel: {
    border: '1px solid black',
    padding: '10px'
  },
  uploadGrid: {
    marginTop: '20px',
    marginLeft: '130px'
  },
  link: {
    margin: theme.spacing.unit,
  },
  typeG: {
    backgroundColor: '#3e51b5',
    // backgroundColor:'#262f3d',
    color: 'white',
    padding: '10px 0px'
  },
  form: {
    // backgroundColor:'blue',
    padding: '0px 5px'
  },
  input: {
    color: '#fff',
  },
  buttonGrid: {
    padding: '10px 20%',
  },
  checkBox: {
    position: 'right'
  },
  translationSelectionPane: {
    marginLeft: '5%',
    marginTop: '10px',
    marginBottom: '10px'
  },
  selectionGrid: {
    marginLeft: '4%',
    marginTop: '1%'
  }
});

function App(props) {
  const { classes } = props;
  return (
    // <BrowserRouter>
      <Grid container className={classes.root}>
        {/* <Grid item xs={12}>
          <Header classes={classes} />
        </Grid> */}
        {/* <Grid item xs={12} style={{ backgroundColor: '#fbfbfb' }}> */}
        {/* <Grid item xs={12} style={{ backgroundColor: '#f8f9fa' }}> */}
        
          <Routes classes={classes} />
        {/* </Grid> */}
      </Grid>
    // </BrowserRouter>
  );
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);