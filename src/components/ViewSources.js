import React, { Component } from 'react'
import {
    Grid,
    Paper,
    TextField,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    TableFooter,
    TablePagination,
    Button,
    Divider,
    Typography

} from '@material-ui/core';
import Header from './Header';

export default class ViewSources extends Component {
    state = {
        versionDetails:[]
    }

    async getVersionData() {
        const data = await fetch('http://localhost:8000/v1/versiondetails', {
            method: 'GET'
        })
        const versionDetails = await data.json()
        this.setState({ versionDetails })
    }

    componentDidMount(){
        this.getVersionData()
    }

    render() {
        const {classes} = this.props
        return (
            <Grid item xs={12} md={12}>
                <Header classes={classes} />
                <Paper className={classes.versionDisplay}>

                    {/* <br /> */}
                    <Typography variant="h5" align="center" className={classes.typeG}>
                        View Sources
                </Typography>
                    {/* <br /> */}
                    <Divider />
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="right">Version Content Description</TableCell>
                                <TableCell align="right">Version Content Code</TableCell>
                                <TableCell align="right">Year</TableCell>
                                <TableCell align="right">License</TableCell>
                                <TableCell align="right">Revision</TableCell>
                                <TableCell align="right">Content Type</TableCell>
                                <TableCell align="right">Language</TableCell>
                                {/* <TableCell align="right">Upload</TableCell> */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.versionDetails.map(row => (
                                <TableRow key={row.versionid}>
                                    <TableCell align="right">{row.versionContentDescription}</TableCell>
                                    <TableCell align="right">{row.versionContentCode}</TableCell>
                                    <TableCell align="right">{row.year}</TableCell>
                                    <TableCell align="right">{row.license}</TableCell>
                                    <TableCell align="right">{row.revision}</TableCell>
                                    <TableCell align="right">{row.contentType}</TableCell>
                                    <TableCell align="right">{row.languageName}</TableCell>
                                    {/* <Button variant="raised" color="primary">Upload Books</Button> */}
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    colSpan={1}
                                    count={3}
                                    rowsPerPage={5}
                                    page={''}
                                    SelectProps={{
                                        native: true,
                                    }}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </Paper>
            </Grid>
        )
    }
}
