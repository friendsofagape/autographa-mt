import React from "react";
import Button from "@material-ui/core/Button";
import { Typography } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import LinearProgress from '@material-ui/core/LinearProgress';
import DataTable from 'react-data-table-component';

import Box from '@material-ui/core/Box';
// import Progress from 'react-progressbar';

function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" value = {props.completedValue} style ={{width: '50px'}} />
      </Box>
      <Box minWidth={65}>
        <Typography variant="body10" color="textSecondary" style={{fontSize: 9}}>{`${
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
  
  export default function SimplePopover(props) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
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
          if (data.bookWiseData != null && Object.keys(data.bookWiseData).length !=0) {
            for (var j in Object.keys(data.bookWiseData)){
               matches.push(Object.values(data.bookWiseData)[j])
              }
            }
          setLastBookDetails(matches);                    //Data for the popup column
          setFirstBookLength(matches.length)              //Data for the text on the button for popup        
        }
      );  
    }, []);

    const columns = [                                     //columns for the popup
      {
        name: 'Book Name',
        selector: 'bookName',
        sortable: true,
      }, 
      {
        name: 'Token Translation Progress',
        sortable: true,
        cell: row => 
        <div className = {classes.fullWidth}>
        <LinearProgressWithLabel value={row.allTokensCount} translatedValue = {row.translatedTokensCount} completedValue ={row.completed}/>
        </div>
      },
      {
        name: 'Draft Progress',                 
        sortable: true,
        cell: row => <React.Fragment >{`${row.completed}%`}</React.Fragment>,
      }
      
    ];

  return (
    <div>                                                 {/*Popup of the Total Source Books */}
      <Button  aria-describedby={id} 
        color="primary" 
        size="small" 
        onClick={handleClick}>
       {FirstBookLength}▼
      </Button>
        {LastBookDetails !== null &&                
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        style={{height: 300}}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
      <DataTable
        title="Book Wise Data"
        columns={columns}
        data={LastBookDetails}             
      /> 
      </Popover>}
    </div>
  );
}

