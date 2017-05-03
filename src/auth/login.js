/**
 * Created by Nathaniel on 4/26/2017.
 */
import React, { Component } from 'react';
import { Flex, Box } from 'reflexbox';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import {addNotification as notify} from 'reapop';
import {
  BrowserRouter as Router,
  Redirect
} from 'react-router-dom'
class Login extends Component{
  state = {
    name: null,
    pass: null
  }
  login(){
    this.props.account.login(this.state.name, this.state.pass);
  }
  register(){
    this.props.account.register(this.state.name, this.state.pass);
  }
  changedUsername(text){
    this.setState({name:text});
  }
  changedPassword(text){
    this.setState({pass:text});
  }
  render(){
    if(this.props.account.name!=null){
      return (<Redirect to="/dashboard"/>)
    }
    return (
      <Flex col={12} p={5} align="center" justify="center">
        <Flex lg={6}>
          <Paper style={{width:"100%",paddingBottom:"40px"}}>
            <Subheader>Credentials Required To Continue</Subheader>
            <Flex lg={12} wrap align="center">
              <Box lg={8} p={2}>
                <TextField
                  floatingLabelText="Username"
                  onChange={(e, text)=>{this.changedUsername(text)}}
                  hintText="Anonymous"
                  fullWidth={true}
                /><br/>
                <TextField
                  floatingLabelText="Password"
                  onChange={(e, text)=>{this.changedPassword(text)}}
                  hintText="********"
                  type="password"
                  fullWidth={true}
                />
              </Box>
              <Box lg={4} style={{textAlign:"center"}}>
                  <RaisedButton label="login" onTouchTap={()=>{this.login()}}/><br/><br/>
                <RaisedButton label="register" onTouchTap={()=>{this.register()}}/>
              </Box>
            </Flex>
          </Paper>
        </Flex>
      </Flex>
    )
  }
}
export default Login;