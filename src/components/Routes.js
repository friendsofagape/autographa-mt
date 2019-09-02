import React, { Component } from 'react'
import jwt_decode from 'jwt-decode';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import LoginPage from './LoginPage';
import SignUp from './SignUp';
// import UploadSource from './UploadSource';
import AdminPage from './Administration/AdminPage'
import DownloadDraft from './DownloadDraft';
// import HomePage from './HomePage';
import ViewSources from './ViewSources';
// import OrganisationRequest from './Assignments/OrganisationRequest';
import UserDashboard from './Users/UserDashboard';

let decoded;
// let tokenAliveFlag = false
// if(accessToken){
//     decoded = jwt_decode(accessToken)
// }
// if (accessToken) {
//     decoded = jwt_decode(accessToken)
//     let currentDate = new Date().getTime()
//     let expiry = decoded.exp * 1000
//     console.log(currentDate, expiry)
//     console.log((expiry - currentDate) / 36e5)
//     console.log(Math.abs(expiry - currentDate))
//     // var hours = Math.abs(expiry - currentDate) / 36e5
//     var hours = (expiry - currentDate) / 36e5
//     if(hours > 0){
//         console.log(hours)
//         console.log("logged in")
//         // this.setState({redirect:true})
//         tokenAliveFlag = true
//     }else{
//         console.log("logged out")
//     }
// }

export default class Routes extends Component {
    state = {
        redirect:false,
        accessToken:"",
        decode:{},
        redirect:false
    }

    componentDidMount(){
        var accessToken = localStorage.getItem('accessToken')
        if(accessToken){
            this.setState({decoded : jwt_decode(accessToken)})
            this.setState({accessToken   });

        }
        console.log(this.state.accessToken);
        console.log("test");
    }
    updateRedirect(){
        this.setState({redirect:true})
    }

    updateRedirect = () => {
        const {redirect} = this.state
        if(!redirect){
            this.setState({redirect:true})
        }
    }
    render() {

    console.log("test123");
        const { classes } = this.props
        console.log("Routes Page", this.state)
        var {accessToken,decoded,redirect}=this.state;
        var tokenAliveFlag = true;
        return (
            <BrowserRouter>
                {(accessToken && decoded.role === 'sa' && tokenAliveFlag) ? (
                    <Switch>
                        <Route exact path="/" component={() => <LoginPage redirect={redirect} updateRedirect={this.updateRedirect} />} />
                        <Route path="/signin" component={() => <LoginPage redirect={redirect} updateRedirect={this.updateRedirect} />} />
                        <Route path="/signup" component={() => <SignUp />} />
                        <Route path="/dashboard" component={() => <AdminPage />} />
                        <Route path="/download" component={() => <DownloadDraft />} />
                        <Route path="/viewsources" component={() => <ViewSources />} />
                    </Switch>
                ) : (
                    (accessToken && decoded.role === 'ad' && tokenAliveFlag) ? (
                        <Switch>
                            <Route exact path="/" component={() => <LoginPage redirect={redirect} updateRedirect={this.updateRedirect} />} />
                            <Route path="/signin" component={() => <LoginPage redirect={redirect} updateRedirect={this.updateRedirect} />} />
                            <Route path="/signup" component={() => <SignUp />} />
                            <Route path="/dashboard" component={() => <AdminPage />} />
                            <Route path="/download" component={() => <DownloadDraft />} />
                            <Route path="/viewsources" component={() => <ViewSources  />} />
                        </Switch>
                    ) : (
                        (accessToken && decoded.role === 'm' && tokenAliveFlag) ? (
                            <Switch>
                            <Route exact path="/" component={() => <LoginPage  redirect={redirect} updateRedirect={this.updateRedirect} />} />
                            <Route path="/signin" component={() => <LoginPage redirect={redirect} updateRedirect={this.updateRedirect} />} />
                            <Route path="/signup" component={() => <SignUp />} />
                            <Route path="/download" component={() => <DownloadDraft classes={classes} />} />
                            <Route path="/viewsources" component={() => <ViewSources />} />
                            <Route path="/dashboard" component={() => <UserDashboard  />} />
                            </Switch>
                        ) : (
                        <Switch>
                            <Route exact path="/" component={() => <LoginPage  redirect={redirect} updateRedirect={this.updateRedirect} />} />
                            <Route path="/signin" component={() => <LoginPage  redirect={redirect} updateRedirect={this.updateRedirect} />} />
                            <Route path="/signup" component={() => <SignUp />} />
                        </Switch>
                        )
                    )
                )}
            </BrowserRouter>
        )
    }
}
