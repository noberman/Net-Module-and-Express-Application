// warmUp.js
const net = require('net');
const HOST = '127.0.0.1';
const PORT = 8080;

// objects that represents an http request and response
class Request {
  constructor(s) {
    const requestParts = s.split(' ');
    this.requestParts = requestParts;
    const path = requestParts[1];
    this.path = path;
  }
}
class Response {
  constructor(s){

  }
}

const server = net.createServer((socket)=>{
  // show the connected client's ip address and port
  // console.log(socket.remoteAddress, socket.remotePort);


  // convert buffer object to string, and use request object
  // to parse http request string into actual object

  // console.log(`got connection from ${socket.remoteAddress}:${socket.remotePort}`);
  // socket.on('data', (binaryData) => {
  //     socket.write('hello world');
  //     socket.end();
  // });
  //
  // socket.on('close', (data) => {
  //     console.log(`closed `);
  // });
  // socket.on('data', function(binaryData) {
  // // console.log('got data\n=====\n' + binaryData);
  // // socket.write(binaryData);
  //   const req = new Request(binaryData + '');
  //   console.log('path', req.path);
  //
  //   socket.write(binaryData);
  //   socket.end();
  // });

  //serving content
  //console.log('connected', socket.remoteAddress, socket.remotePort);
  // socket.on('data', (binaryData) => {
  //   //converts to string
  //   const reqString = binaryData+'';
  //   //creates a request Object with the constructor
  //   const req = new Request(reqString);
  //   console.log(req.requestParts);
  //   console.log(req.path);
  //   if(req.path === '/about') {
  //     socket.write('HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n<h2>hello</h2>');
  //   } else  if(req.path === '/test') {
  //     socket.write('HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n<h2>test</h2>');
  //   }
  //   socket.end();
  // });

  socket.write('HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n<em>Hello</em> <strong>World</strong>');
  socket.end();
});
server.listen(PORT, HOST);
