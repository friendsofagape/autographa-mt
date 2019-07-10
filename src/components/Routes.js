import React, { Component } from 'react'
import jwt_decode from 'jwt-decode';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import LoginPage from './LoginPage';
import SignUp from './SignUp';
import UploadSource from './UploadSource';
import AdminPage from './Administration/AdminPage'
import DownloadDraft from './DownloadDraft';
import HomePage from './HomePage';
import ViewSources from './ViewSources';
import OrganisationRequest from './Assignments/OrganisationRequest';
import UserDashboard from './Users/UserDashboard';

let decoded;
var accessToken = localStorage.getItem('access_token')
let tokenAliveFlag = false
// if(accessToken){
//     decoded = jwt_decode(accessToken)
// }
if (accessToken) {
    decoded = jwt_decode(accessToken)
    let currentDate = new Date().getTime()
    let expiry = decoded.exp * 1000
    console.log(currentDate, expiry)
    console.log((expiry - currentDate) / 36e5)
    console.log(Math.abs(expiry - currentDate))
    // var hours = Math.abs(expiry - currentDate) / 36e5
    var hours = (expiry - currentDate) / 36e5
    if(hours > 0){
        console.log(hours)
        console.log("logged in")
        // this.setState({redirect:true})
        tokenAliveFlag = true
    }else{
        console.log("logged out")
    }
}

export default class Routes extends Component {
    state = {
        redirect:false
    }

    updateRedirect = () => {
        const {redirect} = this.state
        if(!redirect){
            this.setState({redirect:true})
        }
    }
    render() {
        const { classes } = this.props
        console.log("Routes Page", this.state)
        return (
            <BrowserRouter>
                {(accessToken && decoded.role === 'sa' && tokenAliveFlag) ? (
                    <Switch>
                        <Route exact path="/" component={() => <LoginPage classes={classes} />} />
                        <Route path="/signin" component={() => <LoginPage classes={classes} />} />
                        <Route path="/signup" component={() => <SignUp classes={classes} />} />
                        <Route path="/homepage" component={() => <HomePage classes={classes} />} />
                        <Route path="/upload" component={() => <UploadSource classes={classes} />} />
                        <Route path="/assignment" component={() => <AdminPage classes={classes} />} />
                        <Route path="/download" component={() => <DownloadDraft classes={classes} />} />
                        <Route path="/viewsources" component={() => <ViewSources classes={classes} />} />
                        <Route path="/createorganisation" component={() => <OrganisationRequest classes={classes} />} />
                        {/* <Route path="/createprojects" component={() => <OrganisationRequest classes={classes} />} /> */}
                    </Switch>
                ) : (
                    (accessToken && decoded.role === 'ad' && tokenAliveFlag) ? (
                        <Switch>
                            <Route exact path="/" component={() => <LoginPage classes={classes} />} />
                            <Route path="/signin" component={() => <LoginPage classes={classes} />} />
                            <Route path="/signup" component={() => <SignUp classes={classes} />} />
                            <Route path="/homepage" component={() => <HomePage classes={classes} />} />
                            <Route path="/dashboard" component={() => <AdminPage classes={classes} />} />
                            <Route path="/upload" component={() => <UploadSource classes={classes} />} />
                            <Route path="/download" component={() => <DownloadDraft classes={classes} />} />
                            <Route path="/viewsources" component={() => <ViewSources classes={classes} />} />
                        </Switch>
                    ) : (
                        (accessToken && decoded.role === 'm' && tokenAliveFlag) ? (
                            <Switch>
                            <Route exact path="/" component={() => <LoginPage classes={classes} />} />
                            <Route path="/signin" component={() => <LoginPage classes={classes} />} />
                            <Route path="/signup" component={() => <SignUp classes={classes} />} />
                            <Route path="/homepage" component={() => <HomePage classes={classes} />} />
                            <Route path="/download" component={() => <DownloadDraft classes={classes} />} />
                            <Route path="/viewsources" component={() => <ViewSources classes={classes} />} />
                            <Route path="/dashboard" component={() => <UserDashboard  />} />
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
