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
          header[str] = newParts[i].slice(j+1).trim();
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

  constructor(sock){
    this.sock = sock;
    this.headers = {};
    this.body = '';
    this.statusCode = '';
  }
  setHeader(name, value){
    this.headers[name] = value;
  }
  write(data){
    this.sock.write(data);
  }
  end(s){
    this.sock.write(s);
    this.sock.end();
  }
  send(statusCode, body){
    this.statusCode = statusCode;
    this.body = body;
    this.sock.end(`HTTP/1.1 ${statusCode} OK
      Content-Type: text/html
      ${body}`);
  }
  writeHead(statusCode){
    this.statusCode = statusCode;
    this.write(`HTTP/1.1 ${statusCode} OK
      Content-Type: text/html`);
  }
  redirect(statusCode, url){
    this.headers.Location = url;
    if(arguments.length > 1){
      this.sock.statusCode = statusCode;
    }
    this.sock.end(`HTTP/1.1 ${this.statusCode}
      ${this.headers}`);
  }
  toString(){
    let s= '';
    let message = '';
    if(this.sock.statusCode === "200"){
      message = "OK";
    }else if(this.sock.statusCode === "404"){
      message = 'Not Found';
    }else if(this.sock.statusCode === "500"){
      message = 'Internal Server Error';
    }else if(this.sock.statusCode === "400"){
      message = "Bad Request";
    }else if(this.sock.statusCode === "301"){
      message = "Moved Permanently";
    }else if(this.sock.statusCode === "302"){
      message = "Found";
    }else if(this.sock.statusCode === "303"){
      message = "See Other"
    }
    s+= (`HTTP1.1 ${statusCode} ${message}
      ${headers}
      ${body}`);
    return s;
  }
}
