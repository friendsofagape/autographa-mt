import React, { Component } from 'react'
import jwt_decode from 'jwt-decode';
import { Redirect, Route, Switch, BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import SignUp from './SignUp';
import AdminPage from './Administration/AdminPage'
import DownloadDraft from './DownloadDraft';
import ViewSources from './ViewSources';
import UserDashboard from './Users/UserDashboard';
import { connect } from 'react-redux';
import { setAccessToken } from '../store/actions/authActions';
import ListProjects from './Administration/ListProjects';
import Wrapper from './Wrapper';

export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props => localStorage.getItem('accessToken') 
        ? (
            <Component {...props} />
        ) 
        : (<Redirect to={{
            pathname: "/app",
            state: { from: props.location }
        }}
        />
            )
        }
    />
)

class Routes extends Component {
    state = {
        redirect: false,
        accessToken: "",
        decoded: {},
    }

    componentDidMount() {
        var accessToken = localStorage.getItem('accessToken')
        if (accessToken) {
            this.setState({ decoded: jwt_decode(accessToken) })
            this.setState({ accessToken });
            if (!this.props.accessToken) {
                this.props.setAccessToken({ accessToken })
                this.setState({ decoded: jwt_decode(accessToken) })
            }
            // this.props.setAccessToken({accessToken})
        }
    }
    render() {
        var { decoded } = this.state;
        const { classes, accessToken } = this.props
        var tokenAliveFlag = true;
        return (
            <BrowserRouter>
            <Switch>
                <Route path="/signin" component={() => <LoginPage />} />
                <Route path="/signup" component={() => <SignUp />} />
                <Route exact path="/" component={() => <HomePage />} />
                <PrivateRoute exact path="/app" component={() => <Wrapper />} />
                {/* <PrivateRoute path="/dashboard" component={() => <AdminPage />} /> */}
                {/* <PrivateRoute path="/download" component={() => <DownloadDraft />} /> */}
                {/* <PrivateRoute path="/viewsources" component={() => <ViewSources />} /> */}
                <PrivateRoute path="/app/projects" component={() => <ListProjects />} />
            </Switch>
         </BrowserRouter>
            //     {(decoded && accessToken && decoded.role === 'sa' && tokenAliveFlag) ? (
            //         <Switch>
            //             <Route exact path="/" component={() => <HomePage />} />
            //             <Route path="/signin" component={() => <LoginPage />} />
            //             <Route path="/signup" component={() => <SignUp />} />
            //             <Route path="/dashboard" component={() => <AdminPage />} />
            //             <Route path="/download" component={() => <DownloadDraft />} />
            //             <Route path="/viewsources" component={() => <ViewSources />} />
            //         </Switch>
            //     ) : (
            //             (accessToken && decoded.role === 'ad' && tokenAliveFlag) ? (
            //                 <Switch>
            //                     <Route exact path="/" component={() => <HomePage />} />
            //                     <Route path="/signin" component={() => <LoginPage />} />
            //                     <Route path="/signup" component={() => <SignUp />} />
            //                     <Route path="/dashboard" component={() => <AdminPage />} />
            //                     <Route path="/download" component={() => <DownloadDraft />} />
            //                     <Route path="/viewsources" component={() => <ViewSources />} />
            //                 </Switch>
            //             ) : (
            //                     (accessToken && decoded.role === 'm' && tokenAliveFlag) ? (
            //                         <Switch>
            //                             <Route exact path="/" component={() => <HomePage />} />
            //                             <Route path="/signin" component={() => <LoginPage />} />
            //                             <Route path="/signup" component={() => <SignUp />} />
            //                             <Route path="/download" component={() => <DownloadDraft classes={classes} />} />
            //                             <Route path="/viewsources" component={() => <ViewSources />} />
            //                             <Route path="/dashboard" component={() => <UserDashboard />} />
            //                         </Switch>
            //                     ) : (
            //                             <Switch>
            //                                 <Route exact path="/" component={() => <HomePage />} />
            //                                 <Route path="/signin" component={() => <LoginPage />} />
            //                                 <Route path="/signup" component={() => <SignUp />} />
            //                             </Switch>
            //                         )
            //                 )
            //         )}
            // </BrowserRouter>
        )
    }
}

const mapStateToProps = state => {
    return {
        accessToken: state.auth.accessToken
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setAccessToken: (accessToken) => dispatch(setAccessToken(accessToken))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Routes)