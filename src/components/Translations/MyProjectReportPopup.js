import React from "react";
import Button from "@material-ui/core/Button";
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import LinearProgress, { LinearProgressProps }from '@material-ui/core/LinearProgress';
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
      width: "100%",
    },
    listItem:{
      maxWidth:150,
      minWidth:100,
      padding: theme.spacing(2)
  },
    disabled: {
      color: "lightgrey"
    },
    root: {
      width: 280,
      overflow: "auto",
      padding: theme.spacing(2),
    },
   
  }),
);
  
  export default function SimplePopover(props) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [BookDetails, setBookDetails] = React.useState(null);
  
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    React.useEffect(() => {
      fetch("https://stagingapi.autographamt.com/v1/autographamt/statistics/projects/" + props.projectWiseId)
        .then(results => results.json())
        .then(data => {       
          // console.log('PROJECTBOOKWISEDATA----',data)                               
          let matches = [];
          if (data.bookWiseData != null && Object.keys(data.bookWiseData).length !=0) {
            for (var j in props.projectBooks) {  
              // console.log('???????????????????????????????',data)
                  for(var i in Object.keys(data.bookWiseData)){
                if (Object.keys(data.bookWiseData)[i] == props.projectBooks[j]){
              matches.push(Object.values(data.bookWiseData)[i])}
              }
            }
          }
          setBookDetails(matches);
        });  
    }, []);

    const columns = [
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
    <div>
    <div>
      <Button  aria-describedby={id} 
        color="primary" 
        size="small" 
        onClick={handleClick}>
       {props.projectBooks.length} &nbsp;▼ 
      </Button>
        {BookDetails !== null && 
      <Popover
        id={id}
        open={open}
        style={{height: 300}}
        anchorEl={anchorEl}
        onClose={handleClose}
        
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
        title="Book Progress"
        columns={columns}
        data={BookDetails}
      /> 
      </Popover>}
        </div>
          {/* <LinearProgress variant="determinate" style ={{width: '62px'}} value={FirstBookLength} />   */}
    </div>
  );
}

