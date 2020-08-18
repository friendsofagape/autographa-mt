import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import './style.css';
// import Header from './components/Header';
// import HomePage from './components/HomePage';
// import { BrowserRouter, Route} from 'react-router-dom';
// import LoginPage from './components/LoginPage';
// import SignUp from './components/SignUp';
// import UploadSource from './components/UploadSource';
// import AdminPage from './components/AdminPage';
// import DownloadDraft from './components/DownloadDraft';



const styles = theme => ({
    root: {
      flexGrow: 1,
    },
    grow: {
      flexGrow: 1,
    },
    body: {
      backgroundColor: 'black'
    },
    h1: {
      // padding: '10px 0px 10px 10px',
      // margin: '0px',
      // textAlign: 'left',
      // color: '#fff',
      backgroundColor: 'black'
  
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    inputField:{
      width:'90%',
      marginLeft:'10px'
    },
    textDisplay: {
      padding: theme.spacing(),
      color: theme.palette.text.secondary,
      // marginBottom: '10px',
      height: 165,
      // width:'90%',
      overflow: 'auto',
      textAlign: 'justify',
      lineHeight: '20px',
      // marginTop: '20px',
      // marginLeft: '20px',
      // marginRight: '10px'
    },
    tokenList: {
      textAlign: 'center',
      color: theme.palette.text.secondary,
      // marginTop: '20px',
      // marginLeft: '20px',
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
      // width: 500,
      backgroundColor: '#fff',
    },
    containerGrid:{
      width:'97%',
      marginLeft:'2%',
      marginRight:'2%',
      border:'1px solid #3e51b5',
      boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
      height:'100%'
    },
    selectButtonPaper: {
      padding: theme.spacing(),
      textAlign: 'center',
      color: theme.palette.text.secondary,
      marginLeft: '20px',
      marginTop: '10%',
      marginBottom: '10px'
    },
    button:{
      marginLeft:'150px',
      marginTop:'20px'
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
      padding: theme.spacing(),
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
      marginBottom:'5px'
    },
    highlightToken: {
      color: 'blue',
      backgroundColor: 'yellow'
    },
    loginPage:{
      marginTop:'5%'
    },
    forgot:{
      cursor:'pointer',
    },
    versionUpdate:{
      // padding:'5px',
      width:'95%',
      marginLeft:'10px',
      marginRight:'10px',
      marginTop:'10px',
      // backgroundColor:'#3d6b7d'
    },
    versionDisplay:{
      // padding:'5px',
      width:'100%',
      // marginLeft:'10px',
      // marginRight:'10px',
      marginTop:'10px'
    },
    versionTextField:{
      padding:'5px'
    },
    uploadLabel:{
      border: '1px solid black', 
      padding: '10px'
    },
    uploadGrid:{
      marginTop:'20px',
      marginLeft:'130px'
    },
    typeG:{
      backgroundColor: '#3e51b5',
      color:'white',
      padding:'10px 0px'
    },
    form:{
      // backgroundColor:'blue',
      padding:'0px 5px'
    },
    input:{
      color:'#fff',
    },
    buttonGrid:{
      padding:'10px 20%',
    },
    checkBox:{
      position:'right'
    },
    translationSelectionPane:{
      marginLeft:'5%',
      marginTop:'10px',
      marginBottom:'10px'
    },
    selectionGrid:{
      marginLeft:'4%',
      marginTop:'1%'
    }
  });


export default styles






{/* <Grid container className={classes.root} spacing={2}>
      {bibleBookNames.map(book=>{
        const bookClass = props.books.includes(book)? " ":classes.disabled;
        return <Grid item xs={2}>
        <Typography className={bookClass}>{book} </Typography>
        </Grid>})}
        </Grid> 
      const bibleBookNames = ["gen", "exo", "lev", "num", "deu", "jos", "jdg", "rut", "1sa", "2sa", 
    "1ki", "2ki", "1ch", "2ch", "ezr", "neh", "est", "job", "psa", "pro", "ecc", "sng", 
    "isa", "jer", "lam", "ezk", "dan", "hos", "jol", "amo", "oba", "jon", "mic", "nam", "hab",
     "zep", "hag", "zec", "mal", "mat", "mrk", "luk", "jhn", "act", "rom", "1co", "2co", "gal",
      "eph", "php", "col", "1th", "2th", "1ti", "2ti", "tit", "phm", "heb", "jas", "1pe", "2pe", "1jn", "2jn", "3jn", "jud", "rev"]
      */}