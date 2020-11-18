import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import { Paper } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Typography } from "@material-ui/core";
import { connect } from "react-redux";
import apiUrl from "../GlobalUrl";
import { getAssignedUsers, fetchUsers } from "../../store/actions/userActions";
import compose from "recompose/compose";
import { withRouter } from "react-router-dom";
import CircleLoader from "../loaders/CircleLoader";
import swal from "sweetalert";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

import DataTable from "react-data-table-component";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

// const styles = (theme) => ({
// root: {
// 	flexGrow: 1,
//     padding: theme.spacing(8),
//     paddingLeft:'4%',
//     paddingRight:'4%'
// },
// disabled: {
// 	color: "lightgrey"
//   },
// toolbar: theme.mixins.toolbar,
// gridSize: {
// 	height: 340,
// 	width: 300,
// },
// listItem: {
// 	border: '1px solid #eee',
// },
// checkBox: {
// 	border: '1px solid #eee',
// },
// statisticsPane: {
// 	minHeight: '50px',
// },
// bookCard: {
// 	width: '400px',
// },
// });

function LinearProgressWithLabel(props) {
  //This function is to get linear progress bar
  return (
    <Box display="flex" alignItems="center">
      <Box
        width="100%"
        mr={2}
        style={{ width: "30%", marginRight: "0px" }}
        alignItems="right"
      >
        <LinearProgress
          variant="determinate"
          value={props.completedValue}
          style={{ width: "50px" }}
        />
      </Box>
      <Box minWidth={65} style={{ align: "top" }}>
        <Typography variant="h2" color="textSecondary" style={{ fontSize: 12 }}>
          {`${props.translatedValue} / ${props.value}`}
        </Typography>
      </Box>
    </Box>
  );
}

// const useStyles = makeStyles((theme) => createStyles({}));

const accessToken = localStorage.getItem("accessToken");

export default function UsersReports(props) {
  const [assignedUsers, setAssignedUsers] = React.useState([]);
  const [userId, setUserId] = React.useState("");
  const [projectId, setProjectId] = React.useState("");
  const [oldBooksLength, setOldBooksLength] = React.useState(null);
  const [newBooksLength, setNewBooksLength] = React.useState(null);
  const [bookList, setBookList] = React.useState({});

  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState("paper");
  const [loading, setLoading] = React.useState(false);

  const [proId, setProId] = React.useState(0);

  const stoploading = () => {
    setLoading(false);
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

  const getResults = async () => {
    const projectId = props.value.split("/")[0];
    // statstic page
    const data = await fetch(
      apiUrl + "v1/autographamt/statistics/projects/" + projectId
    );
    const response = await data.json();
    console.log('111111', response);
    if (data.status != 200) {
      swal({
        title: "Statistics",
        text: "Unable to fetch statistics information: " + response.message,
        icon: "error",
      });
    } else {
      setBookList(response);
    }
    //  user information
    const data1 = await fetch(
      apiUrl + "v1/autographamt/projects/assignments/" + projectId,
      {
        method: "GET",
        headers: {
          Authorization: "bearer " + accessToken,
        },
      }
    );
    const response1 = await data1.json();
    console.log("44444", response1);
    if (data1.status != 200) {
      swal({
        title: "Statistics",
        text: "Unable to fetch User information: " + response.message,
        icon: "error",
      });
    } else {
      setAssignedUsers(response1);
    }
    setProId(projectId);
    stoploading();
  };

  const handleClickOpen = (scrollType) => () => {
    const projectIdCheck = props.value.split("/")[0];
    console.log("nnnnnnn",(proId) ,(projectIdCheck))

    if (proId != projectIdCheck) {
      console.log("dddd")
      setLoading(true);
      setOpen(true);
      setScroll(scrollType);
      getResults();
    } else {
      setOpen(true);
    }
    
  };

   const displayOldBooks = () => {                                   //Function for old testment books along with the assigned users
      //This function is for the datas of assigned users
      const bookWiseDatas = bookList.bookWiseData;
      return assignedUsers.map((user, i) => {
        const { books } = user;
        const { userName, email, userId } = user.user;
        let matches = [];
        let oldBooks = []
        const bibleBookOldTestments = ["gen", "exo", "lev", "num", "deu", "jos", "jdg", "rut", "1sa", "2sa",                      
          "1ki", "2ki", "1ch", "2ch", "ezr", "neh", "est", "job", "psa", "pro", "ecc", "sng", 
          "isa", "jer", "lam", "ezk", "dan", "hos", "jol", "amo", "oba", "jon", "mic", "nam", "hab",
          "zep", "hag", "zec", "mal"]
          let oldTestments = [];
          bibleBookOldTestments.map((book)=>{                                                                          //map function to push old testment books in order
          return books.includes(book)? oldTestments.push(book): null
          })
        console.log("REPORTS AND DASHBOARD*****",oldTestments)
        if (bookWiseDatas != null) {
          for (let book of oldTestments) {
            let booksKey = bookList.bookWiseData[book]
            if (booksKey != null){
              booksKey.bookCode = book
            }
            oldBooks.push(booksKey);
          }
        }
        return oldBooks.map((matches, i) => {
          return (
            <TableRow key={i}>
              <TableCell align="left">{matches.bookCode.toUpperCase()}</TableCell>
              <TableCell align="center">{userName}</TableCell>
              <TableCell align="center">{email}</TableCell>
              <TableCell align="center" key={i}>
                <LinearProgressWithLabel
                  value={matches.allTokensCount}
                  translatedValue={matches.translatedTokensCount}
                  completedValue={matches.completed}
                />
              </TableCell>
              <TableCell align="center">{matches.completed}%</TableCell>
            </TableRow>
            
          );
        });
      });
    };

    const displayNewBooks = () => {                                      //Function for new testment books along with the assigned users
      const bookWiseDatas = bookList.bookWiseData;
      return assignedUsers.map((user, i) => {
        const { books } = user;
        const { userName, email, userId } = user.user;
        let matches = [];
        let newBooks = []
        const bibleBookNewTestments = ["mat", "mrk", "luk", "jhn", "act", "rom", "1co", "2co", "gal",
            "eph", "php", "col", "1th", "2th", "1ti", "2ti", "tit", "phm", "heb", "jas", "1pe", "2pe", "1jn", 
            "2jn", "3jn", "jud", "rev"]
          let newTestments = [];
          bibleBookNewTestments.map((book)=>{                                                                          //map function to push old testment books in order
          return books.includes(book)? newTestments.push(book): null
          })
        if (bookWiseDatas != null) {
          for (let book of newTestments) {
            let booksKey = bookList.bookWiseData[book]
            if (booksKey != null){
              booksKey.bookCode = book
            }
            newBooks.push(booksKey);
            }
          }
        return newBooks.map((matches, i) => {
          return (
            <TableRow key={i}>
              <TableCell align="left">{matches.bookCode.toUpperCase()}</TableCell>
              <TableCell align="center">{userName}</TableCell>
              <TableCell align="center">{email}</TableCell>
              <TableCell align="center" key={i}>
                <LinearProgressWithLabel
                  value={matches.allTokensCount}
                  translatedValue={matches.translatedTokensCount}
                  completedValue={matches.completed}
                />
              </TableCell>
              <TableCell align="center">{matches.completed}%</TableCell>
            </TableRow>
            
          );
        });
      });
    };

  const displayAssignedUsersNumber = () => {
   if (assignedUsers.length > 0) {
    let booksNumber = assignedUsers.map((user, i) => {
      const { books } = user;
      return books.length;
    });
    let assignedUsersSum = 0;
    const reducer = (a, c) => a + c;
    assignedUsersSum = booksNumber.reduce(reducer, 0);
    console.log("REPORTS AND DASHBOARD*****",booksNumber)
    return <span>{assignedUsersSum}</span>
    }
  }
  
    let projectName = props.value.split("/")[1].toUpperCase();

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
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullWidth={true} 
        maxWidth = {'md'}
      >
        <DialogTitle id="scroll-dialog-title">
          { projectName = props.value.split("/")[1].toUpperCase()} - 
          (Assigned Books Details) 
        </DialogTitle>

        <DialogContent dividers={scroll === "paper"} >
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            {loading ? <CircleLoader /> : ( 
             assignedUsers.length > 0 ? (
              <div>
              <Table>
             		<TableHead>
                <span style={{fontSize:'100%', fontWeight:'bold'}}>&nbsp;&nbsp;&nbsp;OLD TESTMENT</span>      
             			<TableRow>
             				<TableCell align="left"><h4>Book Name</h4></TableCell>{/*Heading for the old testment table*/}
             				<TableCell align="center"><h4>User Name</h4></TableCell>
             				<TableCell align="center"><h4>Email ID</h4></TableCell>
             				<TableCell align="left"><h4>Translation Progress</h4></TableCell>
             				<TableCell align="center"><h4>Draft Ready</h4></TableCell>
             			</TableRow>
             		</TableHead>
             	<TableBody >{displayOldBooks()}</TableBody>
             	</Table>
           
              <Table>
             		<TableHead>
                <h4></h4>
                <span style={{fontSize:'100%', fontWeight:'bold'}}>&nbsp;&nbsp;&nbsp;NEW TESTMENT</span> 
             			<TableRow>
             				<TableCell align="left"><h4>Book Name</h4></TableCell>{/*Heading for the old testment table*/}
             				<TableCell align="center"><h4>User Name</h4></TableCell>
             				<TableCell align="center"><h4>Email ID</h4></TableCell>
             				<TableCell align="left"><h4>Translation Progress</h4></TableCell>
             				<TableCell align="center"><h4>Draft Ready</h4></TableCell>
             			</TableRow>
             		</TableHead>
             	<TableBody >{displayNewBooks()}</TableBody>
             	</Table>
            </div>
             ) : (
               <div> Books are not assigned to Users</div>
             )

            )
            }
            
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
