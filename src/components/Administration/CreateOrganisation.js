import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

class CreateOrganisation extends Component {
  render() {
    const { classes, open, close } = this.props;
    return (
      <Dialog
        onClose={close}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth={true}
        maxWidth={"sm"}
      >
        <DialogTitle id="customized-dialog-title" onClose={close}>
          <Typography variant="h6">Create organisation</Typography>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={close}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers></DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={close}
            color="secondary"
            size={"small"}
            variant={"contained"}
          >
            Close
          </Button>
          <Button
            autoFocus
            onClick={close}
            color="primary"
            size={"small"}
            variant={"contained"}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = (state) => ({
  organisations: state.organisation.organisations,
  isFetching: state.organisation.isFetching,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(CreateOrganisation));
