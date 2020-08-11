import React from "react";
import Button from "@material-ui/core/Button";
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';

 
  const useStyles = makeStyles((theme) =>
  createStyles({
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
  
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;


  return (
    <div>
            <div>
        
        <Button disabled= {props.books ==0 ? true : false} aria-describedby={id} variant="contained" color="primary" size="small" onClick={handleClick}>
        {props.books.length}&nbsp;▼
        </Button>
      <Popover
        id={id}
        open={open}
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
    
      <Grid container className={classes.root} spacing={2}>
      {props.books.map(book=>{
        return <Grid item xs={2}>
        <Typography >{book} </Typography>
        </Grid>})}
        </Grid>
      </Popover>
            
            </div>
          
    </div>
  );
}

