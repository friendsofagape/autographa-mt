import React from "react";
import Button from "@material-ui/core/Button";
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import { Link } from 'react-router-dom';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { setAccessToken, clearState } from '../store/actions/authActions';

 
  const useStyles = makeStyles((theme) =>
  createStyles({
    disabled: {
      color: "lightgrey"
    },
    root: {
      width:200,
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

   const logOut = () => {
        this.props.dispatch(clearState())
        // this.props.setAccessToken({accessToken: null})
        localStorage.removeItem('accessToken')
        window.location = "/"
    }

  return (
    <div>
            <div>
        
        <Button onClick={handleClick}>
        <AccountCircle />
        </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
      <Link style={{textDecoration:'none', color:'black'}} to="/" onClick={logOut} variant="contained" size="small" color="primary" /*className={this.props.classes.link}*/>Log Out</Link>
      {/* <Grid container className={classes.root} spacing={2}>
      {props.books.map(book=>{
        return <Grid item xs={3}>
        <Typography >{book} </Typography>
        </Grid>})}
        </Grid> */}
      </Popover>
            
            </div>
          
    </div>
  );
}