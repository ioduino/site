/**
 * Created by Nathaniel on 4/25/2017.
 */
class NetworkService{
  stompClient = {};
  stompConnectedId = -1;
  selected = localStorage.getItem("selectedNetwork");
  list = [];
  account = {};
  devicesObjs = {};
  devicesArray = [];
  e = {};
  constructor(e, stompClient, account){
    this.session = localStorage.getItem("session");
    this.e = e;
    this.account = account;
    this.stompClient = stompClient;
    var self = this;
    this.stompClient.register([
      { route: '/client/network/devices', callback: this.deviceReceived, parent: this },
      { route: '/client/network/register', callback: this.registerReceived, parent: this },
      { route: '/client/network/list', callback: this.listReceived, parent: this },
      { route: '/client/valve/action', callback: this.valveAction, parent: this }
    ]);
    this.account.eventRegister("login_pass", (data)=>{
      self.stompClient.send("/server/network/list",{session: data.sessionKey});
      self.stompClient.registerAfter([
        { route: '/client/valve/update/'+data.sessionKey, callback: self.valveUpdate, parent: self } // use sessionkey to get valve updates
      ]);
    })-1;

  }
  selectNetwork(n){
    this.selected = n;
    localStorage.setItem("selectedNetwork", n);
    this.e.forceUpdate();
    this.devices(this);
  }
  valveUpdate(valve, parent){
    var oldValveState = parent.devicesObjs[valve.name];
    if(oldValveState.state==1 && valve.state==0){
      parent.e.props.notify({
        title: valve.name+' action completed',
        message: 'Valve has closed',
        status: 'success',
        dismissible: true,
        position:'tc',
        dismissAfter: 2000
      });
    }else if(oldValveState.state==0 && valve.state==1){
      parent.e.props.notify({
        title: valve.name+' action completed',
        message: 'Valve has opened',
        status: 'success',
        dismissible: true,
        position:'tc',
        dismissAfter: 2000
      });
    }else{
      parent.e.props.notify({
        title: valve.name+' action completed',
        message: 'Valve did not change...',
        status: 'error',
        dismissible: true,
        position:'tc',
        dismissAfter: 2000
      });
    }
    parent.devicesObjs[valve.name] = valve;
    parent.e.forceUpdate();
  }
  valveAction(actionResult){
    console.log(actionResult);
  }
  deviceReceived(action, parent){
    parent.devicesObjs = action;
    parent.devicesArray = Object.keys(action);
    parent.e.forceUpdate();
  }
  registerReceived(data, parent){
    console.log(data);
    if(data.code!=null){
      parent.e.props.notify({
        title: 'Error registering network!',
        message: data.message,
        status: 'error',
        dismissible: true,
        position:'tc',
        dismissAfter: 2000
      });
    }else{
      parent.e.props.notify({
        title: 'Registered Successfully',
        message: 'Registered to network '+data.label,
        status: 'success',
        dismissible: true,
        position:'tc',
        dismissAfter: 2000
      });
    }
  }
  listReceived(data, parent){
    parent.list = data;
    if(parent.selected!=null){
      parent.devices(parent);
    }
    parent.e.forceUpdate();
  }
  devices(parent){
    var self = parent;
    if(self.list!=null) {
      self.list.forEach((i) => {
        if (i.uuid == self.selected) {
          self.stompClient.send("/server/network/devices", {
            session: self.account.session,
            label: i.label,
            uuid: i.uuid
          });
        }
      });
    }
  }
  action(deviceName, action){
    var self = this;
    self.stompClient.send("/server/valve/action", {
      session: self.account.session,
      network: self.selected,
      action:action,
      valve: deviceName
    });
  }
  register(label, identifier){
    this.stompClient.send("/server/network/register", {session: this.account.session, label:label, uuid: identifier});
    this.e.forceUpdate();
  }
}
export default NetworkService;