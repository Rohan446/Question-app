import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Questions from './components/Questions';
import Login from './components/Login';
import Register from './components/Register';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {login,addUser} from './actions/actions'

class App extends React.Component {
  
  state ={
    isLoggerIn : false
  }

   componentDidMount() {
     console.log(this.props.loggedIn);
     console.log(this.props.user);
     let headder = {
          method:'GET',
          headers: { 'Content-Type': 'application/json' }
     }
     
    fetch("https://quiet-shelf-71244.herokuapp.com/session/check",headder)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        this.props.dispatch(login(res.response));
        this.setState({isLoggerIn:res.response});
      })
  }

  checkSession(value){
    return value ?  "" : <Redirect to="/login"/>
  }

  render() {
    console.log("Came into app");
    return (
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            render={() => {
              return (
                this.state.isLoggerIn ?
                  <Redirect to="/questions" /> :
                  <Redirect to="/login" />
              )
            }}
          />
          <Route exact path="/questions" component={Questions} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          {this.checkSession(this.props.loggedIn)}
        </Switch>
      </Router>
    );
  }
}

function mapState(state){
  return {
    loggedIn : state.login,
    user : state.user
  }
}

export default connect(mapState)(App);
