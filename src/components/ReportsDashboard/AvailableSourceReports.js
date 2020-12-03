import React from "react";
import Button from "@material-ui/core/Button";
import { Typography } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import LinearProgress from '@material-ui/core/LinearProgress';
import DataTable from 'react-data-table-component';
import CircularProgress from '@material-ui/core/CircularProgress';

import Box from '@material-ui/core/Box';
// import Progress from 'react-progressbar';

function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" value = {props.completedValue} style ={{width: '50px'}} />
      </Box>
      <Box minWidth={65}>
        <Typography variant="body2" color="textSecondary" style={{fontSize: 9}}>{`${
          props.translatedValue} / ${props.value}`}</Typography>
      </Box>
    </Box>
  );
}

const useStyles = makeStyles((theme) =>
  createStyles({
    fullWidth: {
      width: "100%"
    },
    disabled: {
      color: "lightgrey"
    },
    root: {
      width: 280,
      overflow: "auto",
      padding: theme.spacing(2),
    }
  }),
);
  
  export default function AvailableSourceReport(props) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [newTestmentBooks, setNewTestmentBooks] = React.useState(null);
    const [oldTestmentBooks, setOldTestmentBooks] = React.useState(null);
    const [FirstBookLength, setFirstBookLength] = React.useState(null);
    const [LastBookDetails, setLastBookDetails] = React.useState(null);
  
    const handleClick = (event) => {            {/*To open the popup*/}
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {                 {/*To close the popup*/}
      setAnchorEl(null);
    };
  
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    React.useEffect(() => {                     {/*fetching statistics data for the popup*/}
      fetch("https://stagingapi.autographamt.com/v1/autographamt/statistics/projects/" + props.projectId)   //popup
        .then(results => results.json())    
        .then(data => {
          let matches = [];
          const bibleBookOldTestments = ["gen", "exo", "lev", "num", "deu", "jos", "jdg", "rut", "1sa", "2sa",                      
            "1ki", "2ki", "1ch", "2ch", "ezr", "neh", "est", "job", "psa", "pro", "ecc", "sng", 
            "isa", "jer", "lam", "ezk", "dan", "hos", "jol", "amo", "oba", "jon", "mic", "nam", "hab",
            "zep", "hag", "zec", "mal"]
            const bibleBookNewTestments = ["mat", "mrk", "luk", "jhn", "act", "rom", "1co", "2co", "gal",
            "eph", "php", "col", "1th", "2th", "1ti", "2ti", "tit", "phm", "heb", "jas", "1pe", "2pe", "1jn", 
            "2jn", "3jn", "jud", "rev"]
            let oldBooks = [];
            let newBooks = [];
          if (data.bookWiseData != null && Object.keys(data.bookWiseData).length !=0) {
            for (let book of bibleBookOldTestments){                                        //for order objects and also adding three code book name to the object
              let booksKey = data.bookWiseData[book]
              oldBooks.push(booksKey);
            }
            setOldTestmentBooks(oldBooks)                 //Data for the popup column
            for (let book of bibleBookNewTestments){                                        //for order objects and also adding three code book name to the object
              let booksKey = data.bookWiseData[book]
              newBooks.push(booksKey);
            }
            setNewTestmentBooks(newBooks)                  //Data for the popup column
            for (var j in Object.keys(data.bookWiseData)){
               matches.push(Object.values(data.bookWiseData)[j])
              }
            }
          setFirstBookLength(matches.length)              //Data for the text on the button for popup        
        }
      );  
    }, []);

    const columns = [                                     //columns for the popup
      {
        name: 'BOOK NAME',
        selector: 'bookCode',
        sortable: true,
        cell: (row) => (<React.Fragment >{`${row.bookName.toUpperCase()}`}</React.Fragment>)
      }, 
      {
        name: 'TOKEN PROGRESS',
        sortable: true,
        cell: row => 
        <div className = {classes.fullWidth}>
        <LinearProgressWithLabel value={row.allTokensCount} translatedValue = {row.translatedTokensCount} completedValue ={row.completed}/>
        </div>
      },
      {
        name: 'DRAFT PROGRESS',                 
        sortable: true,
        cell: row => <React.Fragment >{`${row.completed}%`}</React.Fragment>,
      }
      
    ];

  return (
    <div>
      {FirstBookLength ? (<Button  aria-describedby={id} 
        size="small"
        variant="contained"
        style={{ fontSize: "80%", backgroundColor: "#21b6ae" }}
        onClick={handleClick}> {FirstBookLength}▼
       
      </Button>) : (<Button  aria-describedby={id} 
        size="small"
        disabled
        variant="contained"
        style={{ fontSize: "80%", backgroundColor: "#21b6ae" }}
        onClick={handleClick}> 
        <CircularProgress className={classes.circularProgress} size={20}/>
        Loading
      </Button>
      
      )}                                                 {/*Popup of the Total Source Books */}
      
        {oldTestmentBooks !== null && newTestmentBooks !== null &&               
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        // style={{height: 500, width:'100%'}}
        PaperProps={{
          style: { width: '35%', height:'70%'},
        }}

      >
      <DataTable
        title={<span style={{fontSize:'80%', fontWeight:'bold'}}>OLD TESTMENT</span>}
        columns={columns}
        data={oldTestmentBooks}             
      />
      <DataTable
        title={<span style={{fontSize:'80%', fontWeight:'bold'}}>NEW TESTMENT</span>}
        columns={columns}
        data={newTestmentBooks}             
      /> 
      </Popover>}
    </div>
  );
}

