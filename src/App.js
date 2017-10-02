import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Flex, Box } from 'reflexbox'
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import Dashboard from './dashboard/dashboard';
import Login from './auth/login'
import Account from './services/account';
import NetworkService from './services/networkService';
import StompClient from './websocket';
import theme from 'reapop-theme-wybo';
import NotificationsSystem from 'reapop';
import {connect} from 'react-redux';
import {addNotification as notify} from 'reapop';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom'
import './App.css';



class App extends Component {
  client = new StompClient("https://api.ioduino.net/socket");

  account = new Account(this, this.client);
  network = new NetworkService(this, this.client, this.account);

  state ={ account: this.account, network: this.network };

  componentDidMount() {

  }

  render() {
    return (
      <div>
        <NotificationsSystem theme={theme}/>
        <MuiThemeProvider>
          <Router>
            <div className="App root">
              <AppBar
                title={<span><Link to="/">IODuino</Link></span>}
                iconElementLeft={<span></span>}
                iconElementRight={
                  <Flex wrap>
                    <Box p={1} auto>{(this.state.account.name==null)?"":<RaisedButton onTouchTap={()=>{ this.state.account.logout() }}>Logout</RaisedButton>}</Box>
                  </Flex>
                }
              />
              <Route exact path="/" render={() => (
                <Redirect to="/dashboard"/>
              )}/>
              <Route exact path="/login" render={() => (
                <Login account={this.state.account} />
              )}/>
              <Route path="/dashboard" render={() => (
                <Dashboard account={this.account} network={this.network} />
              )}/>
            </div>
          </Router>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default connect(null, {notify})(App);
