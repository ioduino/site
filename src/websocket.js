/**
 * Created by Nathaniel on 4/26/2017.
 */
class StompClient{
  SockJS = require('sockjs-client');
  Stomp = require('estompjs');
  client = {};
  uuid = "";
  stack = new Array();
  events = {};
  constructor(url){
    const uuidV4 = require('uuid/v4');
    this.uuid = uuidV4();
    var self = this;
    this.client = this.Stomp.over(()=>{
      return new self.SockJS(url);
    });
    this.client.reconnect_delay = 5000;
    this.client.onStompConnected = (frame)=>{
      console.log("what?");
      if(this.events.stompConnected==null){
        return;
      }
      self.events.stompConnected.forEach((x)=>{
        x(frame);
      });
    }
    self.client.connect();
    self.stompConnected((frame)=> {
      self.registrations.forEach((group)=>{
        group.forEach((registration) => {
          self.client.subscribe(registration.route + "/" + self.uuid, (m) => {
            var data = JSON.parse(m.body);
            registration.callback(data, registration.parent);
          });
        });
      });
    });
  }
  registrations = [];

  stompConnected(callback){
    if(this.events.stompConnected==null) {
      this.events.stompConnected = new Array();
    }
    return this.events.stompConnected.push(callback);
  }

  uregister(event, id){
    // do later
  }
  register(registrations) {
    this.registrations.push(registrations);
    console.log(this.registrations);
  }
  queueHandler = {};
  handleQueue(self){
    console.log("connected? "+self.client.connected);
    if(!self.client.connected) {

      clearTimeout(self.queueHandler);
      self.queueHandler = setTimeout(()=>{
        self.handleQueue(self);
      },10);
    }else{
      var data = self.stack.pop();
      self.client.send(data[0], {}, JSON.stringify(data[1]));
      if(self.stack.length>0){
        self.queueHandler = setTimeout(()=>{
          self.handleQueue(self);
        },10);
      }
    }
  }
  send(target, data){
    data.instance = this.uuid;
    if(this.client.connected) {
      this.client.send(target, {}, JSON.stringify(data));
    }else{
      this.stack.push([target, data]);
      var self = this;
      clearTimeout(self.queueHandler);
      self.queueHandler = setTimeout(()=>{
        self.handleQueue(self);
      },10);
    }
  }
  unregister(){
    var self = this;
    this.registrations.forEach((registration)=>{
      self.client.unsubscribe(registration.route+"/"+self.uuid);
    })
  }
}

export default StompClient;