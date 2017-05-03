/**
 * Created by Nathaniel on 4/28/2017.
 */
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Link
} from 'react-router-dom'
import { Flex, Box } from 'reflexbox'
import {
  List,
  ListItem,
  ListItemText,
} from 'material-ui/List';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardText, CardTitle} from 'material-ui/Card';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';

class Network extends Component{
  labelChange(data){
    this.setState({label:data});
  }
  identifierChange(data){
    this.setState({identifier:data});
  }
  openValve(name){

  }
  closeValve(name){

  }
  valve(valveData, name){
    return (
      <Box key={valveData.uuid} p={2} lg={4}>
        <Card className="paper" initiallyExpanded={true}>
          <CardHeader
            title={"Device \""+valveData.name+"\""}
          />
          <CardText>
            Valve Controlling some aspect
          </CardText>
          <CardActions>
            {
              (valveData.state===0)?
                <FlatButton label="Open Valve" onTouchTap={()=>{ this.props.network.action(name, 'open')}} primary={true}/>
                :
                <FlatButton label="Close Valve" onTouchTap={()=>{ this.props.network.action(name, 'close')}} secondary={true}/>
            }
            <FlatButton label="Schedule" />
          </CardActions>
        </Card>
      </Box>
    );
  }
  render() {
    const style = {
      paper: {
        width: '100%'
      },
      label:{
        textAlign:'center',
        paddingTop:'40px'
      },
      right:{
        textAlign:'right'
      }
    };
    return (
      <div>
        {(this.props.network.selected!="null") && (
        <Route path="/dashboard/network/add" exact render={() => (
          <Box col={12} p={2}>
            <Paper style={style.paper} zDepth={1}>
              <Flex col={12} wrap>
                <Box col={12}>
                  <Subheader>Adding Network</Subheader>
                </Box>
                <Box p={2} col={6} style={style.label}>
                  Found through the browser http://deviceip:8080/<br/><br/>
                  <Subheader>Example: "Device Network: 9c8b7089-684e-4b2c-9879-daf5c2d1918d"</Subheader>
                </Box>
                <Box p={2} col={6}>
                  <TextField
                    hintText="found on device"
                    floatingLabelText="Network Identifier"
                    onChange={(e, text)=>{this.identifierChange(text)}}
                    fullWidth={true}
                  />
                </Box>
                <Box p={2} col={6} style={style.label}>
                  Just give the network a easily identified name
                </Box>
                <Box p={2} col={6}>
                  <TextField
                    hintText="My Network"
                    floatingLabelText="Label"
                    onChange={(e, text)=>{this.labelChange(text)}}
                    fullWidth={true}
                  />
                </Box>
                <Box p={2} col={12} style={style.right}>
                  <RaisedButton label="Save Label" primary onTouchTap={()=>{this.props.network.register(this.state.label, this.state.identifier);}} />
                </Box>
              </Flex>
            </Paper>
          </Box>
        )}/>)}
        <Route path="/dashboard" exact render={()=>(
          <Flex wrap lg={12}>
            {this.props.network.devicesArray.map((device)=>this.valve(this.props.network.devicesObjs[device], device))}
          </Flex>
        )}/>
      </div>
    );
  }
}

export default Network;