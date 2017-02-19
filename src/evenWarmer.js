// evenWarmer.js
// create Request and Response constructors...
const net = require('net');
const HOST = '127.0.0.1';
const PORT = 8080;

class Request {
  constructor(s) {
    const requestParts = s.split(' ');
    //console.log(requestParts.length);
    const method = requestParts[0];
    this.method = method;
    this.requestParts = requestParts;
    const path = requestParts[1];
    this.path = path;
    let newParts = requestParts.slice(2);
    newParts = newParts.join(' ');
    newParts = newParts.split('\r\n');
    newParts = newParts.slice(1);
    //console.log(newParts);
    //newParts = newParts.join('\r\n');
    //newParts = newParts.split(':');
    //console.log(newParts.length);
    //console.log(newParts);
    let header = {};
    let i =0;
    for(i; i<newParts.length; i++){
      let str ='';
      if(newParts[i]===''){
        break;
      }
      for(let j =0; j<newParts[i].length; j++){
        if(newParts[i][j]!==":"){
          str+= newParts[i][j];
        }else{
          header[str] = newParts[i].slice(j+2);
          break;
        }
      }
    }
    this.header = header;
    let body;
    if(newParts[i+1]===undefined){
      body = '';
    }else{
      body = newParts[i+1];
    }
    this.body = body;
  }
  toString(){
    let s = '';
    s+= this.method + " " + this.path + " " + "HTTP/1.1\r\n";
    for( const val in this.header){
      if(this.header.hasOwnProperty(val)){
        s+= val + ": " + this.header[val]+ "\r\n";
      }
    }
    s += '\r\n';
    s += this.body;
    return s;
  }

}
class Response {
  constructor(s){

  }
}

const server = net.createServer((socket)=>{
  socket.on('data', (binaryData) => {
    //creates a request Object with the constructor
    const req = new Request(binaryData+'');
    console.log(req.header);
    socket.end();
  });
});
server.listen(PORT, HOST);

module.exports = {
  Request: Request
}
