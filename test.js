class RequestK{
  constructor(httpRequest){
    const tokens = httpRequest.split("\r\n");
    const path = tokens[0].trim().split(" ")[1];
    const method =tokens[0].trim().split(" ")[0];
    let i=1;
    const header={};
    while(tokens[i]!==""){
      const temp=tokens[i].trim().split(": ");
      header[temp[0].trim()] = temp[1].trim();
      i++;

    }
    const body = tokens[i+1].trim();

    this.path = path;
    this.method=method;
    this.header=header;
    this.body=body;
  }

  toString(){
    let s="";
    s+=`${this.method} ${this.path} HTTP/1.1\r\n`;

    for(const key in this.headers){
      if(this.header.hasOwnProperty(key)){
        s+=`${key}: ${this.headers[key]}\r\n`;
      }
    }
    s+="\r\n";
    s+=this.body;
    return s;
  }

}

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


let s = 'GET /foo.html HTTP/1.1\r\n';
s += 'Host: localhost:8080\r\n';
s += 'Referer: http://bar.baz/qux.html\r\n';
s += '\r\n';
s += 'foo=bar&baz=qux';

const req = new Request(s);

console.log(req.header);
console.log(req.body);
