import React, { Component } from 'react'
import jwt_decode from 'jwt-decode';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import LoginPage from './LoginPage';
import SignUp from './SignUp';
import UploadSource from './UploadSource';
import AdminPage from './AdminPage'
import DownloadDraft from './DownloadDraft';
import HomePage from './HomePage';
import ViewSources from './ViewSources';

let decoded;
var accessToken = localStorage.getItem('access_token')
if(accessToken){
    decoded = jwt_decode(accessToken)
}

export default class Routes extends Component {

    render() {
        const { classes } = this.props
        return (
            <BrowserRouter>
                {(accessToken && decoded.role === 'sa') ? (
                    <Switch>
                        <Route exact path="/" component={() => <LoginPage classes={classes} />} />
                        <Route path="/signin" component={() => <LoginPage classes={classes} />} />
                        <Route path="/signup" component={() => <SignUp classes={classes} />} />
                        <Route path="/homepage" component={() => <HomePage classes={classes} />} />
                        <Route path="/upload" component={() => <UploadSource classes={classes} />} />
                        <Route path="/assignment" component={() => <AdminPage classes={classes} />} />
                        <Route path="/download" component={() => <DownloadDraft classes={classes} />} />
                        <Route path="/viewsources" component={() => <ViewSources classes={classes} />} />
                    </Switch>
                ) : (
                    (accessToken && decoded.role === 'ad') ? (
                        <Switch>
                            <Route exact path="/" component={() => <LoginPage classes={classes} />} />
                            <Route path="/signin" component={() => <LoginPage classes={classes} />} />
                            <Route path="/signup" component={() => <SignUp classes={classes} />} />
                            <Route path="/homepage" component={() => <HomePage classes={classes} />} />
                            <Route path="/upload" component={() => <UploadSource classes={classes} />} />
                            <Route path="/download" component={() => <DownloadDraft classes={classes} />} />
                        <Route path="/viewsources" component={() => <ViewSources classes={classes} />} />
                        </Switch>
                    ) : (
                        (accessToken && decoded.role === 'm') ? (
                            <Switch>
                            <Route exact path="/" component={() => <LoginPage classes={classes} />} />
                            <Route path="/signin" component={() => <LoginPage classes={classes} />} />
                            <Route path="/signup" component={() => <SignUp classes={classes} />} />
                            <Route path="/homepage" component={() => <HomePage classes={classes} />} />
                            <Route path="/download" component={() => <DownloadDraft classes={classes} />} />
                        <Route path="/viewsources" component={() => <ViewSources classes={classes} />} />
                            </Switch>
                        ) : (
                        <Switch>
                            <Route exact path="/" component={() => <LoginPage classes={classes} />} />
                            <Route path="/signin" component={() => <LoginPage classes={classes} />} />
                            <Route path="/signup" component={() => <SignUp classes={classes} />} />
                        </Switch>
                        )
                    )
                )}
            </BrowserRouter>
        )
    }
}
