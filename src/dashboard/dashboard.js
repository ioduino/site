/**
 * Created by Nathaniel on 4/25/2017.
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
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardText, CardTitle} from 'material-ui/Card';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Network from './network';

class Dashboard extends Component {
  state = {
    network: 1
  };
  self = this;
  selectNetwork(e, k, p){
    this.props.network.selectNetwork(p);
  }
  render(){
    if(this.props.account.name==null){
      return (<Redirect to="/login"></Redirect>);
    }
    return (
        <Flex col={12} wrap px={2}>
          <Box lg={2} my={2} sm={3} col={12} wrap>
            <Box lg={12} sm={12} col={12} py={2}>
              <Card>
                <CardTitle
                  title="Network Selection"
                  subtitle="Individual devices"
                />
                <CardText>
                  <SelectField
                    floatingLabelText="Select network"
                    value={this.props.network.selected}
                    onChange={(e, t, p)=>{this.selectNetwork(e, t, p)}}
                  >
                    <MenuItem value={"null"} primaryText="Nothing selected" />
                    {this.props.network.list.map(network=>(
                      <MenuItem key={network.id} value={network.uuid} primaryText={network.label} />
                    ))}
                  </SelectField>
                </CardText>
                <CardActions>
                  <Link to="/dashboard/network/add"><FlatButton label="Add Network" primary /></Link>
                </CardActions>
              </Card>
            </Box>
          </Box>
          <Box lg={10} col={12} my={2} wrap>
            <Route path="/dashboard/network" render={() => (
              <Network account={this.props.account} network={this.props.network}/>
            )}/>
            <Route path="/dashboard" render={() => (
              <Network account={this.props.account} network={this.props.network}/>
            )}/>
            {(this.props.network.selected=="null") && (
              <Box p={2}><h2>You need to select a network</h2></Box>
            )}
          </Box>
        </Flex>
    );
  }
}
export default Dashboard;