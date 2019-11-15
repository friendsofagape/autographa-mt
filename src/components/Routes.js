import React, { Component } from 'react'
import jwt_decode from 'jwt-decode';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import SignUp from './SignUp';
import AdminPage from './Administration/AdminPage'
import DownloadDraft from './DownloadDraft';
import ViewSources from './ViewSources';
import UserDashboard from './Users/UserDashboard';
import { connect } from 'react-redux';
import { setAccessToken } from '../store/actions/authActions';


class Routes extends Component {
    state = {
        redirect: false,
        accessToken: "",
        decode: {},
    }

    componentDidMount() {
        var accessToken = localStorage.getItem('accessToken')
        if (accessToken) {
            this.setState({ decoded: jwt_decode(accessToken) })
            this.setState({ accessToken });
        if(!this.props.accessToken){
            this.props.setAccessToken({accessToken})
            this.setState({ decoded: jwt_decode(accessToken) })
        }
            // this.props.setAccessToken({accessToken})
        }
    }
    render() {
        var { decoded } = this.state;
        const { classes, accessToken } =  this.props
        var tokenAliveFlag = true;
        return (
            <BrowserRouter>
                {(decoded && accessToken && decoded.role === 'sa' && tokenAliveFlag) ? (
                    <Switch>
                        <Route exact path="/" component={() => <HomePage  />} />
                        <Route path="/signin" component={() => <LoginPage  />} />
                        <Route path="/signup" component={() => <SignUp />} />
                        <Route path="/dashboard" component={() => <AdminPage />} />
                        <Route path="/download" component={() => <DownloadDraft />} />
                        <Route path="/viewsources" component={() => <ViewSources />} />
                    </Switch>
                ) : (
                        (accessToken && decoded.role === 'ad' && tokenAliveFlag) ? (
                            <Switch>
                                <Route exact path="/" component={() => <HomePage  />} />
                                <Route path="/signin" component={() => <LoginPage  />} />
                                <Route path="/signup" component={() => <SignUp />} />
                                <Route path="/dashboard" component={() => <AdminPage />} />
                                <Route path="/download" component={() => <DownloadDraft />} />
                                <Route path="/viewsources" component={() => <ViewSources />} />
                            </Switch>
                        ) : (
                                (accessToken && decoded.role === 'm' && tokenAliveFlag) ? (
                                    <Switch>
                                        <Route exact path="/" component={() => <HomePage  />} />
                                        <Route path="/signin" component={() => <LoginPage  />} />
                                        <Route path="/signup" component={() => <SignUp />} />
                                        <Route path="/download" component={() => <DownloadDraft classes={classes} />} />
                                        <Route path="/viewsources" component={() => <ViewSources />} />
                                        <Route path="/dashboard" component={() => <UserDashboard />} />
                                    </Switch>
                                ) : (
                                        <Switch>
                                            <Route exact path="/" component={() => <HomePage  />} />
                                            <Route path="/signin" component={() => <LoginPage  />} />
                                            <Route path="/signup" component={() => <SignUp />} />
                                        </Switch>
                                    )
                            )
                    )}
            </BrowserRouter>
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