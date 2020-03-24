import React from 'react';
import './components/css/style.css';
// import Routes from './components/Routes';
import Wrapper from './components/Wrapper';
import HomePage from './components/HomePage';
import SignUp from './components/SignUp';
import LoginPage from './components/LoginPage';
import { Redirect, Route, Switch, BrowserRouter } from 'react-router-dom';

function App(props) {
  // const { classes } = props;
  console.log('Reached App page')
  return (
      // <Grid container className={classes.root}>
          // <Routes />
          <BrowserRouter>
            <Switch>
              <Route exact path="/signin" component={() => <LoginPage />} /> */}
              <Route path="/signup" component={() => <SignUp />} />
              <Route exact path="/" component={() => <HomePage />} />
              <Route path="/app" component={() => <Wrapper />} />
            </Switch>
          </BrowserRouter>
          
      // </Grid>
  );
}

// App.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

// export default withStyles(styles)(App);
export default App