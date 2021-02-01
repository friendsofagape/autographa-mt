import React from "react";
import Button from "@material-ui/core/Button";
import { Grid, Typography } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
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
  const [BookDetails, setBookDetails] = React.useState(null);
  const [newTestmentBooks, setNewTestmentBooks] = React.useState(null);
  const [oldTestmentBooks, setOldTestmentBooks] = React.useState(null);
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
          let matches = [];
          if (
            data.bookWiseData != null &&
            Object.keys(data.bookWiseData).length != 0
          ) {
            const bibleBookOldTestments = ["gen", "exo", "lev", "num", "deu", "jos", "jdg", "rut", "1sa", "2sa",                      
            "1ki", "2ki", "1ch", "2ch", "ezr", "neh", "est", "job", "psa", "pro", "ecc", "sng", 
            "isa", "jer", "lam", "ezk", "dan", "hos", "jol", "amo", "oba", "jon", "mic", "nam", "hab",
            "zep", "hag", "zec", "mal"]
            const bibleBookNewTestments = ["mat", "mrk", "luk", "jhn", "act", "rom", "1co", "2co", "gal",
            "eph", "php", "col", "1th", "2th", "1ti", "2ti", "tit", "phm", "heb", "jas", "1pe", "2pe", "1jn", 
            "2jn", "3jn", "jud", "rev"]
            let oldTestments = [];
            bibleBookOldTestments.map((book)=>{                                                                          //map function to push old testament books in order
            return props.projectBooks.includes(book)? oldTestments.push(book): null
            })
            let newTestments = [];
            bibleBookNewTestments.map((book)=>{                                                                          //map function to push new testament books in order
            return props.projectBooks.includes(book)? newTestments.push(book): null
            })
            let oldBooks = []
            for (let book of oldTestments){                                                                              //for order objects and also adding three code book name to the object
              let booksKey = data.bookWiseData[book]
              oldBooks.push(booksKey);
            }
            setOldTestmentBooks(oldBooks)
            let newBooks = []
            for(let book of newTestments){                                                                               //for order objects and also adding three code book name to the object
              let booksKey = data.bookWiseData[book]
              newBooks.push(booksKey);
            }
            setNewTestmentBooks(newBooks)
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

  const columns = [
    {
      name: <span style={{fontSize:'90%', fontWeight: 'bold'}}>BOOK NAME</span>,
      selector: "bookCode",
      sortable: true,
      cell: (row) => (<React.Fragment >{`${row.bookName.toUpperCase()}`}</React.Fragment>)
    },
    {
      name: <span style={{fontSize:'90%', fontWeight: 'bold'}}>TOKEN TRANSLATION PROGRESS</span>,
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
      name: <span style={{fontSize:'90%'}}>DRAFT PROGRESS</span>,
      selector: "completed",
      sortable:true,
      cell: (row) => <React.Fragment>
      {`${row.completed}%`}</React.Fragment>,
    },
  ];

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
      <Dialog
        open={open}
        onClose={handleCloses}
        scroll={scroll}
        fullWidth={true} 
        maxWidth = {'md'}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
          <Grid container>
            <Grid item sm={6} style={{fontSize:'80%', fontWeight:'bold'}}>
            Bookwise Translation Progress 
            </Grid>
            <Grid item sm={6} style={{fontSize:'80%', fontWeight:"bold", textAlign:"right"}}>
              {"Books Assigned  -  " + props.bookCount}
            </Grid>
          </Grid>
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
              <div style={{ height: 400, width: '100%' }}>
              {oldTestmentBooks != null && (
                <DataTable
                  title={<span style={{fontSize:'70%', fontWeight:'bold'}}>OLD TESTMENT</span>}
                  columns={columns}
                  data={oldTestmentBooks}
                />
                )}
              {newTestmentBooks != null && (
                <DataTable
                  title={<span style={{fontSize:'70%', fontWeight:'bold'}}>NEW TESTMENT</span>}
                  columns={columns}
                  data={newTestmentBooks}
                />
               )}
              </div>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloses} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
