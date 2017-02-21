// evenWarmer.js
// create Request and Response constructors...
const net = require('net');
const HOST = '127.0.0.1';
const PORT = 8080;
const fs = require('fs');

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
    let headers = {};
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
          headers[str] = newParts[i].slice(j+2);
          break;
        }
      }
    }
    this.headers = headers;
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
    for( const val in this.headers){
      if(this.headers.hasOwnProperty(val)){
        s+= val + ": " + this.headers[val]+ "\r\n";
      }
    }
    s += '\r\n';
    s += this.body;
    return s;
  }

}
class Response {
  constructor(sock){
    this.sock = sock;
    this.headers = {};
    this.body = '';
    this.statusCode = '';
    this.statusObject = {
      200: "OK",
      404: 'Not Found',
      500: 'Internal Server Error',
      400: "Bad Request",
      301: "Moved Permanently",
      302: 'Found',
      303: 'See Other'
    };
    this.types = {
      html: "text/html",
      css: "text/css",
      txt: "text/txt",
      jpeg: "image/jpeg",
      jpg: 'image/jpg',
      png: 'image/png',
      gif: 'image/gif'
    }
  }
  setHeader(name, value){
    this.headers[name] = value;
    //console.log(this.headers);
  }
  write(data){
    this.body = data;
    this.sock.write(data);
  }
  end(s){
    if(arguments.length > 0){
      this.sock.end(s);
    }else{
      this.sock.end();
    }
  }
  send(statusCode, body){
    this.statusCode = statusCode;
    this.body = body;
    //console.log(this.body);
    this.end(this.toString());
  }
  writeHead(statusCode){
    this.statusCode = statusCode;
    let s = ''
    s += (`HTTP/1.1 ${this.statusCode} ${this.statusObject[this.statusCode]}\r\n`);
    for(let val in this.headers){
      if(this.headers.hasOwnProperty(val)){
        s += `${val}: ${this.headers[val]}\r\n`
      }
    }
    s+= '\r\n';
    this.write(s);
  }
  redirect(statusCode, url){
    let tempStatusCode, tempUrl;
    if(arguments.length === 2){
      tempStatusCode = arguments[0];
      tempUrl = arguments[1];
    }else if(arguments.length === 1){
      tempStatusCode = 301;
      tempUrl = arguments[0];
    }else{
      throw new Error("incorrect number of arguments");
    }
    //console.log(tempStatusCode);
    this.setHeader("Location", tempUrl);
    this.statusCode = tempStatusCode;
    this.send(tempStatusCode, this.body);
  }
  toString(){
    let s= '';
    s+= (`HTTP/1.1 ${this.statusCode} ${this.statusObject[this.statusCode]}\r\n`);
    for(let x in this.headers){
      if(this.headers.hasOwnProperty(x)){
        s+= (`${x}: ${this.headers[x]}\r\n`);
      }
    }
    s+= '\r\n';
    s += (`${this.body}`);
    return s;
  }
  sendFile(fileName){
    const publicRoot = __dirname.slice(0,-4) + '/public';
    const filePath = publicRoot + fileName;
    //console.log(filePath);
    let fileType = '';
    for(let i=0; i<fileName.length; i++){
      if(fileName[i] === "."){
        fileType += fileName.slice(i+1).trim();
      }
    }
    let encoding;
    if(this.types[fileType].split('/')[0] === "text"){
      encoding = 'utf8';
    }else if(this.types[fileType].split('/')[0] === 'image'){
      encoding = null;
    }
      //console.log(filePath);
      fs.readFile(filePath, encoding, (err,data) => {
        if(err){
          //console.log(err);
          this.setHeader('Content-Type', 'text/plain');
          this.send(500, 'Internal Server Error');
          throw err;
        }else{
          //console.log(this.types[fileType]);
          this.setHeader('Content-Type', this.types[fileType]);
          //console.log(encoding);
          //console.log(this.headers);
          this.writeHead(200);
          //console.log(data);
          //console.log(this);
          this.write(data);
          this.end();
        }
      });
  }
}

const server = net.createServer((sock)=>{
  sock.on('data', (binaryData) => {
    //console.log(binaryData+'');
    //creates a request Object with the constructor
    const req = new Request(binaryData+'');
    const res = new Response(sock);
    //console.log(req.path);
    if(req.path === "/"){
      res.setHeader('Content-Type','text/html');
      res.send(200,'<link rel = "stylesheet" type = "text/css" href = "foo.css"> <h2>this is a red header</h2><em>Hello</em> <strong>World</strong>');
    }else if(req.path === "/foo.css"){
      res.setHeader('Content-Type', 'text/css');
      res.send(200, 'h2 {color: red;}');
    }else if(req.path === "/test"){
      res.sendFile("/html/test.html");
    }else if(req.path === "/bmo1.gif"){
      res.sendFile("/img/bmo1.gif");
    }else{
      res.setHeader('Content-Type', 'text/plain');
      res.send(404, 'uh oh... 404 page not found!');
    }

  });
});
server.listen(PORT, HOST);

module.exports = {
  Request: Request,
  Response: Response
}
