import React, { Component } from 'react'
import {
    Grid,
    Paper,
    Button,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    Divider,

} from '@material-ui/core';
import Header from './Header';
import UploadTexts from './UploadTexts';
import apiUrl from './GlobalUrl';
import { withStyles } from '@material-ui/core/styles';
import ComponentHeading from './ComponentHeading';



const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    versionDisplay: {
      width: '98%',
      marginLeft: '1%',
      marginTop:'1%'
    },
    typeG: {
      backgroundColor: '#3e51b5',
      // backgroundColor:'#262f3d',
      color: 'white',
      padding: '10px 0px'
    },
});

class ViewSources extends Component {
    state = {
        biblesDetails:[],
        dialogOpen: false,
        sourceId: '',
    }

    closeDialog = () => {
        this.setState({dialogOpen: false})
    }

    async getBiblesData() {
        const data = await fetch(apiUrl + 'v1/bibles', {
            method: 'GET'
        })
        const biblesDetails = await data.json()
        this.setState({ biblesDetails })
    }

    componentDidMount(){
        this.getBiblesData()
    }


    handleSelect = (sourceId) => (e) => {
        console.log(sourceId)
        this.setState({dialogOpen: true, sourceId})
    }
    render() {
        const {classes} = this.props
        console.log(this.state)
        return (
            <Grid item xs={12} md={12} >
                <Header />
                <Paper >
                    <ComponentHeading  data={{ text: "View Sources", styleColor: '#2a2a2fbd' }} />
                    <Divider />
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="right">Version Name</TableCell>
                                <TableCell align="right">Version Code</TableCell>
                                <TableCell align="right">Version Long Name</TableCell>
                                <TableCell align="right">Updated Date</TableCell>
                                <TableCell align="right">Script</TableCell>
                                <TableCell align="right">Language Name</TableCell>
                                <TableCell align="right">Language Code</TableCell>
                                <TableCell align="right">Books</TableCell>
                                <TableCell align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.biblesDetails.map(row => (
                                <TableRow key={row.sourceId}>
                                    <TableCell align="right">{row.version.name}</TableCell>
                                    <TableCell align="right">{row.version.code}</TableCell>
                                    <TableCell align="right">{row.version.longName}</TableCell>
                                    <TableCell align="right">{row.updatedDate}</TableCell>
                                    <TableCell align="right">{row.script}</TableCell>
                                    <TableCell align="right">{row.language.name}</TableCell>
                                    <TableCell align="right">{row.language.code}</TableCell>
                                    <TableCell align="right">
                                        <Button size="small" variant="contained" color="primary" onClick={this.handleSelect(row.sourceId)}>Books</Button>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button size="small" variant="contained" color="primary" onClick={this.handleSelect(row.sourceId)}>Upload</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <UploadTexts sourceId={this.state.sourceId} dialogOpen={this.state.dialogOpen} close={this.closeDialog} />
                </Paper>
            </Grid>
        )
    }
}

export default  withStyles(styles)(ViewSources);