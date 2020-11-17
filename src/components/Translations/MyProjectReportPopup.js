import React from "react";
import Button from "@material-ui/core/Button";
import { Typography } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import LinearProgress, {
  LinearProgressProps,
} from "@material-ui/core/LinearProgress";
import DataTable from "react-data-table-component";
import Box from "@material-ui/core/Box";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import apiUrl from "../GlobalUrl";
import CircleLoader from "../loaders/CircleLoader";

function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box>
        <LinearProgress
          variant="determinate"
          value={props.completedValue}
          style={{ width: "50px" }}
        />
      </Box>
      <Box>
        <Typography
          variant="body10"
          color="textSecondary"
          style={{ fontSize: 9 }}
        >{`${props.translatedValue} / ${props.value}`}</Typography>
      </Box>
    </Box>
  );
}

const useStyles = makeStyles((theme) => createStyles({}));

export default function SimplePopover(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [BookDetails, setBookDetails] = React.useState(null);

  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState("paper");
  const [loading, setLoading] = React.useState(false);
  const [proId, setProId] = React.useState(0);

  const handleClickOpen = (scrollType) => () => {
    setLoading(true);
    setOpen(true);
    setScroll(scrollType);
    const stoploading = () => {
      setLoading(false);
    };

    if (proId != props.projectWiseId) {
      fetch(
        apiUrl + "/v1/autographamt/statistics/projects/" + props.projectWiseId
      )
        .then((results) => {
          stoploading();
          return results.json();
        })
        .then((data) => {
          console.log("eeeeeeeeeeeeeeee", data);
          let matches = [];
          if (
            data.bookWiseData != null &&
            Object.keys(data.bookWiseData).length != 0
          ) {
            for (var j in props.projectBooks) {
              // console.log('???????????????????????????????',data)
              for (var i in Object.keys(data.bookWiseData)) {
                if (
                  Object.keys(data.bookWiseData)[i] == props.projectBooks[j]
                ) {
                  matches.push(Object.values(data.bookWiseData)[i]);
                }
              }
            }
          }
          setBookDetails(matches);
          setProId(props.projectWiseId);
        });
    } else {
      stoploading();
    }
  };

  const handleCloses = () => {
    setOpen(false);
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const columns = [
    {
      name: "Book Name",
      selector: "bookName",
      sortable: true,
    },
    {
      name: "Token Translation Progress",
      sortable: true,
      cell: (row) => (
        <div className={classes.fullWidth}>
          <LinearProgressWithLabel
            value={row.allTokensCount}
            translatedValue={row.translatedTokensCount}
            completedValue={row.completed}
          />
        </div>
      ),
    },
    {
      name: "Draft Progress",
      sortable: true,
      cell: (row) => <React.Fragment>{`${row.completed}%`}</React.Fragment>,
    },
  ];
  console.log("oooooooooooooooooooooooooooooooooooo", BookDetails);
  return (
    <div>
      <Button
        onClick={handleClickOpen("paper")}
        size="small"
        variant="contained"
        style={{ fontSize: "80%", backgroundColor: "#21b6ae" }}
      >
        View
      </Button>
      {/* {loading && <CircleLoader />} */}

      <Dialog
        open={open}
        onClose={handleCloses}
        scroll={scroll}
        fullWidth={true} 
        maxWidth = {'sm'}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
          Bookwise Translation Progress
        </DialogTitle>

        <DialogContent dividers={scroll === "paper"}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            {loading ? (
              <CircleLoader />
            ) : (
              <div>
                {BookDetails != null && (
                  <DataTable
                    title={"Books Assigned  -  " + props.bookCount}
                    columns={columns}
                    data={BookDetails}
                  />
                )}
              </div>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloses} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
