/**
 * Created by Nathaniel on 4/25/2017.
 */
class Account {
  e = {};
  stompClient = {};
  stompConnectedId = -1;
  events = {};
  constructor(e, stompClient){
    this.session = localStorage.getItem("session");
    this.e = e;
    this.stompClient = stompClient;
    var self = this;
    this.stompClient.register([
      { route: '/client/login', callback: this.loginReceived, parent: this },
      { route: '/client/logout', callback: this.logoutReceived, parent: this },
      { route: '/client/register', callback: this.registerReceived, parent: this },
      { route: '/client/session', callback: this.sessionReceived, parent: this }
    ]);
    this.stompConnectedId = this.stompClient.stompConnected((frame)=>{
      self.sessionCheck();
    })-1;
    console.log(this.stompConnectedId);
  }
  eventRegister( event, callback ){
    if(this.events[event]==null) {
      this.events[event] = new Array();
    }
    return this.events[event].push(callback);
  }
  eventUnregister(event, id){
    // do later
  }
  eventCall( event, data){
    if(this.events[event]!=null){
      this.events[event].forEach((func)=>{
        func(data,this);
      });
    }
  }
  name = null;
  session = null;
  id = null;
  networks = null;
  sessionCheck(){
    if(this.session!=null) {
      this.stompClient.send("/server/session", {session: this.session})
    }
  }
  login(name, pass){
    this.stompClient.send("/server/login",{name:name, password: pass});
  };
  register(name, pass){
    this.stompClient.send("/server/register",{name:name, password: pass});
  }
  logout(){
    this.stompClient.send("/server/logout",{});
  }
  loginReceived(data, parent){
    if(data.account!=null){
      parent.name = data.account.user;
      parent.session = data.sessionKey;
      parent.id = data.id;
      localStorage.setItem("session", parent.session);
      parent.e.forceUpdate();
      parent.e.props.notify({
        title: 'Welcome '+parent.name+'!',
        message: 'Redirected to dashboard...',
        status: 'success',
        dismissible: true,
        position:'tc',
        dismissAfter: 900
      });
      parent.eventCall("login_pass", data);
    }else{
      parent.e.props.notify({
        title: 'Error logging in!',
        message: data.message,
        status: 'error',
        dismissible: true,
        position:'tc',
        dismissAfter: 1000
      });
      parent.eventCall("login_fail", data);
    }
  }
  sessionReceived(data, parent){
    if(data.account!=null){
      parent.name = data.account.user;
      parent.session = data.sessionKey;
      parent.id = data.id;
      localStorage.setItem("session", parent.session);
      parent.e.forceUpdate();
      parent.e.props.notify({
        title: 'Welcome back '+parent.name+'!',
        message: 'Redirected to dashboard...',
        status: 'success',
        dismissible: true,
        position:'tc',
        dismissAfter: 900
      });
      parent.eventCall("login_pass", data);
      parent.eventCall("session_pass", data);
    }else{
      parent.name = null;
      parent.session = null;
      parent.id = null;
      localStorage.removeItem("session");
      parent.e.forceUpdate();
      parent.e.props.notify({
        title: 'Session error!',
        message: data.message,
        status: 'error',
        dismissible: true,
        position:'tc',
        dismissAfter: 1000
      });
      parent.eventCall("session_fail", data);
    }
  }
  registerReceived(data, parent){
    if(data.account!=null){
      parent.name = data.account.user;
      parent.session = data.sessionKey;
      parent.id = data.id;
      localStorage.setItem("session", parent.session);
      parent.e.forceUpdate();
      parent.e.props.notify({
        title: 'Welcome '+parent.name+'!',
        message: 'Account registered, redirecting you to dashboard!',
        status: 'success',
        dismissible: true,
        position:'tc',
        dismissAfter: 900
      });
      parent.eventCall("register_pass", data);
      parent.eventCall("login_pass", data);
    }else{
      parent.e.props.notify({
        title: 'Registration Error!',
        message: data.message,
        status: 'error',
        dismissible: true,
        position:'tc',
        dismissAfter: 1500
      });
      parent.eventCall("register_fail", data);
    }
  }
  logoutReceived(data, parent){
    parent.name = null;
    parent.session = null;
    parent.id = null;
    localStorage.removeItem("session");
    parent.e.forceUpdate();
    parent.e.props.notify({
      title: 'You have logged out!',
      message: 'Redirected to login!',
      status: 'success',
      dismissible: true,
      position:'tc',
      dismissAfter: 900
    });
    parent.eventCall("logout_pass", data);
  }
}
export default Account;