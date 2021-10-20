import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import './loader.css';

const styles = theme => ({
    root: {
        flexGrow: 1,
    }
});

class CircleLoader extends Component {
    render() {
        return (
            <div className="loading">Loading</div>
        )
    }
}

export default withStyles(styles)(CircleLoader);