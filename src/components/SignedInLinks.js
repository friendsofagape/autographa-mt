import React, { Component } from "react";
import jwt_decode from "jwt-decode";
import { MenuItem, Grid, Popover } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { Link, NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { clearState } from "../store/actions/authActions";
import Avatar from "@material-ui/core/Avatar";

class SignedInLinks extends Component {
  state = {
    anchorEl: null,
  };

  logOut = () => {
    this.props.dispatch(clearState());
    localStorage.removeItem("accessToken");
    window.location = "/";
  };

  handleMenu = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  getMenuItems() {
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;
    return (
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={this.handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem>
          <Link
            style={{ color: "red", textDecoration: "none" }}
            to="/"
            onClick={this.logOut}
            className={this.props.classes.link}
          >
            Log Out
          </Link>
        </MenuItem>
      </Popover>
    );
  }

  avatarChange() {
    const { current_user } = this.props;
    if (current_user.role == "ad") {
      return <Avatar alt="A" src="../images/admin.jpg" />;
    }
    if (current_user.role == "m") {
      return <Avatar alt="T" src="../images/translator.png" />;
    }
    if (current_user.role == "sa") {
      return <Avatar alt="SA" src="../images/superadmin.jpg" />;
    }
  }

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    const isMenuOpen = Boolean(anchorEl);
    let tokenAliveFlag = false;
    let decoded;
    const { accessToken } = this.props;
    if (accessToken) {
      decoded = jwt_decode(accessToken);
      let currentDate = new Date().getTime();
      let expiry = decoded.exp * 1000;
      var firstName = decoded.firstName;
      var hours = (expiry - currentDate) / 36e5;
      if (hours > 0) {
        tokenAliveFlag = true;
      }
    }

    const { current_user } = this.props;
    return (
      <Grid>
        {current_user.firstName ? (
          <div>
            <label
              color="inherit"
              style={{ padding: "5px", paddingRight: "2%", color: "#e0ba1f" }}
            >
              Welcome,
              {" " +
                current_user.firstName.charAt(0).toUpperCase() +
                current_user.firstName.slice(1) +
                " " +
                current_user.lastName.charAt(0).toUpperCase() +
                current_user.lastName.slice(1)}
            </label>

            <IconButton
              aria-owns={isMenuOpen ? "material-appbar" : undefined}
              aria-haspopup="true"
              onClick={this.handleMenu}
              size="small"
              className={classes.link}
            >
              {this.avatarChange()}
            </IconButton>
            {this.getMenuItems()}
          </div>
        ) : (
          <Grid>
            <NavLink
              exact
              className="main-nav"
              activeClassName="main-nav-active"
              to="/signin"
              className={classes.link}
            >
              Sign In
            </NavLink>
            <NavLink
              exact
              className="main-nav"
              activeClassName="main-nav-active"
              style={{ paddingLeft: "2%", paddingRight: "1%" }}
              to="/signup"
              className={classes.link}
            >
              Sign Up
            </NavLink>
          </Grid>
        )}
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  current_user: state.auth.current_user,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(SignedInLinks);
